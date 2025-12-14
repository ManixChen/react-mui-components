# react-mui-vdialog

独立的 React 对话框组件库，基于 Material-UI，支持确认对话框和动态对话框。

## 安装

```bash
npm install react-mui-vdialog
# 或
yarn add react-mui-vdialog
# 或
pnpm add react-mui-vdialog
```

## 特性

- 🎨 基于 Material-UI 5.x
- 🔧 完全 TypeScript 支持
- 📦 支持按需导入，Tree-shaking 友好
- ✅ 支持确认对话框（ConfirmDialog）
- 🔄 支持动态对话框（DynamicDialogProvider）
- 🎯 支持简单对话框（SimpleDialog）
- 🌐 支持中英文消息
- 🎨 高度可配置

## 使用

### 基本确认对话框

```typescript
import { ConfirmDialog } from 'react-mui-vdialog';
import { useState } from 'react';

function MyComponent() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>打开对话框</button>
      <ConfirmDialog
        open={open}
        title="确认删除"
        message="此操作不可撤回，请谨慎操作！"
        onConfirm={() => {
          console.log('确认');
          setOpen(false);
        }}
        onCancel={() => {
          console.log('取消');
          setOpen(false);
        }}
      />
    </>
  );
}
```

### 使用 ConfirmProvider（推荐）

```typescript
import { ConfirmProvider, useConfirm } from 'react-mui-vdialog';

function App() {
  return (
    <ConfirmProvider>
      <MyComponent />
    </ConfirmProvider>
  );
}

function MyComponent() {
  const { openConfirm } = useConfirm();

  const handleDelete = () => {
    openConfirm({
      title: '确认删除',
      message: '此操作不可撤回，请谨慎操作！',
      messageCh: '此操作不可撤回，请谨慎操作！',
      messageEn: 'This action cannot be undone!',
      confirmColor: 'error',
      onConfirm: () => {
        console.log('确认删除');
        // 执行删除操作
      },
      onCancel: () => {
        console.log('取消删除');
      },
    });
  };

  return <button onClick={handleDelete}>删除</button>;
}
```

### 使用 DynamicDialogProvider

```typescript
import { DynamicDialogProvider, useModal } from 'react-mui-vdialog';

function App() {
  return (
    <DynamicDialogProvider>
      <MyComponent />
    </DynamicDialogProvider>
  );
}

function MyComponent() {
  const { openModal } = useModal();

  const handleOpenDialog = () => {
    openModal({
      title: '动态对话框',
      content: <div>这是对话框内容</div>,
      confirmColor: 'primary',
      confirmText: '确定',
      cancelText: '取消',
      onConfirm: () => {
        console.log('确认');
      },
      onCancel: () => {
        console.log('取消');
      },
    });
  };

  return <button onClick={handleOpenDialog}>打开对话框</button>;
}
```

### 简单对话框（SimpleDialog）

```typescript
import { SimpleDialog } from 'react-mui-vdialog';
import { useState } from 'react';

function MyComponent() {
  const [open, setOpen] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('提交表单');
    setOpen(false);
  };

  return (
    <>
      <button onClick={() => setOpen(true)}>打开对话框</button>
      <SimpleDialog
        open={open}
        title="表单对话框"
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
        maxWidth="md"
      >
        <div>表单内容</div>
      </SimpleDialog>
    </>
  );
}
```

## API

### ConfirmDialog Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| open | boolean | 必填 | 是否打开对话框 |
| title | ReactNode \| string | - | 对话框标题 |
| message | ReactNode \| string | - | 消息内容 |
| messageCh | ReactNode \| string | - | 中文消息 |
| messageEn | ReactNode \| string | - | 英文消息 |
| content | ReactNode \| string | - | 自定义内容 |
| confirmColor | 'primary' \| 'secondary' \| 'error' \| 'info' \| 'success' \| 'warning' | 'error' | 确认按钮颜色 |
| confirmText | string | 'Confirm' | 确认按钮文字 |
| cancelText | string | 'Cancel' | 取消按钮文字 |
| maxWidth | 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| false | 'md' | 对话框最大宽度 |
| fullScreen | boolean | false | 是否全屏 |
| fullClose | boolean | false | 是否允许点击外部关闭 |
| actions | boolean | true | 是否显示操作按钮 |
| isModal | boolean | false | 是否显示关闭按钮 |
| onConfirm | () => void | - | 确认回调 |
| onCancel | () => void | - | 取消回调 |
| onClose | () => void | - | 关闭回调 |
| sx | any | - | 自定义样式 |

### ConfirmProvider

提供全局确认对话框上下文。

#### useConfirm Hook

返回 `{ openConfirm: (props: ConfirmDialogContextProps) => void }`

#### ConfirmDialogContextProps

