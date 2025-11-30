# react-mui-auto-table

独立的 React 表格组件库，基于 Material-UI 和 material-react-table。

## 安装

```bash
npm install react-mui-auto-table
# 或
yarn add react-mui-auto-table
# 或
pnpm add react-mui-auto-table
```

## 特性

- 🎨 基于 Material-UI 5.x 和 material-react-table
- 📊 支持前端和后端分页
- 🔍 支持搜索和过滤
- 📱 响应式设计，支持移动端
- 🔧 完全 TypeScript 支持
- 🎯 高度可配置
- 📦 支持按需导入，Tree-shaking 友好
- ✅ 支持行选择（复选框）
- 🔄 支持刷新和重新加载
- 📄 支持详情面板和树形结构

## 使用

### 基本示例（后端分页）

```typescript
import { MaterialTable } from 'react-mui-auto-table';

const columns = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
];

function MyTable() {
  const apiInstance = async (params: any) => {
    const response = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(params),
    });
    return response.json();
  };

  return (
    <MaterialTable
      columns={columns}
      apiInstance={apiInstance}
      searchParam={{}}
    />
  );
}
```

### 前端分页

```typescript
import { MaterialTable } from 'react-mui-auto-table';
import { useState, useEffect } from 'react';

function MyTable() {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    fetchData().then((res) => {
      if (res.code === 0) {
        setTableData(res.resultData || []);
      }
    });
  }, []);

  const refreshData = () => {
    fetchData().then((res) => {
      if (res.code === 0) {
        setTableData(res.resultData || []);
      }
    });
  };

  return (
    <MaterialTable
      columns={columns}
      searchParam={{}}
      frontPager={true}
      refreshCall={refreshData}
    />
  );
}
```

### 配置选项

```typescript
import { MaterialTable } from 'react-mui-auto-table';

<MaterialTable
  columns={columns}
  apiInstance={apiInstance}
  searchParam={{}}
  config={{
    t: (key) => translations[key] || key, // 翻译函数
    LoadingComponent: CustomLoading, // 自定义加载组件
    getUserInfo: () => ({ userId: 123 }), // 用户信息获取（用于API调用）
    isMobile: () => window.innerWidth < 960, // 移动端检测
    filterStringFromObj: customFilterFn, // 自定义过滤函数
    formatStrToTime: customFormatFn, // 自定义时间格式化函数
    muiTableBodySx: customStyles, // 自定义表格样式
  }}
  // 其他配置...
/>
```

### 使用 ref 控制表格

```typescript
import { MaterialTable, MaterialTableRef } from 'react-mui-auto-table';
import { useRef } from 'react';

function MyTable() {
  const tableRef = useRef<MaterialTableRef>(null);

  const handleRefresh = () => {
    tableRef.current?.refreshTable();
  };

  const handleUpdateRow = () => {
    tableRef.current?.setTableItemData('id', updatedData, row);
  };

  return (
    <>
      <button onClick={handleRefresh}>Refresh</button>
      <MaterialTable
        ref={tableRef}
        columns={columns}
        apiInstance={apiInstance}
        searchParam={{}}
      />
    </>
  );
}
```

### 启用行选择

```typescript
<MaterialTable
  columns={columns}
  apiInstance={apiInstance}
  searchParam={{}}
  enableSelect={true}
  onCurrentDataChange={(data) => {
    // 获取选中的数据
    const selected = data.filter((item) => item.itemCheckedStatus === 'Y');
    console.log('Selected:', selected);
  }}
/>
```

### 后端搜索

```typescript
<MaterialTable
  columns={columns}
  apiInstance={apiInstance}
  searchParam={{}}
  searchFromEnd={true} // 启用后端搜索
  isSearch={true}
/>
```

### 详情面板

```typescript
<MaterialTable
  columns={columns}
  apiInstance={apiInstance}
  searchParam={{}}
  renderDetailPanel={({ row }) => (
    <Box sx={{ padding: '16px' }}>
      <Typography>Details for {row.original.name}</Typography>
      {/* 更多详情内容 */}
    </Box>
  )}
/>
```

### 树形结构

```typescript
<MaterialTable
  columns={columns}
  apiInstance={apiInstance}
  searchParam={{}}
  getSubRows={(row) => row.children || []} // 返回子行数据
/>
```

## API

