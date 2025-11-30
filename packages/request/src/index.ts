import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import type {
  RequestConfig,
  PostArgs,
  RequestType,
  NotificationHandler,
  StorageHandler,
  LanguageHandler,
} from './types';

// Re-export types
export type {
  RequestConfig,
  PostArgs,
  RequestType,
  NotificationHandler,
  StorageHandler,
  LanguageHandler,
};

// Default configuration
const defaultConfig: RequestConfig = {
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': true,
    'X-Frame-Options': true,
    'Content-Security-Policy': true,
  },
};

const defaultRequestType: RequestType = {
  contentType: 0,
  responseType: 0,
};

const axiosHeaders = {
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': true,
    'X-Frame-Options': true,
    'Content-Security-Policy': true,
  },
};

const axiosFileHeaders = {
  headers: {
    'Content-Type': 'multipart/form-data',
    'Access-Control-Allow-Origin': true,
    'X-Frame-Options': true,
    'Content-Security-Policy': true,
  },
};

const axiosStreamHeaders = {
  headers: {
    Accept: 'application/octet-stream, */*',
    'Access-Control-Allow-Origin': true,
    'X-Frame-Options': true,
    'Content-Security-Policy': true,
  },
};

const axiosResponseTypes = ['json', 'text', 'arraybuffer', 'blob'];

const defaultErrorMessage = 'Error encountered. Please contact System Administrator!';

export class RequestClient {
  private instance: AxiosInstance;
  private notificationHandler?: NotificationHandler;
  private storageHandler?: StorageHandler;
  private languageHandler?: LanguageHandler;
  private errorMessage: string = defaultErrorMessage;

  constructor(config?: RequestConfig) {
    const mergedConfig = { ...defaultConfig, ...config };
    this.instance = axios.create(mergedConfig);
    this.setupInterceptors();
  }

  /**
   * Set notification handler for showing notifications
   */
  setNotificationHandler(handler: NotificationHandler) {
    this.notificationHandler = handler;
  }

  /**
   * Set storage handler for getting user info and tokens
   */
  setStorageHandler(handler: StorageHandler) {
    this.storageHandler = handler;
  }

  /**
   * Set language handler for getting current language
   */
  setLanguageHandler(handler: LanguageHandler) {
    this.languageHandler = handler;
  }

  /**
   * Set custom error message
   */
  setErrorMessage(message: string) {
    this.errorMessage = message;
  }

  private showNotification(type: 'success' | 'error' | 'warning', message: string, code?: string | number) {
    if (this.notificationHandler) {
      this.notificationHandler.showNotification(type, message, code);
    } else {
      // Fallback to console or custom event
      const event = new CustomEvent('showNotification', {
        detail: { type, message, code },
      });
      window.dispatchEvent(event);
    }
  }

  private setupInterceptors() {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config: any) => {
        if (this.languageHandler) {
          config.headers['Accept-Language'] = this.languageHandler.getLang();
        }
        if (this.storageHandler) {
          const userInfo = this.storageHandler.get('useragent') || this.storageHandler.get('userInfo');
          if (userInfo?.token) {
            config.headers.Authorization = `${userInfo.token}`;
          }
        }
        return config;
      },
      (error: any) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        // Check if it's a file response
        const isFileResponse =
          response?.data instanceof Blob ||
          response?.data instanceof ArrayBuffer ||
          (typeof response?.data === 'string' && response?.data.includes('[Content_Types].xml')) ||
          response?.headers?.['content-type']?.includes('application/octet-stream') ||
          response?.headers?.['content-disposition']?.includes('attachment');

        if (isFileResponse) {
          return response;
        }