| 属性 | 类型 | 说明 |
|------|------|------|
| title | ReactNode \| string | 对话框标题 |
| message | ReactNode \| string | 消息内容 |
| messageCh | ReactNode \| string | 中文消息 |
| messageEn | ReactNode \| string | 英文消息 |
| confirmColor | 'primary' \| 'secondary' \| 'error' \| 'info' \| 'success' \| 'warning' | 确认按钮颜色 |
| maxWidth | 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| false | 对话框最大宽度 |
| isModal | boolean | 是否显示关闭按钮 |
| onConfirm | () => void | 确认回调 |
| onCancel | () => void | 取消回调 |

### DynamicDialogProvider

提供动态对话框上下文。

#### useModal Hook

返回 `{ openModal: (props: DynamicDialogProps) => void, closeModal: () => void }`

#### DynamicDialogProps

| 属性 | 类型 | 说明 |
|------|------|------|
| title | ReactNode \| string | 对话框标题 |
| content | ReactNode \| string | 对话框内容 |
| message | ReactNode \| string | 消息内容 |
| messageCh | ReactNode \| string | 中文消息 |
| messageEn | ReactNode \| string | 英文消息 |
| maxWidth | 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| false | 对话框最大宽度 |
| confirmColor | 'primary' \| 'secondary' \| 'error' \| 'info' \| 'success' \| 'warning' | 确认按钮颜色 |
| confirmText | string | 确认按钮文字 |
| cancelText | string | 取消按钮文字 |
| isModal | boolean | 是否显示关闭按钮 |
| onConfirm | () => void | 确认回调 |
| onCancel | () => void | 取消回调 |

### SimpleDialog Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| open | boolean | false | 是否打开对话框 |
| title | string | - | 对话框标题 |
| maxWidth | 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' | 'lg' | 对话框最大宽度 |
| hiddenActions | boolean | false | 是否隐藏操作按钮 |
| onClose | () => void | - | 关闭回调 |
| onSubmit | (event: React.FormEvent<HTMLFormElement>) => void | - | 提交回调 |
| onCancel | () => void | - | 取消回调 |
| children | ReactNode | - | 对话框内容 |

## 完整示例

```typescript
import React, { useState } from 'react';
import {
  ConfirmDialog,
  ConfirmProvider,
  useConfirm,
  DynamicDialogProvider,
  useModal,
  SimpleDialog,
} from 'react-mui-vdialog';
import { Button, Box, TextField } from '@mui/material';

// 示例 1: 基本使用
function BasicExample() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>打开对话框</Button>
      <ConfirmDialog
        open={open}
        title="确认操作"
        message="确定要执行此操作吗？"
        onConfirm={() => {
          console.log('确认');
          setOpen(false);
        }}
        onCancel={() => {
          console.log('取消');
          setOpen(false);
        }}
      />
    </>
  );
}

// 示例 2: 使用 ConfirmProvider
function ConfirmProviderExample() {
  return (
    <ConfirmProvider>
      <MyComponent />
    </ConfirmProvider>
  );
}

function MyComponent() {
  const { openConfirm } = useConfirm();

  return (
    <Button
      onClick={() => {
        openConfirm({
          title: '删除确认',
          message: '此操作不可撤回！',
          confirmColor: 'error',
          onConfirm: () => {
            console.log('删除');
          },
        });
      }}
    >
      删除
    </Button>
  );
}

// 示例 3: 使用 DynamicDialogProvider
function DynamicDialogExample() {
  return (
    <DynamicDialogProvider>
      <MyComponent2 />
    </DynamicDialogProvider>
  );
}

function MyComponent2() {
  const { openModal } = useModal();

  return (
    <Button
      onClick={() => {
        openModal({
          title: '编辑',
          content: (
            <Box>
              <TextField label="名称" fullWidth margin="normal" />
              <TextField label="描述" fullWidth margin="normal" />
            </Box>
          ),
          onConfirm: () => {
            console.log('保存');
          },
        });
      }}
    >
      编辑
    </Button>
  );
}

// 示例 4: 使用 SimpleDialog
function SimpleDialogExample() {
  const [open, setOpen] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    console.log('表单数据:', Object.fromEntries(formData));
    setOpen(false);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>打开表单对话框</Button>
      <SimpleDialog
        open={open}
        title="用户信息"
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
        maxWidth="sm"
      >
        <TextField
          name="name"
          label="姓名"
          fullWidth
          margin="normal"
          required
        />
        <TextField
          name="email"
          label="邮箱"
          type="email"
          fullWidth
          margin="normal"
          required
        />
      </SimpleDialog>
    </>
  );
}
```

## 依赖项

### Peer Dependencies

- `react` >= 18.0.0
- `react-dom` >= 18.0.0
- `@mui/material` >= 5.0.0
- `@mui/icons-material` >= 5.0.0
- `@mui/lab` >= 5.0.0-alpha.0

## 许可证

MIT

