import React from 'react';
import { FormControlLabel, Radio, RadioGroup, Stack, Box } from '@mui/material';

export interface CodeListItem {
  label: string | number;
  value: string | number;
  rightTsx?: React.ReactNode | string;
  sx?: any;
  rightSx?: any;
  className?: string;
  children?: CodeListItem[];
}

export interface RadioBoxControlProps {
  name: string;
  value?: string | number;
  onChange?: (value: string) => void;
  codeList?: CodeListItem[];
  row?: boolean;
  itemSx?: any;
  itemClassName?: string;
}

const defaultCodeList: CodeListItem[] = [
  {
    label: 'Yes',
    value: 'Y',
  },
  {
    label: 'No',
    value: 'N',
  },
];

export const RadioBoxControl: React.FC<RadioBoxControlProps> = ({
  name,
  value,
  onChange,
  codeList = defaultCodeList,
  row = true,
  itemSx,
  itemClassName,
}) => {
  return (
    <RadioGroup
      row={row}
      name={name}
      value={value}
      onChange={(event: any) => {
        onChange?.(event.target.value || '');
      }}
    >
      {codeList.map((item: CodeListItem, index: number) => (
        <React.Fragment key={index}>
          <FormControlLabel
            sx={
              row
                ? {
                    ...(item.sx || itemSx),
                    display: 'flex',
                    width: 'auto',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    mr: 2,
                  }
                : {
                    ...(item.sx || itemSx),
                    display: 'flex',
                    width: '100%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                  }
            }
            className={item.className || itemClassName || ''}
            value={item.value}
            label={
              <Stack direction="row" alignItems="center" alignContent="center" justifyItems="center">
                <Box sx={{ minWidth: row ? 'auto' : '180px' }}>{item.label}</Box>
                <Box sx={item.rightSx || {}}>{item.rightTsx}</Box>
              </Stack>
            }
            control={<Radio color="primary" disabled={item.children && item.children.length > 0 ? true : false} />}
          />
          {item.children &&
            item.children.length > 0 &&
            item.children.map((child: any, childIndex: number) => (
              <FormControlLabel
                key={childIndex}
                sx={
                  row
                    ? {
                        ...(item.sx || itemSx),
                        display: 'flex',
                        width: 'auto',
                        ml: 4,
                        mr: 2,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                      }
                    : {
                        ...(item.sx || itemSx),
                        display: 'flex',
                        width: '100%',
                        ml: 4,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                      }
                }
                className={item.className || itemClassName || ''}
                value={child.value}
                label={child.label}
                control={<Radio color="primary" />}
              />
            ))}
        </React.Fragment>
      ))}
    </RadioGroup>
  );
};

