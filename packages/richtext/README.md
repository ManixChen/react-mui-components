# React MUI RichText Editor

A flexible and extensible rich text editor component for React with Material-UI, based on React Quill.

## Features

- 📝 **Full-featured WYSIWYG Editor** - Based on React Quill with comprehensive formatting options
- 🖼️ **Image Upload & Management** - Upload, compress, crop, and manage images
- 🎨 **Material-UI Integration** - Seamless integration with Material-UI components
- ⚙️ **Highly Configurable** - Extensive configuration options for customization
- 🔌 **Extensible** - Support for custom toolbar items, formats, modules, and render functions
- 📱 **Responsive** - Works well on desktop and mobile devices
- 🎯 **TypeScript Support** - Full TypeScript definitions included

## Installation

```bash
npm install react-mui-richtext
# or
yarn add react-mui-richtext
```

## Peer Dependencies

```bash
npm install react react-dom @mui/material @mui/icons-material
```

**Note:** The following dependencies are automatically installed with this package:
- `react-quill`
- `react-easy-crop`
- `quill-emoji`

## CSS Import

You need to import the required CSS files in your application:

```tsx
import 'react-quill/dist/quill.snow.css';
import 'quill-emoji/dist/quill-emoji.css';
```

Add these imports in your main entry file (e.g., `main.tsx`, `index.tsx`, or `App.tsx`).

## Basic Usage

```tsx
import React, { useState } from 'react';
import { RichTextEditor } from 'react-mui-richtext';
// Don't forget to import CSS files
import 'react-quill/dist/quill.snow.css';
import 'quill-emoji/dist/quill-emoji.css';

function App() {
  const [content, setContent] = useState('');

  return (
    <RichTextEditor
      name="editor"
      value={content}
      onChange={setContent}
      placeholder="Start typing..."
    />
  );
}
```

## Props

### Basic Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | **required** | Field name for the editor |
| `value` | `string` | **required** | HTML content value |
| `onChange` | `(value: string) => void` | **required** | Callback when content changes |
| `onBlur` | `() => void` | - | Callback when editor loses focus |
| `disabled` | `boolean` | `false` | Disable the editor |
| `placeholder` | `string` | `''` | Placeholder text |
| `rows` | `number` | `10` | Number of rows (affects height) |
| `height` | `string \| number` | - | Custom height (overrides rows) |
| `error` | `boolean` | `false` | Show error state |

### Image Upload Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `allowImageUpload` | `boolean` | `true` | Enable image upload button |
| `maxImageSize` | `number` | `2097152` (2MB) | Maximum image size in bytes |
| `maxImageCount` | `number` | `5` | Maximum number of images |
| `enableImageCompress` | `boolean` | `true` | Enable automatic image compression |
| `maxImageWidth` | `number` | `1920` | Maximum image width in pixels |
| `maxImageHeight` | `number` | `1080` | Maximum image height in pixels |
| `imageQuality` | `number` | `0.8` | Image quality (0-1) |
| `enableImageCrop` | `boolean` | `true` | Enable image cropping before upload |
| `cropAspectRatio` | `number` | - | Fixed aspect ratio for cropping (e.g., 210/297 for A4) |
| `allowOriginalImageUpload` | `boolean` | `false` | Enable original size image upload button |

### Feature Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `allowEmoji` | `boolean` | `true` | Enable emoji picker |

### Extension Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `config` | `RichTextEditorConfig` | `{}` | Configuration object (see below) |
| `renderToolbar` | `(defaultToolbar: ReactNode) => ReactNode` | - | Custom toolbar renderer |
| `renderCropDialog` | `(props: CropDialogProps) => ReactNode` | - | Custom crop dialog renderer |

## Configuration Object

The `config` prop allows you to customize various aspects of the editor:

```tsx
interface RichTextEditorConfig {
  // Alert function for notifications
  handleAlert?: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
  
  // Custom LoadingButton component
  LoadingButton?: React.ComponentType<LoadingButtonProps>;
  
  // Custom toolbar items
  customToolbarItems?: ToolbarItem[];
  
  // Custom formats
  customFormats?: string[];
  
  // Custom modules
  customModules?: Record<string, any>;
  
  // Custom styles
  customStyles?: RichTextEditorStyles;
}
```

### Example with Configuration

```tsx
import { RichTextEditor, RichTextEditorConfig } from 'react-mui-richtext';
import { useSnackbar } from 'notistack';
import { LoadingButton } from '@mui/lab';

function MyEditor() {
  const { enqueueSnackbar } = useSnackbar();
  
  const config: RichTextEditorConfig = {
    handleAlert: (message, type = 'info') => {
      enqueueSnackbar(message, { variant: type });
    },
    LoadingButton: LoadingButton,
    customStyles: {
      container: {
        '& .ql-toolbar': {
          backgroundColor: '#f5f5f5',
        },
      },
    },
  };

  return (
    <RichTextEditor
      name="editor"
      value={content}
      onChange={setContent}
      config={config}
    />
  );
}
```

## Advanced Usage

### Custom Toolbar

```tsx
<RichTextEditor
  name="editor"
  value={content}
  onChange={setContent}
  renderToolbar={(defaultToolbar) => (
    <Box>
      {defaultToolbar}
      <Button onClick={handleCustomAction}>Custom Action</Button>
    </Box>
  )}
/>
```

### Custom Crop Dialog

```tsx
<RichTextEditor
  name="editor"
  value={content}
  onChange={setContent}
  renderCropDialog={(props) => (
    <CustomCropDialog {...props} />
  )}
/>
```

### A4 Aspect Ratio Cropping

```tsx
<RichTextEditor
  name="editor"
  value={content}
  onChange={setContent}
  enableImageCrop={true}
  cropAspectRatio={210 / 297} // A4 size
/>
```

### Disable Image Upload

```tsx
<RichTextEditor
  name="editor"
  value={content}
  onChange={setContent}
  allowImageUpload={false}
/>
```

## Styling

The component uses Material-UI's `sx` prop for styling. You can customize styles through the `config.customStyles` prop:

```tsx
const config = {
  customStyles: {
    container: {
      '& .ql-toolbar': {
        backgroundColor: '#fafafa',
        border: '1px solid #e0e0e0',
      },
      '& .ql-editor': {
        minHeight: '300px',
      },
    },
  },
};
```

## Image Compression

The editor automatically compresses images that exceed the size limit or are larger than 500KB. Compression maintains aspect ratio and reduces quality until the image fits within the size limit.

## Image Cropping

When `enableImageCrop` is enabled, users can:
- Drag to move the crop box
- Resize the crop box by dragging corners/edges
- Adjust zoom level
- Rotate the image
- Set fixed aspect ratio (if `cropAspectRatio` is provided)

## TypeScript

Full TypeScript support is included. Import types as needed:

```tsx
import type {
  RichTextEditorProps,
  RichTextEditorConfig,
  CropDialogProps,
  LoadingButtonProps,
} from 'react-mui-richtext';
```

## License

MIT