### MaterialTable Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| columns | TableColumn[] | 必填 | 表格列配置 |
| apiInstance | Function | - | API 请求函数，返回 Promise |
| searchParam | any | {} | 搜索参数对象 |
| frontPager | boolean | false | 是否前端分页 |
| enablePager | boolean | true | 是否启用分页 |
| showPager | boolean | true | 是否显示分页器 |
| enableSorting | boolean | true | 是否启用排序 |
| enableGrouping | boolean | false | 是否启用分组 |
| enableSelect | boolean | false | 是否启用行选择（复选框） |
| maxHeight | string\|number | null | 表格最大高度 |
| minHeight | string\|number | null | 表格最小高度 |
| searchFromEnd | boolean | false | 是否后端搜索 |
| isSearch | boolean | true | 是否显示搜索框 |
| showAll | boolean | false | 是否显示所有数据（不分页） |
| loading | boolean | false | 外部控制加载状态 |
| title | ReactNode | null | 表格标题 |
| newFormFn | Function | - | 新建按钮点击回调 |
| newFormFnText | string | 'New' | 新建按钮文字 |
| leftForm | ReactNode | null | 左侧自定义内容 |
| onDataChange | Function | - | 数据变化回调 |
| onCurrentDataChange | Function | - | 当前数据变化回调 |
| onPageCall | Function | - | 分页变化回调 |
| refreshCall | Function | - | 刷新回调（前端分页时使用） |
| renderDetailPanel | Function | - | 详情面板渲染函数 |
| getSubRows | Function | - | 获取子行数据函数 |
| config | TableConfig | {} | 配置对象 |

### MaterialTableRef

通过 ref 可以调用以下方法：

- `refreshTable()` - 刷新表格
- `setTableRadioCheckedStatus(row, key, values)` - 设置单选状态
- `setTableCheckBoxCheckedStatus(row, key, values)` - 设置复选框状态
- `setTableItemData(key, values, row)` - 更新行数据

### TableConfig

```typescript
interface TableConfig {
  // 翻译函数
  t?: (key: string) => string;
  // 自定义加载组件
  LoadingComponent?: React.ComponentType<{ loading: boolean }>;
  // 用户信息获取（用于API调用）
  getUserInfo?: () => any;
  // 自定义过滤函数
  filterStringFromObj?: (data: any[], filterFn: Function) => any[];
  // 自定义时间格式化函数
  formatStrToTime?: (str: string, defaultHours?: number) => number;
  // 自定义样式
  muiTableBodySx?: any;
  muiTableHead?: any;
  pagerContentSx?: any;
  // 自定义复选框组件
  CheckBoxComponent?: React.ComponentType<any>;
  // 移动端检测函数
  isMobile?: () => boolean;
}
```

### API 响应格式

API 函数应该返回以下格式的数据：

```typescript
{
  code: number; // 0 表示成功
  resultData: {
    list: any[]; // 数据列表
    total: number; // 总记录数
    pageCount?: number; // 总页数（可选）
  };
  remarks?: string; // 提示信息（可选）
  msg?: string; // 消息（可选）
}
```

## 完整示例

```typescript
import React, { useRef } from 'react';
import { MaterialTable, MaterialTableRef } from 'react-mui-auto-table';
import { RequestClient } from 'react-auto-axios'; // 可选：使用请求工具

const columns = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
];

function UserTable() {
  const tableRef = useRef<MaterialTableRef>(null);
  const [searchParam, setSearchParam] = useState({});

  // 使用 react-auto-axios（可选）
  const requestClient = new RequestClient({
    baseURL: 'https://api.example.com',
  });

  const apiInstance = async (params: any) => {
    return requestClient.post('/api/users/list', params);
  };

  return (
    <MaterialTable
      ref={tableRef}
      columns={columns}
      apiInstance={apiInstance}
      searchParam={searchParam}
      enableSelect={true}
      enablePager={true}
      frontPager={false}
      title={<h2>User List</h2>}
      newFormFn={() => {
        console.log('Create new user');
      }}
      onDataChange={(data) => {
        console.log('Data changed:', data);
      }}
      onCurrentDataChange={(data) => {
        const selected = data.filter((item) => item.itemCheckedStatus === 'Y');
        console.log('Selected items:', selected);
      }}
      config={{
        t: (key) => key, // 翻译函数
        getUserInfo: () => ({ userId: 123 }),
        isMobile: () => window.innerWidth < 960,
      }}
    />
  );
}
```

## 依赖项

### Peer Dependencies

- `react` >= 18.0.0
- `react-dom` >= 18.0.0
- `@mui/material` >= 5.0.0
- `@mui/icons-material` >= 5.0.0
- `material-react-table` >= 2.0.0
- `dayjs` >= 1.0.0
- `lodash` >= 4.0.0

## 许可证

MIT

