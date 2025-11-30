import React from 'react';
import { Box } from '@mui/material';

export interface ErrorMessageProps {
  message?: string | React.ReactNode;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return message ? (
    <Box
      component="span"
      className="verify"
      sx={{
        color: '#d32f2f',
        fontSize: '0.75rem',
        marginTop: '3px',
        display: 'block',
      }}
    >
      {message || ''}
    </Box>
  ) : null;
};

export default ErrorMessage;

