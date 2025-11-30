import * as React from 'react';
import { Autocomplete, Box, Chip, FormControl, Stack, TextField, Paper } from '@mui/material';
import { useEffect, useState, useCallback } from 'react';
import _ from 'lodash';
import { Checkbox } from '@mui/material';
import { matchSorter } from 'match-sorter';

export interface AutoFetchSelectDropDownProps {
  id?: string;
  name?: string;
  propsInfo: {
    labelName?: string;
    value?: any;
    id?: string;
    itemName?: string;
    allowDisabledSelect?: boolean;
    filterDisabledSelect?: boolean;
  };
  apiInstance?: (params: any) => Promise<any>;
  optionList?: any[];
  errorMsg?: string;
  multiple?: boolean;
  enableAll?: boolean;
  disableClearable?: boolean;
  filter?: any;
  placeholder?: string;
  disabled?: boolean;
  filterOptions?: any;
  onInputChange?: (value: string, callback?: () => void) => void;
  onChangeCall?: (currentItems: any, totalOptions: any, event?: any) => void;
  loadedOptions?: (totalOptions: any, event?: any) => void;
  sx?: any;
}

export const AutoFetchSelectDropDown: React.FC<AutoFetchSelectDropDownProps> = ({
  propsInfo,
  apiInstance,
  optionList = [],
  errorMsg,
  multiple = false,
  enableAll = false,
  disableClearable = false,
  filter,
  placeholder,
  disabled,
  filterOptions,
  onInputChange,
  onChangeCall,
  loadedOptions,
  sx,
  id,
  name,
}) => {
  const getInitialValue = () => {
    if (multiple) {
      return Array.isArray(propsInfo?.value) ? propsInfo?.value : [];
    } else {
      if (propsInfo?.value === undefined || propsInfo?.value === null) {
        return null;
      }
      return typeof propsInfo?.value != 'object' ? propsInfo?.value : propsInfo?.value;
    }
  };

  const [currentSelect, setCurrentSelect] = useState<any>(getInitialValue());
  const [errorMessage, setErrorMessage] = useState<any>(errorMsg);
  const [propsInfoId, setPropsInfoId] = useState<any>(propsInfo.id || 'code');
  const [propsLabelName, setLabelName] = useState<any>(propsInfo.labelName || 'description');
  const [allowDisabledSelect, setAllowDisabledSelect] = useState<boolean>(
    typeof propsInfo?.allowDisabledSelect == 'boolean' ? propsInfo?.allowDisabledSelect : true
  );
  const [filterDisabledSelect, setFilterDisabledSelect] = useState<boolean>(
    typeof propsInfo?.filterDisabledSelect == 'boolean' ? propsInfo?.filterDisabledSelect : false
  );
  const [selectInput, setSelectInput] = useState('');
  const [selectList, setSelectList] = useState<any>({
    list: optionList || [],
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const currentTime = new Date().getTime();

  const initValues = () => {
    if (multiple) {
      setCurrentSelect(Array.isArray(propsInfo?.value) ? propsInfo?.value : []);
    } else {
      const value = propsInfo?.value;
      if (value === undefined || value === null) {
        setCurrentSelect(null);
      } else if (typeof value == 'number') {
        setCurrentSelect(formatCurrentSelect(value));
      } else if (typeof value == 'object') {
        setCurrentSelect(value);
      } else {
        setCurrentSelect(formatCurrentSelect(value));
      }
    }
    setErrorMessage(errorMsg);
  };

  useEffect(() => {
    if (apiInstance) {
      apiInstance({ language: 'en' })
        .then((res: any) => {
          if (res.code === 0) {
            let resultData = res?.resultData || [];
            if (filterDisabledSelect) {
              resultData = resultData.filter((itemData: any) => itemData['disabled'] != 'Y');
            }
            setSelectList({
              list: filter ? resultData.filter((itemData: any) => itemData?.[propsInfoId] != filter) : resultData,
            });
            loadedOptions?.(res.resultData);
          } else {
            setSelectList({
              list: [],
            });
            loadedOptions?.([]);
          }
        })
        .catch(() => {
          setSelectList({
            list: [],
          });
          loadedOptions?.([]);
        });
    }
  }, [apiInstance, filterDisabledSelect]);

  useEffect(() => {
    initValues();
  }, [propsInfo.value, errorMsg, selectList.list]);

  useEffect(() => {
    setPropsInfoId(propsInfo?.id || 'code');
    setLabelName(propsInfo?.labelName || 'description');
    setAllowDisabledSelect(propsInfo?.allowDisabledSelect !== false);
    setFilterDisabledSelect(propsInfo?.filterDisabledSelect === true);
  }, [propsInfo.id, propsInfo.labelName, propsInfo?.allowDisabledSelect, propsInfo?.filterDisabledSelect]);

  useEffect(() => {
    if (optionList) {
      let resultData = optionList || [];
      if (filterDisabledSelect) {
        resultData = resultData.filter((itemData: any) => itemData['disabled'] != 'Y');
      }
      setSelectList({
        list: resultData || [],
      });
    }
  }, [optionList, filterDisabledSelect]);

  useEffect(() => {
    onChangeCall && propsInfo?.value != currentSelect && onChangeCall(currentSelect, selectList.list);
  }, [currentSelect]);

  const formatCurrentSelect = (selectVal: any) => {
    const currentValue = typeof selectVal == 'object' ? selectVal?.[propsInfoId] : selectVal;
    if (!multiple) {
      return selectList?.list?.find((itemSelect: any) => (typeof itemSelect == 'object' ? itemSelect?.[propsInfoId] : itemSelect) == currentValue) || null;
    }
    return [];
  };

  const debounceFetchOptions = React.useMemo(
    () =>
      _.debounce(async (newVal: string) => {
        setIsLoading(true);
        const uperCaseVal = newVal?.toLocaleUpperCase();
        if (!newVal || newVal.trim()) {
          onInputChange?.(uperCaseVal, () => {
            setIsLoading(false);
          });
        }
        const checkFilterOptions = selectList?.list?.filter((itemOp: any) => {
          return itemOp?.[propsLabelName] === uperCaseVal || itemOp?.[propsLabelName]?.indexOf(uperCaseVal) != -1;
        });
        if (checkFilterOptions?.length === 0) {
          onInputChange?.(uperCaseVal, () => {
            setIsLoading(false);
          });
        }
      }, 500),
    [selectList, propsLabelName, onInputChange]
  );

  const filterCommon = (options: any, state: any) => {
    const inputVal = state.inputValue.trim().toLowerCase();
    if (!inputVal) return _.unionBy(options || [], propsInfoId);
    options =
      options?.filter((op: any) => {
        const searchableText = `${op?.[propsLabelName]}${op?.[propsInfoId]}`;
        return searchableText?.toLowerCase().includes(inputVal);
      }) || [];
    let filterOptions: any =
      _.unionBy(options, propsInfoId)?.sort((a: any, b: any) => {
        if (a?.[propsInfoId] === 'A') return -1;
        if (b?.[propsInfoId] === 'A') return 1;
        return a?.[propsInfoId]?.localeCompare(b?.item?.[propsInfoId], undefined, {
          sensitivity: 'base',
        });
      }) || [];
    if (filterOptions.filter((item: any) => item?.[propsInfoId] === 'A')?.length) {
      const firstAllOption = filterOptions.find((item: any) => item?.[propsInfoId] === 'A');
      filterOptions = filterOptions.filter((item: any) => item?.[propsInfoId] != 'A');
      filterOptions.unshift(firstAllOption);
    }
    return filterOptions;
  };

  const mutipleRenderTags = useCallback(
    (value: readonly string[], getTagProps: any) =>
      value.map((option: any, index: any) => {
        const { key, ...tagProps } = getTagProps({ index });
        return option ? (
          <Chip variant="outlined" {...tagProps} label={option ? option[propsLabelName] : option} key={key} />
        ) : (
          ''
        );
      }),
    [propsLabelName]
  );

  useEffect(() => {
    return () => {
      debounceFetchOptions.cancel();
    };
  }, [debounceFetchOptions]);

  if (!multiple) {
    return (
      <Stack>
        <Autocomplete
          disablePortal={false}
          disableClearable={disableClearable}
          id={id || `select_${currentTime}_${apiInstance}`}
          options={selectList.list}
          value={currentSelect ?? null}
          loading={isLoading}
          filterOptions={filterOptions || filterCommon}
          getOptionKey={(option: any) => (propsInfoId ? option[propsInfoId] : {})}
          getOptionLabel={(option: any) => (propsLabelName ? (typeof option == 'object' ? option[propsLabelName] : option) : option)}
          inputValue={selectInput || currentSelect?.[propsLabelName] || ''}
          onInputChange={(event, newVal) => {
            setSelectInput(newVal);
            onInputChange && debounceFetchOptions(newVal);
          }}
          onChange={(event, newVal: any) => {
            setCurrentSelect(newVal);
          }}
          getOptionDisabled={(option: any) => !allowDisabledSelect && typeof option == 'object' && option?.disabled === 'Y'}
          disabled={disabled}
          onBlur={() => {
            const option: any = currentSelect ? selectList.list.find((item: any) => item[propsInfo?.id || 'code'] === currentSelect[propsInfo?.id || 'code']) : {};
            setSelectInput(option?.[propsLabelName] || '');
          }}
          renderInput={(params) => <TextField {...params} name={name} title="Autocomplete Filter" aria-labelledby={'Autocomplete Filter'} placeholder={placeholder || 'Search...'} />}
          sx={{
            minWidth: '60px',
            '&.MuiAutocomplete-root .MuiInputBase-input': {
              height: '40px',
              minWidth: '120px',
            },
            ...(sx || {}),
            border: errorMessage ? '1px solid red' : 'none',
            borderRadius: errorMessage ? '4px' : 'none',
          }}
          PaperComponent={(props: any) => <Paper {...props} style={{ zIndex: 2000 }} />}
        />
        {errorMessage && <span className="verify">{errorMessage}</span>}
      </Stack>
    );
  }

  return (
    <FormControl variant="outlined" fullWidth>
      <Box>
        <Autocomplete
          fullWidth
          disableClearable={false}
          disabled={disabled}
          id={id || `select_${currentTime}_${apiInstance}`}
          options={selectList.list}
          value={Array.isArray(currentSelect) ? currentSelect : []}
          isOptionEqualToValue={(option: any, value: any) => {
            if (_.isArray(currentSelect)) {
              return currentSelect.filter((item: any) => item?.[propsInfoId] == option?.[propsInfoId]).length ? true : false;
            } else if (option == currentSelect) {
              return true;
            }
            return false;
          }}
          multiple
          getOptionKey={(option: any) => (propsInfoId ? option?.[propsInfoId] : {})}
          getOptionLabel={(option: any) => (propsLabelName ? option[propsLabelName] : ' ')}
          getOptionDisabled={(option: any) => !allowDisabledSelect && typeof option == 'object' && option?.disabled === 'Y'}
          onInputChange={(event, newVal) => {
            setSelectInput(newVal);
            onInputChange && debounceFetchOptions(newVal);
          }}
          onChange={(event, newVal: any) => {
            if ((enableAll && newVal.length && newVal.filter((item: any) => (typeof item == 'object' ? item?.[propsInfoId] : item) == -10).length) || selectList.list.length == newVal.length) {
              setCurrentSelect(_.cloneDeep(selectList.list));
            } else {
              setCurrentSelect(_.cloneDeep(newVal));
            }
          }}
          renderTags={mutipleRenderTags}
          renderOption={(props, option, { selected }) => {
            const { key, ...optionProps } = props;
            return (
              <li key={key} {...optionProps}>
                <Checkbox checked={selected} />
                {option?.[propsLabelName] || ''}
              </li>
            );
          }}
          renderInput={(params) => <TextField {...params} name={name} label="" placeholder="" />}
          sx={{
            ...(sx || {}),
            border: errorMessage ? '1px solid red' : 'none',
            borderRadius: errorMessage ? '4px' : 'none',
          }}
        />
        {errorMessage && <span className="verify">{errorMessage}</span>}
      </Box>
    </FormControl>
  );
};

