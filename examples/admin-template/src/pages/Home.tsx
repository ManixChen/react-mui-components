import { Box, Typography, Card, CardContent, Grid, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CodeIcon from '@mui/icons-material/Code';
import BookIcon from '@mui/icons-material/Book';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

export default function HomePage() {
  const navigate = useNavigate();

  const quickStartCards = [
    {
      title: '操作手册',
      description: '查看完整的使用指南和 API 文档',
      icon: <BookIcon sx={{ fontSize: 40 }} />,
      action: () => navigate('/guide'),
      color: '#1976d2',
    },
    {
      title: '快速开始',
      description: '了解如何安装和使用这些组件',
      icon: <RocketLaunchIcon sx={{ fontSize: 40 }} />,
      action: () => navigate('/guide'),
      color: '#2e7d32',
    },
    {
      title: '查看示例',
      description: '浏览所有组件的实际使用示例',
      icon: <CodeIcon sx={{ fontSize: 40 }} />,
      action: () => navigate('/examples/form'),
      color: '#ed6c02',
    },
  ];

  const componentCards = [
    {
      name: 'react-auto-axios',
      description: 'HTTP 请求工具，基于 axios 封装',
      path: '/examples/request',
    },
    {
      name: 'react-mui-vgform',
      description: '表单组件库，基于 Material-UI 和 Formik',
      path: '/examples/form',
    },
    {
      name: 'react-mui-auto-table',
      description: '表格组件库，基于 material-react-table',
      path: '/examples/table',
    },
    {
      name: 'react-mui-loading',
      description: '加载组件，支持多种加载样式',
      path: '/examples/loading',
    },
    {
      name: 'react-mui-richtext',
      description: '富文本编辑器，基于 React Quill',
      path: '/examples/richtext',
    },
    {
      name: 'react-mui-dialog',
      description: '对话框组件，支持确认对话框和动态对话框',
      path: '/examples/dialog',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        欢迎使用 React MUI Components
      </Typography>

      <Typography variant="body1" paragraph sx={{ mb: 4, color: 'text.secondary' }}>
        这是一个完整的 React Material-UI 组件库集合，包含表单、表格、请求工具、加载组件和富文本编辑器等。
        所有组件都经过精心设计，支持 TypeScript，并且可以按需安装使用。
      </Typography>

      <Typography variant="h5" gutterBottom sx={{ mb: 3, mt: 4 }}>
        快速开始
      </Typography>
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {quickStartCards.map((card, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card
              sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
              onClick={card.action}
            >
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Box sx={{ color: card.color, mb: 2 }}>{card.icon}</Box>
                <Typography variant="h6" gutterBottom>
                  {card.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {card.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        可用组件
      </Typography>
      <Grid container spacing={3}>
        {componentCards.map((component) => (
          <Grid item xs={12} md={6} key={component.name}>
            <Card
              sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
              onClick={() => navigate(component.path)}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  {component.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {component.description}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(component.path);
                  }}
                >
                  查看示例
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

