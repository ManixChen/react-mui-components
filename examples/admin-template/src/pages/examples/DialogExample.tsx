import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  TextField,
  Alert,
} from '@mui/material';
import {
  ConfirmDialog,
  ConfirmProvider,
  useConfirm,
  DynamicDialogProvider,
  useModal,
  SimpleDialog,
} from 'react-mui-dialog';

// 示例 1: 基本确认对话框
function BasicConfirmExample() {
  const [open, setOpen] = useState(false);

  return (
    <Box>
      <Button variant="contained" onClick={() => setOpen(true)} sx={{ mb: 2 }}>
        打开基本确认对话框
      </Button>
      <ConfirmDialog
        open={open}
        title="确认删除"
        message="此操作不可撤回，请谨慎操作！"
        messageCh="此操作不可撤回，请谨慎操作！"
        messageEn="This action cannot be undone!"
        confirmColor="error"
        onConfirm={() => {
          console.log('确认删除');
          setOpen(false);
        }}
        onCancel={() => {
          console.log('取消删除');
          setOpen(false);
        }}
      />
    </Box>
  );
}

// 示例 2: 使用 ConfirmProvider
function ConfirmProviderExample() {
  return (
    <ConfirmProvider>
      <ConfirmProviderContent />
    </ConfirmProvider>
  );
}

function ConfirmProviderContent() {
  const { openConfirm } = useConfirm();

  return (
    <Stack spacing={2}>
      <Button
        variant="contained"
        color="error"
        onClick={() => {
          openConfirm({
            title: '删除确认',
            message: '确定要删除这条记录吗？',
            messageCh: '确定要删除这条记录吗？',
            messageEn: 'Are you sure you want to delete this record?',
            confirmColor: 'error',
            onConfirm: () => {
              console.log('确认删除');
            },
            onCancel: () => {
              console.log('取消删除');
            },
          });
        }}
      >
        使用 ConfirmProvider 删除
      </Button>
      <Button
        variant="contained"
        color="warning"
        onClick={() => {
          openConfirm({
            title: '警告',
            message: '此操作可能会影响系统性能',
            confirmColor: 'warning',
            onConfirm: () => {
              console.log('确认操作');
            },
          });
        }}
      >
        显示警告对话框
      </Button>
    </Stack>
  );
}

// 示例 3: 使用 DynamicDialogProvider
function DynamicDialogExample() {
  return (
    <DynamicDialogProvider>
      <DynamicDialogContent />
    </DynamicDialogProvider>
  );
}

function DynamicDialogContent() {
  const { openModal } = useModal();

  return (
    <Stack spacing={2}>
      <Button
        variant="contained"
        onClick={() => {
          openModal({
            title: '编辑用户信息',
            content: (
              <Box sx={{ mt: 2 }}>
                <TextField label="姓名" fullWidth margin="normal" />
                <TextField label="邮箱" type="email" fullWidth margin="normal" />
                <TextField label="电话" fullWidth margin="normal" />
              </Box>
            ),
            confirmColor: 'primary',
            confirmText: '保存',
            cancelText: '取消',
            onConfirm: () => {
              console.log('保存数据');
            },
            onCancel: () => {
              console.log('取消编辑');
            },
          });
        }}
      >
        打开动态编辑对话框
      </Button>
      <Button
        variant="contained"
        color="info"
        onClick={() => {
          openModal({
            title: '查看详情',
            content: (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1" paragraph>
                  这是详细信息内容
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  您可以在这里显示任何内容
                </Typography>
              </Box>
            ),
            confirmText: '确定',
            onConfirm: () => {
              console.log('关闭详情');
            },
          });
        }}
      >
        打开详情对话框
      </Button>
    </Stack>
  );
}

// 示例 4: 使用 SimpleDialog
function SimpleDialogExample() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);
    setFormData(data);
    console.log('表单数据:', data);
    setOpen(false);
  };

  return (
    <Box>
      <Button variant="contained" onClick={() => setOpen(true)} sx={{ mb: 2 }}>
        打开表单对话框
      </Button>
      <SimpleDialog
        open={open}
        title="用户信息表单"
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
          defaultValue=""
        />
        <TextField
          name="email"
          label="邮箱"
          type="email"
          fullWidth
          margin="normal"
          required
          defaultValue=""
        />
        <TextField
          name="phone"
          label="电话"
          fullWidth
          margin="normal"
          defaultValue=""
        />
      </SimpleDialog>
      {formData && (
        <Alert severity="success" sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            提交成功！表单数据：
          </Typography>
          <Box component="pre" sx={{ mt: 1, fontSize: '0.875rem' }}>
            {JSON.stringify(formData, null, 2)}
          </Box>
        </Alert>
      )}
    </Box>
  );
}

export default function DialogExamplePage() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 2, fontWeight: 'bold' }}>
        对话框组件示例
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 4 }}>
        这个示例展示了如何使用 react-mui-dialog 创建各种类型的对话框。
      </Typography>

      <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          1. 基本确认对话框
        </Typography>
        <BasicConfirmExample />
      </Paper>

      <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          2. 使用 ConfirmProvider（推荐）
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 2 }}>
          使用 Context API 提供全局确认对话框，无需手动管理状态。
        </Typography>
        <ConfirmProviderExample />
      </Paper>

      <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          3. 使用 DynamicDialogProvider
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 2 }}>
          动态对话框，可以显示任意内容。
        </Typography>
        <DynamicDialogExample />
      </Paper>

      <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          4. 简单对话框（SimpleDialog）
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 2 }}>
          用于表单提交的简单对话框。
        </Typography>
        <SimpleDialogExample />
      </Paper>

      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom>
          代码示例
        </Typography>
        <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1, overflow: 'auto' }}>
          <Box component="pre" sx={{ fontSize: '0.875rem', m: 0 }}>
            {`import { ConfirmDialog, ConfirmProvider, useConfirm } from 'react-mui-dialog';

// 基本使用
const [open, setOpen] = useState(false);
<ConfirmDialog
  open={open}
  title="确认删除"
  message="此操作不可撤回！"
  onConfirm={() => setOpen(false)}
  onCancel={() => setOpen(false)}
/>

// 使用 ConfirmProvider
<ConfirmProvider>
  <MyComponent />
</ConfirmProvider>

function MyComponent() {
  const { openConfirm } = useConfirm();
  
  const handleDelete = () => {
    openConfirm({
      title: '确认删除',
      message: '确定要删除吗？',
      onConfirm: () => console.log('删除'),
    });
  };
  
  return <button onClick={handleDelete}>删除</button>;
}`}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

