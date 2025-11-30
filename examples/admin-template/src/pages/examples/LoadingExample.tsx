import { useState } from 'react';
import { Box, Typography, Paper, Button, Stack, Switch, FormControlLabel } from '@mui/material';
import { GlobalLoading } from 'react-mui-loading';

export default function LoadingExamplePage() {
  const [loading, setLoading] = useState(false);
  const [loadingType, setLoadingType] = useState<'circular' | 'linear'>('circular');

  const handleStartLoading = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 2, fontWeight: 'bold' }}>
        加载组件示例
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 4 }}>
        这个示例展示了如何使用 react-mui-loading 显示加载状态。
      </Typography>

      <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
        <Stack spacing={3}>
          <FormControlLabel
            control={
              <Switch
                checked={loadingType === 'linear'}
                onChange={(e) => setLoadingType(e.target.checked ? 'linear' : 'circular')}
              />
            }
            label="使用线性进度条"
          />

          <Button
            variant="contained"
            onClick={handleStartLoading}
            disabled={loading}
          >
            {loading ? '加载中...' : '开始加载（3秒）'}
          </Button>

          <GlobalLoading pageLoading={loading} type={loadingType} />
        </Stack>
      </Paper>

      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom>
          代码示例
        </Typography>
        <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1, overflow: 'auto' }}>
          <Box component="pre" sx={{ fontSize: '0.875rem', m: 0 }}>
            {`import { GlobalLoading } from 'react-mui-loading';

const [loading, setLoading] = useState(false);

// 圆形进度条
<GlobalLoading pageLoading={loading} type="circular" />

// 线性进度条
<GlobalLoading pageLoading={loading} type="linear" />`}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

