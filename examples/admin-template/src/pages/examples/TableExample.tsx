import { useState, useRef } from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { MaterialTable, MaterialTableRef } from 'react-mui-auto-table';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

export default function TableExamplePage() {
  const tableRef = useRef<MaterialTableRef>(null);
  const [searchParam, setSearchParam] = useState({});

  // 模拟 API 调用
  const apiInstance = async (params: any) => {
    // 模拟延迟
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 模拟数据
    const mockData: User[] = [
      { id: 1, name: '张三', email: 'zhangsan@example.com', role: '管理员', status: '活跃' },
      { id: 2, name: '李四', email: 'lisi@example.com', role: '用户', status: '活跃' },
      { id: 3, name: '王五', email: 'wangwu@example.com', role: '用户', status: '禁用' },
      { id: 4, name: '赵六', email: 'zhaoliu@example.com', role: '编辑', status: '活跃' },
      { id: 5, name: '钱七', email: 'qianqi@example.com', role: '用户', status: '活跃' },
    ];

    // 模拟分页
    const page = params?.pagination?.pageIndex || 0;
    const pageSize = params?.pagination?.pageSize || 10;
    const start = page * pageSize;
    const end = start + pageSize;
    const paginatedData = mockData.slice(start, end);

    return {
      code: 0,
      resultData: {
        list: paginatedData,
        total: mockData.length,
      },
    };
  };

  const columns = [
    {
      accessorKey: 'id',
      header: 'ID',
      size: 80,
    },
    {
      accessorKey: 'name',
      header: '姓名',
    },
    {
      accessorKey: 'email',
      header: '邮箱',
    },
    {
      accessorKey: 'role',
      header: '角色',
    },
    {
      accessorKey: 'status',
      header: '状态',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 2, fontWeight: 'bold' }}>
        表格组件示例
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 4 }}>
        这个示例展示了如何使用 react-mui-auto-table 创建功能丰富的数据表格。
      </Typography>

      <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            onClick={() => tableRef.current?.refreshTable()}
          >
            刷新表格
          </Button>
        </Box>
      </Paper>

      <Paper elevation={2} sx={{ p: 2 }}>
        <MaterialTable
          ref={tableRef}
          columns={columns}
          apiInstance={apiInstance}
          searchParam={searchParam}
          enableSelect={true}
          enablePager={true}
          frontPager={false}
          title={<Typography variant="h6">用户列表</Typography>}
          onCurrentDataChange={(data) => {
            console.log('Selected items:', data);
          }}
        />
      </Paper>

      <Paper elevation={2} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          代码示例
        </Typography>
        <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1, overflow: 'auto' }}>
          <Box component="pre" sx={{ fontSize: '0.875rem', m: 0 }}>
            {`import { MaterialTable } from 'react-mui-auto-table';

const columns = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
];

const apiInstance = async (params) => {
  // 返回 { code: 0, resultData: { list: [], total: 0 } }
};

<MaterialTable
  columns={columns}
  apiInstance={apiInstance}
  searchParam={{}}
  enableSelect={true}
/>`}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

