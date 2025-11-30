import { useState } from 'react';
import { Box, Typography, Paper, Button, Alert } from '@mui/material';
import { FormItemList } from 'react-mui-vgform';
import { useFormik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object({
  name: yup.string().required('姓名是必填项'),
  email: yup.string().email('请输入有效的邮箱地址').required('邮箱是必填项'),
  age: yup.number().min(18, '年龄必须大于18岁').required('年龄是必填项'),
  gender: yup.string().required('请选择性别'),
  city: yup.string().required('请选择城市'),
  hobbies: yup.array().min(1, '请至少选择一个爱好'),
  bio: yup.string().max(500, '简介不能超过500字'),
});

export default function FormExamplePage() {
  const [submitResult, setSubmitResult] = useState<any>(null);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      age: '',
      gender: '',
      city: '',
      hobbies: [],
      bio: '',
    },
    validationSchema,
    onSubmit: (values) => {
      setSubmitResult(values);
      console.log('Form values:', values);
    },
  });

  const formItems = [
    {
      name: 'name',
      type: 'text',
      label: '姓名',
      required: true,
      placeholder: '请输入姓名',
    },
    {
      name: 'email',
      type: 'text',
      label: '邮箱',
      required: true,
      placeholder: '请输入邮箱地址',
      ruller: 'Email',
    },
    {
      name: 'age',
      type: 'text',
      label: '年龄',
      required: true,
      placeholder: '请输入年龄',
      ruller: 'Integer',
    },
    {
      name: 'gender',
      type: 'radio',
      label: '性别',
      required: true,
      codeList: [
        { label: '男', value: 'male' },
        { label: '女', value: 'female' },
      ],
    },
    {
      name: 'city',
      type: 'select',
      label: '城市',
      required: true,
      optionList: [
        { label: '北京', value: 'beijing' },
        { label: '上海', value: 'shanghai' },
        { label: '广州', value: 'guangzhou' },
        { label: '深圳', value: 'shenzhen' },
      ],
    },
    {
      name: 'hobbies',
      type: 'checkbox',
      label: '爱好',
      required: true,
      codeList: [
        { label: '阅读', value: 'reading' },
        { label: '运动', value: 'sports' },
        { label: '音乐', value: 'music' },
        { label: '旅行', value: 'travel' },
      ],
    },
    {
      name: 'bio',
      type: 'text',
      label: '个人简介',
      rows: 4,
      placeholder: '请输入个人简介（最多500字）',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 2, fontWeight: 'bold' }}>
        表单组件示例
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 4 }}>
        这个示例展示了如何使用 react-mui-vgform 创建各种类型的表单字段。
      </Typography>

      <Paper elevation={2} sx={{ p: 4 }}>
        <form onSubmit={formik.handleSubmit}>
          <FormItemList formItems={formItems} formik={formik} />
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button type="submit" variant="contained" color="primary">
              提交
            </Button>
            <Button type="button" variant="outlined" onClick={formik.handleReset}>
              重置
            </Button>
          </Box>
        </form>

        {submitResult && (
          <Alert severity="success" sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              提交成功！表单数据：
            </Typography>
            <Box component="pre" sx={{ mt: 1, fontSize: '0.875rem' }}>
              {JSON.stringify(submitResult, null, 2)}
            </Box>
          </Alert>
        )}
      </Paper>

      <Paper elevation={2} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          代码示例
        </Typography>
        <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1, overflow: 'auto' }}>
          <Box component="pre" sx={{ fontSize: '0.875rem', m: 0 }}>
            {`import { FormItemList } from 'react-mui-vgform';
import { useFormik } from 'formik';
import * as yup from 'yup';

const formik = useFormik({
  initialValues: { name: '', email: '' },
  validationSchema: yup.object({
    name: yup.string().required('姓名是必填项'),
    email: yup.string().email().required('邮箱是必填项'),
  }),
  onSubmit: (values) => console.log(values),
});

const formItems = [
  { name: 'name', type: 'text', label: '姓名', required: true },
  { name: 'email', type: 'text', label: '邮箱', required: true },
];

<FormItemList formItems={formItems} formik={formik} />`}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

