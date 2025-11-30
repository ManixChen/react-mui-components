// Request types - exported for external use
export interface RequestConfig {
  baseURL?: string;
  timeout?: number;
  withCredentials?: boolean;
  headers?: Record<string, any>;
}

export interface PostArgs {
  startLoading?: () => void;
  stopLoading?: () => void;
}

export interface RequestType {
  contentType?: number; // 0: application/json, 1: multipart/form-data, 2: other
  responseType?: number; // 0: json, 1: text, 2: arraybuffer, 3: blob
}

export interface NotificationHandler {
  showNotification: (type: 'success' | 'error' | 'warning', message: string, code?: string | number) => void;
}

export interface StorageHandler {
  get: (key: string) => any;
  set: (key: string, value: any) => void;
}

export interface LanguageHandler {
  getLang: () => string;
}

