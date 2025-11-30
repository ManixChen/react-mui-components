# react-mui-vgform

独立的 React 表单组件库，基于 Material-UI 和 Formik。

## 安装

```bash
npm install react-mui-vgform
# 或
yarn add react-mui-vgform
# 或
pnpm add react-mui-vgform
```

## 特性

- 🎨 基于 Material-UI 5.x
- 📝 与 Formik 完美集成
- 🔧 完全 TypeScript 支持
- 🎯 支持多种输入类型
- 📦 支持按需导入，Tree-shaking 友好

## 支持的输入类型

- `text` - 文本输入
- `password` - 密码输入
- `select` - 下拉选择（支持多选）
- `checkbox` - 复选框
- `radio` - 单选按钮
- `date` - 日期选择
- `datetime` - 日期时间选择
- `richtext` - 富文本编辑器（需提供自定义组件）
- `string` - 只读文本
- `filter` - 搜索过滤输入

## 使用

### 基本示例

```typescript
import { FormItemList } from 'react-mui-vgform';
import { useFormik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
});

function MyForm() {
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
    },
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  const formItems = [
    {
      name: 'name',
      type: 'text',
      label: 'Name',
      required: true,
    },
    {
      name: 'email',
      type: 'text',
      label: 'Email',
      required: true,
      ruller: 'Email',
    },
  ];

  return (
    <form onSubmit={formik.handleSubmit}>
      <FormItemList formItems={formItems} formik={formik} />
      <button type="submit">Submit</button>
    </form>
  );
}
```

## 组件

### FormItemList

表单列表组件，自动渲染多个表单字段。

### FormItemByType

根据类型渲染不同的表单字段组件。

### DateInput

日期选择组件。

### AutoFetchSelectDropDown

自动获取选项的下拉选择组件。

## 许可证

MIT

