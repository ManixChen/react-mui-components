# React MUI Components - 管理端模板

这是一个完整的管理端模板项目，展示了如何使用 `react-mui-components` 系列组件库。

## 功能特性

- 📋 **表单组件示例** - 展示 react-mui-vgform 的各种用法
- 📊 **表格组件示例** - 展示 react-mui-auto-table 的功能
- 🌐 **请求工具示例** - 展示 react-auto-axios 的使用方法
- ⏳ **加载组件示例** - 展示 react-mui-loading 的用法
- 📝 **富文本编辑器示例** - 展示 react-mui-richtext 的功能
- 📖 **操作手册** - 完整的使用指南和 API 文档

## 快速开始

### 安装依赖

```bash
cd examples/admin-template
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:3000

### 构建生产版本

```bash
npm run build
```

## 项目结构

```
admin-template/
├── src/
│   ├── layouts/          # 布局组件
│   │   └── MainLayout.tsx
│   ├── pages/            # 页面组件
│   │   ├── Home.tsx
│   │   ├── Guide.tsx
│   │   └── examples/     # 示例页面
│   │       ├── FormExample.tsx
│   │       ├── TableExample.tsx
│   │       ├── RequestExample.tsx
│   │       ├── LoadingExample.tsx
│   │       └── RichTextExample.tsx
│   ├── assets/           # 静态资源
│   │   ├── theme.ts
│   │   └── styles/
│   ├── App.tsx           # 主应用组件
│   └── main.tsx          # 入口文件
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## 使用的组件库

- `react-auto-axios` - HTTP 请求工具
- `react-mui-vgform` - 表单组件
- `react-mui-auto-table` - 表格组件
- `react-mui-loading` - 加载组件
- `react-mui-richtext` - 富文本编辑器

## 更多信息

查看各个组件的详细文档：
- [react-auto-axios](../../packages/request/README.md)
- [react-mui-vgform](../../packages/form/README.md)
- [react-mui-auto-table](../../packages/table/README.md)
- [react-mui-loading](../../packages/loading/README.md)
- [react-mui-richtext](../../packages/richtext/README.md)

