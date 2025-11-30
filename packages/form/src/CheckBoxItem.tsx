import React from 'react';
import { Checkbox, CheckboxProps } from '@mui/material';

export interface CheckBoxItemProps extends Omit<CheckboxProps, 'checked'> {
  checked?: boolean;
  name?: string;
  id?: string;
}

export const CheckBoxItem: React.FC<CheckBoxItemProps> = (props) => {
  const { checked, name, id, ...rest } = props;
  return (
    <Checkbox
      {...rest}
      checked={checked}
      name={name}
      id={id}
      sx={{
        justifyContent: 'flex-start',
        '&:hover': {
          background: 'transparent',
        },
        ...rest.sx,
      }}
    />
  );
};

