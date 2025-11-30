import React from 'react';

// Form types
export interface FormItemProps {
  itemForm: FormItem;
  args: FormFormikProps;
}

export interface FormFormikProps {
  formik: any;
  addFun?: any;
  addFunCall?: any;
  searchFun?: (values?: any) => void;
  searchFunCall?: any;
  onResetCall?: any;
}

export interface FormItemListProps extends FormFormikProps {
  formItems: FormItem[];
  args?: any;
  leftActions?: any;
  rightActions?: any;
  rightFilterActions?: any;
  layout?: 'vertical' | 'horizontal' | 'inline';
  hiddenFilter?: boolean;
  bottomActions?: any;
  config?: FormItemListConfig;
}

export interface FormItemListConfig {
  t?: (key: string) => string;
  itemLabelContainerSx?: any;
  itemInputContainerSx?: any;
  formItemLabelStyle?: any;
  formItemLabelStringStyle?: any;
  formItemRightStyle?: any;
}

export interface FormItem {
  name: string;
  type: 'text' | 'password' | 'select' | 'checkbox' | 'radio' | 'date' | 'datetime' | 'richtext' | 'string' | 'selectValue' | 'filter' | 'custom' | 'checkLeftWithRightSelect';
  label?: string;
  labelTsx?: boolean;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  rows?: number;
  id?: string;
  labelName?: string;
  optionList?: any[];
  apiInstance?: (params: any) => Promise<any>;
  filter?: any;
  multiple?: boolean;
  enableLabel?: boolean;
  changeCall?: (value: any, formik: any) => void;
  onInputChange?: (value: string, callback?: () => void) => void;
  filterOptions?: any;
  disableClearable?: boolean;
  render?: (formik: any) => React.ReactNode;
  sx?: any;
  className?: string;
  inputProps?: any;
  upperCase?: boolean;
  autoComplete?: string;
  format?: string;
  views?: ('day' | 'month' | 'year' | 'hours' | 'minutes' | 'seconds')[];
  size?: 'small' | 'medium';
  readonly?: boolean;
  ref?: any;
  // RichTextEditor props
  allowImageUpload?: boolean;
  maxImageSize?: number;
  maxImageCount?: number;
  enableImageCompress?: boolean;
  maxImageWidth?: number;
  maxImageHeight?: number;
  imageQuality?: number;
  allowEmoji?: boolean;
  enableImageCrop?: boolean;
  cropAspectRatio?: number;
  allowOriginalImageUpload?: boolean;
  height?: string | number;
  // Custom RichTextEditor component (optional, falls back to TextField if not provided)
  richTextEditorComponent?: React.ComponentType<any>;
  ruller?: 'Integer' | 'Decimal' | 'Email' | 'xss';
  itemlabelContainerSx?: any;
  itemInputContainerSx?: any;
  labelSx?: any;
  bottomInfo?: React.ReactNode;
  codeList?: Array<{ label: string | number; value: string | number }>;
  checkboxName?: string;
  checkboxDisabled?: boolean;
  stringLabel?: string;
  select?: FormItem;
  rightLabel?: string;
}

