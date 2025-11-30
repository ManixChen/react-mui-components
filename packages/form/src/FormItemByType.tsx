import React, { memo, useState } from 'react';
import { Box, InputAdornment, TextField, FormControl, Stack } from '@mui/material';
import { SearchRounded, VisibilityOffOutlined, RemoveRedEyeOutlined } from '@mui/icons-material';
import { FormItemProps, FormItem } from './types';
import { CheckBoxItem } from './CheckBoxItem';
import { RadioBoxControl } from './RadioBoxControl';
import DateInput from './DateInput';
import DateTimeInput from './DateTimeInput';
import { AutoFetchSelectDropDown } from './AutoFetchSelectDropDown';

export const FormItemByType = memo((props: FormItemProps) => {
  const { itemForm, args } = props;
  const [showPwd, setShowPwd] = useState<boolean>(false);

  // Custom render
  if (itemForm?.type === 'custom' && itemForm?.render) {
    return <>{itemForm.render(args?.formik)}</>;
  }

  // Text, Password, Filter
  if (itemForm?.type === 'text' || itemForm?.type === 'password' || itemForm?.type === 'filter') {
    return (
      <TextField
        id={itemForm.name}
        name={itemForm.name}
        onKeyUp={(e: any) => {
          if (itemForm?.ruller === 'Integer') {
            if (!e.key.match(/[^0-9]/g)) {
              e.preventDefault();
            }
          } else if (itemForm?.ruller === 'Decimal') {
            if (!e.key.match(/[^0-9.]/g)) {
              e.preventDefault();
            }
          } else if (itemForm?.ruller === 'Email') {
            if (!e.key.match(/[^a-zA-Z0-9._-]/g)) {
              e.preventDefault();
            }
          } else if (itemForm?.ruller === 'xss') {
            if (!e.key.match(/[^a-zA-Z0-9._-]/g)) {
              e.preventDefault();
            }
          }
        }}
        type={itemForm.type === 'text' || itemForm.type === 'filter' ? 'text' : showPwd ? 'text' : 'password'}
        value={args?.formik?.values?.[itemForm.name] || ''}
        onChange={(e: any) => {
          const value = e.target.value;
          if (itemForm?.ruller === 'Integer') {
            if (value !== '' && value.match(/[^0-9]/g)) {
              e.preventDefault();
              return;
            }
          } else if (itemForm?.ruller === 'Decimal') {
            if (value !== '' && value.match(/[^0-9.]/g)) {
              e.preventDefault();
              return;
            }
          } else if (itemForm?.ruller === 'Email') {
            if (value !== '' && value.match(/[^a-zA-Z0-9._-]/g)) {
              e.preventDefault();
              return;
            }
          } else if (itemForm?.ruller === 'xss') {
            if (value !== '' && value.match(/[^a-zA-Z0-9._-]/g)) {
              e.preventDefault();
              return;
            }
          }
          args?.formik?.handleChange(e);
          itemForm?.changeCall && itemForm?.changeCall(value, args?.formik);
        }}
        onBlur={args?.formik?.handleBlur}
        multiline={itemForm.rows ? itemForm.rows > 0 : false}
        maxRows={itemForm.rows || 1}
        inputProps={itemForm.inputProps}
        disabled={itemForm.disabled}
        label={itemForm?.enableLabel ? itemForm?.label : ''}
        size={itemForm.size || undefined}
        sx={{
          ...itemForm.sx,
          ...(itemForm.upperCase ? { '.MuiInputBase-input': { textTransform: 'uppercase' } } : {}),
        }}
        className={itemForm.className || ''}
        autoComplete={itemForm.autoComplete || 'new-password'}
        placeholder={itemForm.placeholder || ''}
        InputProps={
          itemForm?.type === 'password'
            ? {
                endAdornment: (
                  <InputAdornment position="start">
                    <Box
                      onClick={() => {
                        setShowPwd((oldVal: boolean) => !oldVal);
                      }}
                    >
                      {showPwd ? (
                        <VisibilityOffOutlined
                          sx={{
                            cursor: 'pointer',
                            verticalAlign: 'bottom',
                          }}
                        />
                      ) : (
                        <RemoveRedEyeOutlined sx={{ cursor: 'pointer', verticalAlign: 'bottom' }} />
                      )}
                    </Box>
                  </InputAdornment>
                ),
              }
            : itemForm?.type === 'filter'
            ? {
                startAdornment: (
                  <InputAdornment sx={{ padding: 0 }} position="start">
                    <SearchRounded sx={{ cursor: 'pointer' }} />
                  </InputAdornment>
                ),
              }
            : undefined
        }
        error={args?.formik?.touched?.[itemForm?.name] && args?.formik?.errors?.[itemForm?.name] ? true : undefined}
      />
    );
  }

  // Select
  if (itemForm?.type === 'select') {
    return (
      <AutoFetchSelectDropDown
        sx={itemForm?.sx}
        id={itemForm?.name}
        name={itemForm?.name}
        placeholder={itemForm?.placeholder}
        disabled={itemForm?.disabled}
        filterOptions={itemForm?.filterOptions}
        value={args?.formik?.values[itemForm.name] ?? (itemForm.multiple ? [] : null)}
        multiple={itemForm.multiple}
        enableAll={itemForm.multiple}
        disableClearable={itemForm.disableClearable}
        onInputChange={itemForm.onInputChange}
        onChangeCall={(currentItems: any, totalOptions: any, event: any) => {
          if (itemForm.multiple) {
            args?.formik?.setFieldValue(itemForm?.name, currentItems, false);
            itemForm?.changeCall && itemForm?.changeCall(currentItems || [], args?.formik);
          } else {
            const fieldValue = currentItems?.[itemForm?.id || 'code'] ?? '';
            args?.formik?.setFieldValue(itemForm?.name, fieldValue, false);
            itemForm?.changeCall && itemForm?.changeCall(currentItems || '', args?.formik);
          }
        }}
        loadedOptions={(totalOptions: any, event: any) => {
          // Optional callback
        }}
        apiInstance={itemForm?.apiInstance}
        optionList={itemForm?.apiInstance ? undefined : itemForm?.optionList || []}
        filter={itemForm?.filter || null}
        onBlur={() => {
          // Don't set touched on blur
        }}
        propsInfo={{
          labelName: itemForm?.labelName || 'description',
          value: itemForm?.multiple ? args?.formik?.values?.[itemForm?.name] || [] : args?.formik?.values?.[itemForm?.name] ?? null,
          id: itemForm?.id || 'code',
          itemName: itemForm?.name || 'description',
        }}
      />
    );
  }

  // Checkbox
  if (itemForm?.type === 'checkbox') {
    return (
      <CheckBoxItem
        id={itemForm.name}
        name={itemForm.name}
        checked={args?.formik?.values[itemForm.name] === 'Y'}
        disabled={itemForm?.disabled}
        onChange={(e: any) => {
          const bool: boolean = e.target.checked;
          args?.formik.setFieldValue(itemForm.name, bool ? 'Y' : 'N');
          itemForm?.changeCall && itemForm?.changeCall(bool, args?.formik);
        }}
      />
    );
  }

  // Radio
  if (itemForm?.type === 'radio') {
    return (
      <RadioBoxControl
        disabled={itemForm?.disabled}
        value={args?.formik?.values?.[itemForm.name]}
        name={itemForm?.name}
        codeList={itemForm?.codeList}
        onChange={(val: string) => {
          args?.formik?.setFieldValue(itemForm?.name, val);
        }}
      />
    );
  }

  // Date
  if (itemForm?.type === 'date') {
    return (
      <DateInput
        ref={itemForm?.ref}
        id={itemForm?.name}
        disabled={itemForm?.disabled}
        readonly={itemForm?.readonly}
        defaultValue={args?.formik?.values[itemForm.name]}
        format={itemForm?.format || 'DD/MM/YYYY'}
        name={itemForm?.name}
        sx={
          itemForm?.sx || {
            minWidth: '200px',
          }
        }
        callBack={(val: string) => {
          const currentValue = args?.formik?.values[itemForm.name];
          if (currentValue !== val) {
            args?.formik?.setFieldValue(itemForm?.name, val);
            itemForm?.changeCall && itemForm?.changeCall(val, args?.formik);
          }
        }}
      />
    );
  }

  // DateTime
  if (itemForm?.type === 'datetime') {
    return (
      <DateTimeInput
        disabled={itemForm?.disabled}
        defaultValue={args?.formik?.values[itemForm.name]}
        format={itemForm?.format || 'DD/MM/YYYY HH:mm:ss'}
        views={itemForm?.views || (['day', 'month', 'year', 'hours', 'minutes', 'seconds'] as ('day' | 'month' | 'year' | 'hours' | 'minutes' | 'seconds')[])}
        callBack={(val: string | null) => {
          const currentValue = args?.formik?.values[itemForm.name];
          if (currentValue !== val) {
            args?.formik?.setFieldValue(itemForm?.name, val || '');
            itemForm?.changeCall && itemForm?.changeCall(val || '', args?.formik);
          }
        }}
      />
    );
  }

  // String (readonly)
  if (itemForm?.type === 'string') {
    return (
      <FormControl fullWidth sx={{ color: '#303030' }} variant="outlined" className="">
        <TextField
          sx={{ '& .MuiInputBase-input': { cursor: 'default' } }}
          id={itemForm.name}
          name={itemForm.name}
          type="text"
          value={args?.formik?.values?.[itemForm.name] || ''}
          InputProps={{ readOnly: true }}
        />
      </FormControl>
    );
  }

  // SelectValue (display only)
  if (itemForm?.type === 'selectValue' && !itemForm.multiple) {
    return (
      <Box justifyItems="center" sx={{ color: '#303030' }}>
        {itemForm?.optionList?.find((options: any) => options?.[itemForm?.id || 'code'] == args?.formik?.values?.[itemForm.name])?.[itemForm?.labelName || 'description'] || ' '}
      </Box>
    );
  }

  // RichText - supports all RichTextEditorProps
  if (itemForm?.type === 'richtext') {
    // If RichTextEditor component is provided via render prop or custom component
    if (itemForm.richTextEditorComponent) {
      const RichTextEditor = itemForm.richTextEditorComponent;
      return (
        <Box
          sx={{
            margin: '0 0 50px 0',
          }}
        >
          <RichTextEditor
            name={itemForm.name}
            value={args?.formik?.values?.[itemForm.name] || ''}
            onChange={(value: string) => {
              args?.formik?.setFieldValue(itemForm?.name, value);
              itemForm?.changeCall && itemForm?.changeCall(value, args?.formik);
            }}
            onBlur={() => {
              args?.formik?.setFieldTouched(itemForm?.name, true);
            }}
            disabled={itemForm?.disabled}
            placeholder={itemForm?.placeholder || ''}
            rows={itemForm.rows || 10}
            height={itemForm.height}
            allowImageUpload={itemForm.allowImageUpload !== false}
            maxImageSize={itemForm.maxImageSize}
            maxImageCount={itemForm.maxImageCount}
            enableImageCompress={itemForm.enableImageCompress !== false}
            maxImageWidth={itemForm.maxImageWidth}
            maxImageHeight={itemForm.maxImageHeight}
            imageQuality={itemForm.imageQuality}
            allowEmoji={itemForm.allowEmoji}
            enableImageCrop={itemForm.enableImageCrop}
            cropAspectRatio={itemForm.cropAspectRatio}
            allowOriginalImageUpload={itemForm.allowOriginalImageUpload}
            error={args?.formik?.touched?.[itemForm?.name] && args?.formik?.errors?.[itemForm?.name] ? true : false}
          />
        </Box>
      );
    }
    
    // Fallback to TextField if RichTextEditor is not provided
    return (
      <Box
        sx={{
          margin: '0 0 50px 0',
        }}
      >
        <TextField
          multiline
          rows={itemForm.rows || 10}
          value={args?.formik?.values?.[itemForm.name] || ''}
          onChange={(e) => {
            args?.formik?.setFieldValue(itemForm?.name, e.target.value);
            itemForm?.changeCall && itemForm?.changeCall(e.target.value, args?.formik);
          }}
          onBlur={() => {
            args?.formik?.setFieldTouched(itemForm?.name, true);
          }}
          disabled={itemForm?.disabled}
          placeholder={itemForm?.placeholder || ''}
          error={args?.formik?.touched?.[itemForm?.name] && args?.formik?.errors?.[itemForm?.name] ? true : false}
          sx={{ width: '100%', height: itemForm.height || 'auto' }}
        />
        {/* Note: To use RichTextEditor, provide richTextEditorComponent in itemForm */}
      </Box>
    );
  }

  return null;
});

FormItemByType.displayName = 'FormItemByType';
