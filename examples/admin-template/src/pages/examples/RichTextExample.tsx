import { useState } from 'react';
import { Box, Typography, Paper, Button, Alert } from '@mui/material';
import { RichTextEditor } from 'react-mui-richtext';
import 'react-quill/dist/quill.snow.css';
import 'quill-emoji/dist/quill-emoji.css';

export default function RichTextExamplePage() {
  const [content, setContent] = useState('');
  const [savedContent, setSavedContent] = useState('');

  const handleSave = () => {
    setSavedContent(content);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 2, fontWeight: 'bold' }}>
        富文本编辑器示例
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 4 }}>
        这个示例展示了如何使用 react-mui-richtext 创建富文本编辑器。
      </Typography>

      <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
        <Box sx={{ mb: 2 }}>
          <Button variant="contained" onClick={handleSave}>
            保存内容
          </Button>
        </Box>

        <RichTextEditor
          name="richtext"
          value={content}
          onChange={setContent}
          allowImageUpload={true}
          enableImageCrop={true}
          allowEmoji={true}
          height={400}
        />

        {savedContent && (
          <Alert severity="success" sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              已保存的内容：
            </Typography>
            <Box
              sx={{
                mt: 1,
                p: 2,
                bgcolor: '#f5f5f5',
                borderRadius: 1,
                maxHeight: 200,
                overflow: 'auto',
              }}
              dangerouslySetInnerHTML={{ __html: savedContent }}
            />
          </Alert>
        )}
      </Paper>

      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom>
          代码示例
        </Typography>
        <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1, overflow: 'auto' }}>
          <Box component="pre" sx={{ fontSize: '0.875rem', m: 0 }}>
            {`import { RichTextEditor } from 'react-mui-richtext';

const [content, setContent] = useState('');

<RichTextEditor
  name="richtext"
  value={content}
  onChange={setContent}
  allowImageUpload={true}
  enableImageCrop={true}
  allowEmoji={true}
  height={400}
/>`}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

