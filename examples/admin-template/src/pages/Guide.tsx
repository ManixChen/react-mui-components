import { Box, Typography, Paper, Divider, List, ListItem, ListItemText, Link } from '@mui/material';

export default function GuidePage() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        操作手册
      </Typography>

      <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          安装
        </Typography>
        <Typography variant="body1" paragraph>
          所有组件都可以独立安装使用：
        </Typography>
        <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1, mb: 2 }}>
          <Typography component="pre" sx={{ display: 'block', whiteSpace: 'pre-wrap', fontFamily: 'monospace', m: 0 }}>
            {`# 安装请求工具
npm install react-auto-axios

# 安装表单组件
npm install react-mui-vgform

# 安装表格组件
npm install react-mui-auto-table

# 安装加载组件
npm install react-mui-loading

# 安装富文本编辑器
npm install react-mui-richtext`}
          </Typography>
        </Box>
      </Paper>

      <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          react-auto-axios
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          HTTP 请求工具，基于 axios 封装，支持拦截器、错误处理、通知等功能。
        </Typography>
        <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1, mb: 2 }}>
          <Typography component="pre" sx={{ display: 'block', whiteSpace: 'pre-wrap', fontFamily: 'monospace', m: 0 }}>
            {`import { RequestClient } from 'react-auto-axios';

const client = new RequestClient({
  baseURL: 'https://api.example.com',
});

// GET 请求
const users = await client.get('/api/users', { page: 1 });

// POST 请求
const result = await client.post('/api/users', { name: 'John' });`}
          </Typography>
        </Box>
        <Link href="/examples/request" underline="hover">
          查看完整示例 →
        </Link>
      </Paper>

      <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          react-mui-vgform
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          表单组件库，基于 Material-UI 和 Formik，支持多种输入类型。
        </Typography>
        <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1, mb: 2 }}>
          <Typography component="pre" sx={{ display: 'block', whiteSpace: 'pre-wrap', fontFamily: 'monospace', m: 0 }}>
            {`import { FormItemList } from 'react-mui-vgform';
import { useFormik } from 'formik';

const formik = useFormik({
  initialValues: { name: '', email: '' },
  onSubmit: (values) => console.log(values),
});

const formItems = [
  { name: 'name', type: 'text', label: 'Name', required: true },
  { name: 'email', type: 'text', label: 'Email', required: true },
];

<FormItemList formItems={formItems} formik={formik} />`}
          </Typography>
        </Box>
        <Link href="/examples/form" underline="hover">
          查看完整示例 →
        </Link>
      </Paper>

      <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          react-mui-auto-table
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          表格组件库，基于 material-react-table，支持前端和后端分页、搜索、过滤等功能。
        </Typography>
        <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1, mb: 2 }}>
          <Typography component="pre" sx={{ display: 'block', whiteSpace: 'pre-wrap', fontFamily: 'monospace', m: 0 }}>
            {`import { MaterialTable } from 'react-mui-auto-table';

const columns = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
];

<MaterialTable
  columns={columns}
  apiInstance={apiInstance}
  searchParam={{}}
/>`}
          </Typography>
        </Box>
        <Link href="/examples/table" underline="hover">
          查看完整示例 →
        </Link>
      </Paper>

      <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          react-mui-loading
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          加载组件，支持圆形和线性进度指示器，以及全屏加载遮罩。
        </Typography>
        <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1, mb: 2 }}>
          <Typography component="pre" sx={{ display: 'block', whiteSpace: 'pre-wrap', fontFamily: 'monospace', m: 0 }}>
            {`import { GlobalLoading } from 'react-mui-loading';

<GlobalLoading loading={isLoading} />`}
          </Typography>
        </Box>
        <Link href="/examples/loading" underline="hover">
          查看完整示例 →
        </Link>
      </Paper>

      <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          react-mui-richtext
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          富文本编辑器，基于 React Quill，支持图片上传、裁剪、表情等功能。
        </Typography>
        <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1, mb: 2 }}>
          <Typography component="pre" sx={{ display: 'block', whiteSpace: 'pre-wrap', fontFamily: 'monospace', m: 0 }}>
            {`import { RichTextEditor } from 'react-mui-richtext';

<RichTextEditor
  value={content}
  onChange={setContent}
  allowImageUpload={true}
  enableImageCrop={true}
/>`}
          </Typography>
        </Box>
        <Link href="/examples/richtext" underline="hover">
          查看完整示例 →
        </Link>
      </Paper>

      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          更多资源
        </Typography>
        <List>
          <ListItem>
            <ListItemText
              primary="GitHub 仓库"
              secondary="查看源代码和提交问题"
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="npm 包"
              secondary="在 npm 上查看包详情和版本历史"
            />
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
}

