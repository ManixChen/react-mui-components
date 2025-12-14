import React from 'react';
import { Box, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { LoadingButton } from '@mui/lab';

export interface SimpleDialogProps {
  children: React.ReactNode;
  open?: boolean;
  onClose?: () => void;
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
  title?: string;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  onCancel?: () => void;
  hiddenActions?: boolean;
}

export const SimpleDialog: React.FC<SimpleDialogProps> = ({
  children,
  open = false,
  onClose,
  onSubmit,
  title,
  maxWidth = 'lg',
  onCancel,
  hiddenActions = false,
}) => {
  return (
    <Dialog
      open={open}
      onClose={() => {
        onClose && onClose();
      }}
      maxWidth={maxWidth}
      PaperProps={{
        component: 'form',
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          onSubmit && onSubmit(event);
        },
      }}
    >
      <DialogTitle
        sx={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#1976d2',
          textAlign: 'center',
          paddingBottom: '20px',
        }}
      >
        {title}
      </DialogTitle>
      <DialogContent sx={{ padding: '10px 24px' }}>{children}</DialogContent>
      {!hiddenActions && (
        <DialogActions
          sx={{
            justifyContent: 'center',
            borderTop: '1px solid #e0e0e0',
          }}
        >
          <Box sx={{ padding: '20px 24px' }}>
            <LoadingButton
              variant="contained"
              color="primary"
              type="button"
              onClick={() => {
                onClose && onClose();
                onCancel && onCancel();
              }}
              sx={{
                minWidth: '120px',
                fontWeight: 'bold',
                fontSize: '1rem',
              }}
            >
              Close
            </LoadingButton>
          </Box>
        </DialogActions>
      )}
    </Dialog>
  );
};