        if (response?.data?.code < 0) {
          this.showNotification('error', response?.data?.remarks || response?.data?.msg, response?.data?.code);
        }
        return response.data || response;
      },
      async (error: any) => {
        if (error.response?.status === 401) {
          return {
            error: 0,
          };
        }

        // Handle blob error responses
        if (error.response && error.config?.responseType === 'blob' && error.response.data instanceof Blob) {
          try {
            const text = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsText(error.response.data);
            });
            const errorObj = JSON.parse(text);
            if (errorObj.code !== undefined) {
              this.showNotification('error', errorObj.remarks || errorObj.msg || 'Request failed', errorObj.code);
              error.response.data = errorObj;
            }
          } catch (e) {
            // Parsing failed, continue with normal error handling
          }
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * GET request
   */
  async get(url: string, params: any = {}, args?: PostArgs): Promise<any> {
    return new Promise((resolve, reject) => {
      args?.startLoading?.();
      const language = this.languageHandler?.getLang() || 'en';
      
      this.instance
        .get(url, {
          params: {
            language,
            ...params,
          },
        })
        .then((response: any) => {
          const { code, remarks } = response || {};
          if (code < 0) {
            if (remarks && ![-1009].includes(code)) {
              this.showNotification('error', remarks, code);
            }
          } else if (code != 0) {
            if (remarks && ![-1009].includes(code)) {
              this.showNotification('warning', remarks, 'operationFailed');
            }
          }
          resolve(response);
        })
        .catch((error: any) => {
          this.showNotification('error', this.errorMessage);
          reject(error);
        })
        .finally(() => {
          args?.stopLoading?.();
        });
    });
  }

  /**
   * POST request
   */
  async post(url: string, data: any, reqType?: RequestType, args?: PostArgs): Promise<any> {
    if (!reqType) {
      reqType = defaultRequestType;
    }

    return new Promise((resolve, reject) => {
      args?.startLoading?.();
      
      const configs: any =
        reqType.contentType === 0
          ? axiosHeaders
          : reqType.responseType === 3
          ? axiosStreamHeaders
          : axiosFileHeaders;
      configs['responseType'] = axiosResponseTypes[reqType.responseType || 0];

      const language = this.languageHandler?.getLang() || 'en';
      let actionId = '';
      
      if (this.storageHandler) {
        const userInfo = this.storageHandler.get('userInfo');
        const createDateTime = this.storageHandler.get('createDateTime') || Date.now();
        actionId = `${createDateTime}_${userInfo?.userId || 0}`;
      }

      // Prepare data
      let requestData: any;
      if (reqType.contentType === 1) {
        // FormData
        if (data instanceof FormData) {
          data.append('language', language);
          if (actionId) {
            data.append('actionId', actionId);
          }
          requestData = data;
        } else {
          const formData = new FormData();
          Object.keys(data).forEach((key) => {
            formData.append(key, data[key]);
          });
          formData.append('language', language);
          if (actionId) {
            formData.append('actionId', actionId);
          }
          requestData = formData;
        }
      } else {
        // JSON
        requestData = {
          language,
          ...data,
        };
        if (actionId) {
          requestData.actionId = actionId;
        }
      }

      this.instance
        .post(url, requestData, configs)
        .then((response: any) => {
          if (reqType?.contentType === 0 && reqType?.responseType === 0) {
            const { code, remarks, msg } = response || {};
            if (code < 0) {
              if (remarks && ![-1009].includes(code)) {
                this.showNotification('error', remarks || msg, code);
              }
            } else if (code > 0) {
              if (remarks && ![-1009].includes(code)) {
                this.showNotification('warning', remarks || msg, 'operationFailed');
              }
            } else {
              if (remarks && ![-1009].includes(code)) {
                this.showNotification('success', remarks || msg);
              }
            }
          }
          resolve(response);
        })
        .catch(async (err: any) => {
          // Handle blob error responses
          if (err.response && reqType?.responseType === 3 && err.response.data instanceof Blob) {
            try {
              const text = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsText(err.response.data);
              });
              const errorObj = JSON.parse(text);
              if (errorObj.code !== undefined) {
                this.showNotification('error', errorObj.remarks || errorObj.msg || 'Request failed', errorObj.code);
                err.response.data = errorObj;
                reject(err);
                return;
              }
            } catch (e) {
              // Parsing failed
            }
          }
          this.showNotification('error', this.errorMessage);
          reject(err);
        })
        .finally(() => {
          args?.stopLoading?.();
        });
    });
  }

  /**
   * Get the axios instance for advanced usage
   */
  getInstance(): AxiosInstance {
    return this.instance;
  }
}

// Create default instance
let defaultClient: RequestClient | null = null;

/**
 * Initialize the default request client
 */
export function initRequestClient(config?: RequestConfig): RequestClient {
  defaultClient = new RequestClient(config);
  return defaultClient;
}

/**
 * Get the default request client
 */
export function getRequestClient(): RequestClient {
  if (!defaultClient) {
    defaultClient = new RequestClient();
  }
  return defaultClient;
}

/**
 * Convenience functions using default client
 */
export async function get(url: string, params: any = {}, args?: PostArgs): Promise<any> {
  return getRequestClient().get(url, params, args);
}

export async function post(url: string, data: any, reqType?: RequestType, args?: PostArgs): Promise<any> {
  return getRequestClient().post(url, data, reqType, args);
}

