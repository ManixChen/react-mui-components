import React, { memo } from 'react';
import { Box, Grid, FormControl } from '@mui/material';
import ErrorMessage from './ErrorMessage';
import { FormItemListProps } from './types';
import { FormItemByType } from './FormItemByType';

export interface FormItemListConfig {
  t?: (key: string) => string;
  itemLabelContainerSx?: any;
  itemInputContainerSx?: any;
  formItemLabelStyle?: any;
  formItemLabelStringStyle?: any;
  formItemRightStyle?: any;
}

const defaultLabelStyle = {
  fontSize: '14px',
  fontWeight: 500,
  color: '#333',
  marginBottom: '4px',
};

const defaultInputContainerSx = {
  xs: 12,
  sm: 12,
  md: 6,
  lg: 6,
  xl: 6,
};

const defaultLabelContainerSx = {
  xs: 12,
  sm: 12,
  md: 3,
  lg: 3,
  xl: 3,
};

export const FormItemList = memo((props: FormItemListProps) => {
  const { formItems, layout = 'vertical', config } = props;
  const t = config?.t || ((key: string) => key);
  const itemLabelContainerSx = config?.itemLabelContainerSx || defaultLabelContainerSx;
  const itemInputContainerSx = config?.itemInputContainerSx || defaultInputContainerSx;
  const formItemLabelStyle = config?.formItemLabelStyle || defaultLabelStyle;
  const formItemLabelStringStyle = config?.formItemLabelStringStyle || defaultLabelStyle;
  const formItemRightStyle = config?.formItemRightStyle || {};

  if (layout === 'horizontal') {
    return (
      <Grid item container spacing={2}>
        {formItems?.map((itemForm: any, indexForm: number) => (
          <React.Fragment key={indexForm}>
            <Grid
              item
              {...(itemForm.itemlabelContainerSx || itemLabelContainerSx)}
              className="flex"
              alignItems={itemForm.type === 'richtext' ? 'flex-start' : 'center'}
              sx={{ paddingTop: itemForm.type === 'richtext' ? '8px' : '0' }}
            >
              <Box
                className={`form-label ${itemForm.required ? 'required' : ''}`}
                sx={{
                  ...(itemForm.type === 'string' || itemForm.type === 'richtext' ? formItemLabelStringStyle : formItemLabelStyle),
                  ...itemForm.labelSx,
                  alignItems: 'center',
                  fontWeight: itemForm.type === 'richtext' ? '500' : 'normal',
                  marginBottom: itemForm.type === 'richtext' ? '12px' : '0',
                  display: 'block',
                  width: '100%',
                }}
                component="label"
                htmlFor={itemForm.name}
              >
                {itemForm.labelTsx ? itemForm.label || itemForm.label : t(itemForm.label || '')}
                {itemForm.required ? <span className="mandatory" style={{ color: 'red' }}>*</span> : ' '}
              </Box>
            </Grid>
            <Grid item {...(itemForm.itemInputContainerSx || itemInputContainerSx)} sx={{ marginTop: itemForm.type === 'richtext' ? '0' : 'auto' }}>
              {itemForm.type === 'custom' && itemForm.render ? (
                <FormItemByType itemForm={itemForm} args={props} />
              ) : itemForm.type === 'richtext' ? (
                <FormItemByType itemForm={itemForm} args={props} />
              ) : (
                <FormControl fullWidth margin="dense" variant="outlined" sx={formItemRightStyle}>
                  <FormItemByType itemForm={itemForm} args={props} />
                </FormControl>
              )}
              {itemForm.bottomInfo && <Box sx={{ marginTop: '8px' }}>{itemForm.bottomInfo}</Box>}
              <ErrorMessage message={props?.formik.touched?.[itemForm.name] && props?.formik.errors?.[itemForm.name] && props?.formik.errors?.[itemForm.name]} />
            </Grid>
          </React.Fragment>
        )) || ''}
      </Grid>
    );
  }

  return (
    <>
      {formItems?.map((itemForm: any, indexForm: number) => (
        <Grid key={indexForm} item container spacing={2} sx={{ marginBottom: itemForm.type === 'richtext' ? '24px' : '8px' }}>
          <Grid
            item
            {...(itemForm.itemlabelContainerSx || itemLabelContainerSx)}
            className="flex"
            alignItems={itemForm.type === 'richtext' ? 'flex-start' : 'center'}
            sx={{ paddingTop: itemForm.type === 'richtext' ? '8px' : '0' }}
          >
            <Box
              className={`form-label ${itemForm.required ? 'required' : ''}`}
              sx={{
                ...(itemForm.type === 'string' || itemForm.type === 'richtext' ? formItemLabelStringStyle : formItemLabelStyle),
                ...itemForm.labelSx,
                alignItems: 'center',
                fontWeight: itemForm.type === 'richtext' ? '500' : 'normal',
                marginBottom: itemForm.type === 'richtext' ? '12px' : '0',
                display: 'block',
                width: '100%',
              }}
              component="label"
              htmlFor={itemForm.name}
            >
              {itemForm.labelTsx ? itemForm.label : t(itemForm.label || '')}
              {itemForm.required ? <span className="mandatory" style={{ color: 'red' }}>*</span> : ' '}
            </Box>
          </Grid>
          <Grid item {...(itemForm.itemInputContainerSx || itemInputContainerSx)} sx={{ marginTop: itemForm.type === 'richtext' ? '0' : 'auto' }}>
            {itemForm.type === 'custom' && itemForm.render ? (
              <FormItemByType itemForm={itemForm} args={props} />
            ) : itemForm.type === 'richtext' ? (
              <FormItemByType itemForm={itemForm} args={props} />
            ) : (
              <FormControl fullWidth margin="dense" variant="outlined" sx={formItemRightStyle}>
                <FormItemByType itemForm={itemForm} args={props} />
              </FormControl>
            )}
            {itemForm.bottomInfo && (
              <Box sx={{ marginTop: '8px' }}>
                <Box component="span" className="mandatory">
                  {itemForm.bottomInfo}
                </Box>
              </Box>
            )}
            <ErrorMessage message={props?.formik.touched?.[itemForm.name] && props?.formik.errors?.[itemForm.name] && props?.formik.errors?.[itemForm.name]} />
          </Grid>
        </Grid>
      )) || ''}
    </>
  );
});

FormItemList.displayName = 'FormItemList';
