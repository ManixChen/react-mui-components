import React from 'react';
import { Checkbox } from '@mui/material';

export interface CheckColumnProps {
  accessorKey?: string;
  header?: string;
  checkedKey?: string;
  onChange?: (event: any, row: any) => void;
  t?: (key: string) => string;
  sx?: any;
  className?: string;
}

export function checkColumn(props: CheckColumnProps) {
  return {
    accessorKey: props.accessorKey || 'itemCheckedStatus',
    header: props.header || ' ',
    enableSorting: false,
    size: 30,
    accessorFn: (row: any, index: number) => (
      <Checkbox
        checked={row?.[props?.checkedKey || 'itemCheckedStatus'] === 'Y' || row?.[props?.checkedKey || 'itemCheckedStatus'] === true}
        onChange={(e) => {
          props.onChange && props.onChange(e, row);
        }}
        color="primary"
        sx={props.sx || {}}
        className={props.className}
      />
    ),
  };
}

