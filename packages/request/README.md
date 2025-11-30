# react-auto-axios

独立的 HTTP 请求工具包，基于 axios 封装，支持拦截器、错误处理、通知等功能。

## 安装

```bash
npm install react-auto-axios
# 或
yarn add react-auto-axios
# 或
pnpm add react-auto-axios
```

## 特性

- 🔧 基于 axios 封装
- 🔌 支持请求/响应拦截器
- 📢 可配置的通知处理器
- 💾 可配置的存储处理器
- 🌐 支持多语言
- 📦 完全 TypeScript 支持
- 🎯 支持文件上传/下载
- ⚡ 轻量级，无额外依赖（除了 axios）

## 使用

### 基本使用

```typescript
import { RequestClient } from 'react-auto-axios';

// 创建请求客户端
const client = new RequestClient({
  baseURL: 'https://api.example.com',
  timeout: 30000,
});

// GET 请求
const users = await client.get('/api/users', { page: 1, limit: 10 });

// POST 请求
const result = await client.post('/api/users', {
  name: 'John',
  email: 'john@example.com',
});
```

### 配置处理器

```typescript
import { RequestClient } from 'react-auto-axios';

const client = new RequestClient({
  baseURL: 'https://api.example.com',
});

// 设置通知处理器
client.setNotificationHandler({
  showNotification: (type, message, code) => {
    // 你的通知逻辑，比如使用 toast、snackbar 等
    console.log(type, message, code);
  },
});

// 设置存储处理器（用于获取 token 等）
client.setStorageHandler({
  get: (key) => {
    return localStorage.getItem(key);
  },
  set: (key, value) => {
    localStorage.setItem(key, value);
  },
});

// 设置语言处理器
client.setLanguageHandler({
  getLang: () => {
    return localStorage.getItem('language') || 'en';
  },
});
```

### 使用默认实例

```typescript
import { initRequestClient, get, post } from 'react-auto-axios';

// 初始化默认实例
initRequestClient({
  baseURL: 'https://api.example.com',
});

// 直接使用便捷方法
const users = await get('/api/users');
const result = await post('/api/users', { name: 'John' });
```

### 文件上传

```typescript
const formData = new FormData();
formData.append('file', file);

const result = await client.post(
  '/api/upload',
  formData,
  { contentType: 1, responseType: 0 } // multipart/form-data
);
```

### 文件下载

```typescript
const result = await client.post(
  '/api/download',
  { fileId: '123' },
  { contentType: 0, responseType: 3 } // blob
);

// result 是完整的 response 对象
const blob = result.data;
const url = window.URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'file.pdf';
a.click();
```

## API

### RequestClient

#### 构造函数

```typescript
new RequestClient(config?: RequestConfig)
```

#### 方法

- `get(url: string, params?: any, args?: PostArgs): Promise<any>`
- `post(url: string, data: any, reqType?: RequestType, args?: PostArgs): Promise<any>`
- `setNotificationHandler(handler: NotificationHandler): void`
- `setStorageHandler(handler: StorageHandler): void`
- `setLanguageHandler(handler: LanguageHandler): void`
- `setErrorMessage(message: string): void`
- `getInstance(): AxiosInstance` - 获取底层 axios 实例

### 便捷函数

- `initRequestClient(config?: RequestConfig): RequestClient`
- `getRequestClient(): RequestClient`
- `get(url: string, params?: any, args?: PostArgs): Promise<any>`
- `post(url: string, data: any, reqType?: RequestType, args?: PostArgs): Promise<any>`

## 类型定义

```typescript
interface RequestConfig {
  baseURL?: string;
  timeout?: number;
  withCredentials?: boolean;
  headers?: Record<string, any>;
}

interface RequestType {
  contentType?: number; // 0: application/json, 1: multipart/form-data
  responseType?: number; // 0: json, 1: text, 2: arraybuffer, 3: blob
}

interface NotificationHandler {
  showNotification: (type: 'success' | 'error' | 'warning', message: string, code?: string | number) => void;
}

interface StorageHandler {
  get: (key: string) => any;
  set: (key: string, value: any) => void;
}

interface LanguageHandler {
  getLang: () => string;
}
```

## 许可证

MIT

