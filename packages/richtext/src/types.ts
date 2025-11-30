import React from 'react';
import { Area } from 'react-easy-crop/types';

export interface RichTextEditorProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  placeholder?: string;
  rows?: number;
  height?: string | number;
  error?: boolean;
  allowImageUpload?: boolean; // Control whether to show image upload button in toolbar
  maxImageSize?: number; // Maximum image size in bytes, default 2MB (2 * 1024 * 1024)
  maxImageCount?: number; // Maximum number of images allowed, default 10
  enableImageCompress?: boolean; // Enable image compression, default true
  maxImageWidth?: number; // Maximum image width in pixels, default 1920
  maxImageHeight?: number; // Maximum image height in pixels, default 1080
  imageQuality?: number; // Image quality (0-1), default 0.8
  allowEmoji?: boolean; // Enable emoji picker, default false
  enableImageCrop?: boolean; // Enable image crop before upload, default false
  cropAspectRatio?: number; // Fixed aspect ratio for cropping (e.g., 210/297 for A4), undefined for free crop
  allowOriginalImageUpload?: boolean; // Enable original size image upload button (no crop, no size limit), default false
  // Configurable handlers and components
  config?: RichTextEditorConfig;
  // Component extensions
  renderToolbar?: (defaultToolbar: React.ReactNode) => React.ReactNode;
  renderCropDialog?: (props: CropDialogProps) => React.ReactNode;
}

export interface RichTextEditorConfig {
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

export interface LoadingButtonProps {
  onClick?: () => void | Promise<void>;
  variant?: 'text' | 'outlined' | 'contained' | 'default';
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  disabled?: boolean;
  loading?: boolean;
  sx?: any;
  children: React.ReactNode;
}

export interface ToolbarItem {
  type: 'button' | 'dropdown' | 'separator';
  handler?: () => void;
  config?: any;
}

export interface RichTextEditorStyles {
  container?: any;
  toolbar?: any;
  editor?: any;
  cropDialog?: any;
}

export interface CropDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onUseOriginal: () => void;
  cropImage: string | null;
  crop: { x: number; y: number };
  zoom: number;
  rotation: number;
  onCropChange: (crop: { x: number; y: number }) => void;
  onZoomChange: (zoom: number) => void;
  onRotationChange: (rotation: number) => void;
  onCropComplete: (croppedArea: Area, croppedAreaPixels: Area) => void;
  cropAspectRatio?: number;
  containerSize: { width: number; height: number };
  onContainerSizeChange: (size: { width: number; height: number }) => void;
  pendingFile: File | null;
}

