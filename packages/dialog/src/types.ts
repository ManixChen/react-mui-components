import React from 'react';

export interface ConfirmDialogProps {
  title?: React.ReactNode | JSX.Element | string;
  message?: React.ReactNode | JSX.Element | string;
  messageCh?: React.ReactNode | JSX.Element | string;
  messageEn?: React.ReactNode | JSX.Element | string;
  content?: React.ReactNode | JSX.Element | string;
  confirmColor?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  confirmText?: string;
  cancelText?: string;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  fullScreen?: boolean;
  fullClose?: boolean;
  actions?: boolean;
  isModal?: boolean;
  open: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
  sx?: any;
}

export interface ConfirmDialogContextProps {
  title: React.ReactNode | JSX.Element | string;
  message?: React.ReactNode | JSX.Element | string;
  messageCh?: React.ReactNode | JSX.Element | string;
  messageEn?: React.ReactNode | JSX.Element | string;
  confirmColor?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  isModal?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export interface ConfirmContextType {
  openConfirm: (props: ConfirmDialogContextProps) => void;
}

export interface DynamicDialogProps {
  title?: React.ReactNode | JSX.Element | string;
  content?: React.ReactNode | JSX.Element | string;
  message?: JSX.Element | string;
  messageCh?: JSX.Element | string;
  messageEn?: JSX.Element | string;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  confirmColor?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  confirmText?: string;
  cancelText?: string;
  isModal?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export interface DynamicContextType {
  openModal: (props: DynamicDialogProps) => void;
  closeModal: () => void;
}

