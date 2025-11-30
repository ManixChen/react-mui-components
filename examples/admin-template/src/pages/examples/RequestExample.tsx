import { useState } from 'react';
import { Box, Typography, Paper, Button, TextField, Alert } from '@mui/material';
import { RequestClient, initRequestClient, get, post } from 'react-auto-axios';

export default function RequestExamplePage() {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/posts/1');

  // 创建请求客户端实例
  const client = new RequestClient({
    baseURL: 'https://jsonplaceholder.typicode.com',
    timeout: 10000,
  });

  // 配置通知处理器
  client.setNotificationHandler({
    showNotification: (type, message, code) => {
      console.log(`[${type}] ${message}`, code);
      if (type === 'error') {
        setError(message);
      }
    },
  });

  // 初始化默认客户端
  initRequestClient({
    baseURL: 'https://jsonplaceholder.typicode.com',
  });

  const handleGet = async () => {
    try {
      setError(null);
      setResult(null);
      const response = await client.get('/posts/1');
      setResult(response);
    } catch (err: any) {
      setError(err.message || '请求失败');
    }
  };

  const handlePost = async () => {
    try {
      setError(null);
      setResult(null);
      const response = await client.post('/posts', {
        title: 'Test Post',
        body: 'This is a test post',
        userId: 1,
      });
      setResult(response);
    } catch (err: any) {
      setError(err.message || '请求失败');
    }
  };

  const handleGetWithDefault = async () => {
    try {
      setError(null);
      setResult(null);
      const response = await get('/posts/1');
      setResult(response);
    } catch (err: any) {
      setError(err.message || '请求失败');
    }
  };

  const handlePostWithDefault = async () => {
    try {
      setError(null);
      setResult(null);
      const response = await post('/posts', {
        title: 'Test Post',
        body: 'This is a test post',
        userId: 1,
      });
      setResult(response);
    } catch (err: any) {
      setError(err.message || '请求失败');
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 2, fontWeight: 'bold' }}>
        请求工具示例
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 4 }}>
        这个示例展示了如何使用 react-auto-axios 进行 HTTP 请求。
      </Typography>

      <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          使用 RequestClient 实例
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <Button variant="contained" onClick={handleGet}>
            GET 请求
          </Button>
          <Button variant="contained" onClick={handlePost}>
            POST 请求
          </Button>
        </Box>

        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
          使用默认客户端（便捷方法）
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <Button variant="outlined" onClick={handleGetWithDefault}>
            GET (便捷方法)
          </Button>
          <Button variant="outlined" onClick={handlePostWithDefault}>
            POST (便捷方法)
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {result && (
          <Alert severity="success" sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              请求成功！响应数据：
            </Typography>
            <Box component="pre" sx={{ mt: 1, fontSize: '0.875rem', overflow: 'auto' }}>
              {JSON.stringify(result, null, 2)}
            </Box>
          </Alert>
        )}
      </Paper>

      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom>
          代码示例
        </Typography>
        <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1, overflow: 'auto' }}>
          <Box component="pre" sx={{ fontSize: '0.875rem', m: 0 }}>
            {`import { RequestClient, initRequestClient, get, post } from 'react-auto-axios';

// 方式1: 创建实例
const client = new RequestClient({
  baseURL: 'https://api.example.com',
});

const data = await client.get('/users');
const result = await client.post('/users', { name: 'John' });

// 方式2: 使用默认客户端
initRequestClient({ baseURL: 'https://api.example.com' });
const data = await get('/users');
const result = await post('/users', { name: 'John' });`}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

