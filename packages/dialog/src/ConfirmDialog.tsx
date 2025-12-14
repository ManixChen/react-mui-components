import { useEffect, useState } from 'react';
import { Box, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ConfirmDialogProps } from './types';

const modalContentSx = {
  fontSize: '1.6rem',
  padding: '1rem 0.2rem',
};

export default function ConfirmDialog(props: ConfirmDialogProps) {
  const [initProps, setInitProps] = useState<any>(props || {});
  const {
    open,
    title,
    message,
    messageCh,
    messageEn,
    onCancel,
    onConfirm,
    confirmColor = 'error',
    confirmText,
    cancelText,
    fullScreen,
    maxWidth = 'md',
    fullClose = false,
    actions = true,
    isModal = false,
    sx = null,
  } = props;
  const [isOpen, setIsOpen] = useState(open);
  const [loading, setLoading] = useState(false);

  const handleClickConfirm = () => {
    setIsOpen(false);
    onConfirm && onConfirm();
  };

  const handleClickClose = () => {
    setIsOpen(false);
    onCancel && onCancel();
  };

  useEffect(() => {
    setIsOpen(open);
    setInitProps(props);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <Dialog
      maxWidth={maxWidth}
      fullScreen={fullScreen}
      open={isOpen}
      sx={sx}
      onClose={
        fullClose
          ? handleClickClose
          : () => {
              console.log('not set full screen close');
            }
      }
      className="confirm_dialog"
    >
      {title && (
        <DialogTitle className="header">
          <span className=" title">{title ? title : '是否刪除數據'} </span>
          {isModal && (
            <IconButton className="f-r" onClick={handleClickClose}>
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>
      )}

      <DialogContent className="dialog_body">
        {message && (
          <Box className="dialog_message" sx={modalContentSx}>
            {' '}
            {message}
          </Box>
        )}
        {props?.content && (
          <Box className="dialog_content" sx={{ width: '100%' }}>
            {props?.content}
          </Box>
        )}

        {!message && !initProps.content && (
          <Box sx={modalContentSx} className="dialog_message">
            {messageEn ? messageEn : 'Confirm to delete?This action  cannot be undone.'}
          </Box>
        )}

        {!message && !initProps.content && (
          <Box sx={modalContentSx} className="dialog_message">
            {messageCh ? messageCh : '此操作不可撤回，請謹慎操作！'}
          </Box>
        )}
        {(onCancel || onConfirm) && actions && (
          <DialogActions className="dialog_action_box">
            {onCancel && (
              <LoadingButton
                sx={{ padding: '0 6px' }}
                className="f-s-14"
                size="small"
                variant="contained"
                onClick={handleClickClose}
                loading={loading}
                color="secondary"
              >
                <span>{cancelText || 'Cancel'}</span>
              </LoadingButton>
            )}

            {onConfirm && (
              <LoadingButton
                sx={{ padding: '0 6px' }}
                className="f-s-14"
                type="submit"
                size="small"
                variant="contained"
                onClick={handleClickConfirm}
                loading={loading}
                color={confirmColor}
              >
                <span>{confirmText || 'Confirm'}</span>
              </LoadingButton>
            )}
          </DialogActions>
        )}
      </DialogContent>
    </Dialog>
  );
}

