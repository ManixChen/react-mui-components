import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { Today } from '@mui/icons-material';
import { Box, FormControlLabel, Checkbox, FormControl, Stack } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export interface DateInputProps {
  callBack?: (val: string, date?: Dayjs | null, birthYearInd?: boolean) => void;
  defaultValue?: string | Date | Dayjs | null;
  disabled?: boolean;
  readonly?: boolean;
  disableFuture?: boolean;
  disablePast?: boolean;
  format?: string;
  today?: boolean;
  yearOnly?: boolean;
  birthYear?: boolean;
  maxDate?: Dayjs | Date | string | null;
  sx?: any;
  name?: string;
  id?: string;
}

export interface DateInputRef {
  setCurrentDate: (date: string | Date | Dayjs | null) => void;
  reset: () => void;
}

const DateInput = forwardRef<DateInputRef, DateInputProps>(
  (
    {
      callBack,
      defaultValue = null,
      disabled = false,
      readonly = false,
      disableFuture = true,
      disablePast = false,
      format = 'DD-MM-YYYY',
      today = false,
      yearOnly = false,
      birthYear = false,
      maxDate = null,
      sx = {},
      name,
      id,
    },
    ref
  ) => {
    const [currentDate, setCurrentDate] = useState<Dayjs | null>(() => {
      if (defaultValue) {
        const parsed = typeof defaultValue === 'string' ? dayjs(defaultValue, format) : dayjs(defaultValue);
        return parsed.isValid() ? parsed : null;
      }
      return null;
    });
    const [birthYearInd, setBirthYearInd] = useState<boolean>(birthYear);
    const isUserActionRef = useRef<boolean>(false);
    const isUpdatingFromDefaultValueRef = useRef<boolean>(false);
    const [resetKey, setResetKey] = useState(0);
    const prevCurrentDateRef = useRef<string>('');

    const reset = () => {
      isUpdatingFromDefaultValueRef.current = true;
      setCurrentDate(null);
      prevCurrentDateRef.current = '';
      isUserActionRef.current = true;
      setResetKey((prev) => prev + 1);
    };

    useImperativeHandle(ref, () => ({
      setCurrentDate: (date: string | Date | Dayjs | null) => {
        if (!date) {
          setCurrentDate(null);
          return;
        }
        const parsed = typeof date === 'string' ? dayjs(date, format) : dayjs(date);
        if (parsed.isValid()) {
          isUpdatingFromDefaultValueRef.current = true;
          setCurrentDate(parsed);
        }
      },
      reset,
    }));

    const handleDateChange = (newDate: Dayjs | null) => {
      isUserActionRef.current = true;
      setCurrentDate(newDate);
    };

    useEffect(() => {
      if (isUpdatingFromDefaultValueRef.current) {
        isUpdatingFromDefaultValueRef.current = false;
        const dateStr = currentDate ? currentDate.format(format) : '';
        prevCurrentDateRef.current = dateStr;
        return;
      }

      const currentDateStr = currentDate ? currentDate.format(format) : '';
      if (prevCurrentDateRef.current !== currentDateStr && isUserActionRef.current) {
        prevCurrentDateRef.current = currentDateStr;

        if (yearOnly && birthYearInd) {
          const yearDate = currentDate ? dayjs(currentDate).month(0).date(1) : null;
          const yearStr = yearDate ? yearDate.format(format) : '';
          callBack?.(yearStr, yearDate, birthYearInd);
        } else {
          callBack?.(currentDateStr, currentDate);
        }
      }
      isUserActionRef.current = false;
    }, [currentDate, birthYearInd, format, callBack, yearOnly]);

    const prevDefaultValueRef = useRef<string | null | undefined>(undefined);
    useEffect(() => {
      const normalizeValue = (val: string | Date | Dayjs | null | undefined): string | null => {
        if (val === null || val === undefined) return null;
        if (typeof val === 'string') {
          const trimmed = val.trim();
          return trimmed === '' ? null : trimmed;
        }
        if (val instanceof Date || dayjs.isDayjs(val)) {
          const d = dayjs(val);
          return d.isValid() ? d.format(format) : null;
        }
        return null;
      };

      const defaultValueStr = normalizeValue(defaultValue);
      const prevDefaultValueStr = prevDefaultValueRef.current;

      if (prevDefaultValueStr !== defaultValueStr || prevDefaultValueRef.current === undefined) {
        prevDefaultValueRef.current = defaultValueStr;
        isUpdatingFromDefaultValueRef.current = true;

        if (!defaultValue || (typeof defaultValue === 'string' && defaultValue.trim() === '')) {
          setCurrentDate(null);
          prevCurrentDateRef.current = '';
        } else {
          const parsedDate = typeof defaultValue === 'string' ? dayjs(defaultValue, format) : dayjs(defaultValue);
          if (parsedDate.isValid()) {
            const currentDateStr = prevCurrentDateRef.current;
            const newDateStr = parsedDate.format(format);
            if (currentDateStr !== newDateStr) {
              setCurrentDate(parsedDate);
              prevCurrentDateRef.current = newDateStr;
            } else {
              prevCurrentDateRef.current = newDateStr;
            }
          } else {
            const currentDateStr = prevCurrentDateRef.current;
            if (currentDateStr !== '') {
              setCurrentDate(null);
            }
            prevCurrentDateRef.current = '';
          }
        }
      }
    }, [defaultValue, format]);

    const getViewsAndOpenTo = () => {
      if (yearOnly && birthYearInd) {
        return {
          views: ['year'] as ('day' | 'month' | 'year')[],
          openTo: 'year' as 'day' | 'month' | 'year',
        };
      }

      const formatUpper = format.toUpperCase();
      const dateParts: ('day' | 'month' | 'year')[] = [];
      let openTo: 'day' | 'month' | 'year' = 'month';

      if (formatUpper.includes('DD') || formatUpper.includes('D')) {
        const dayIndex = formatUpper.indexOf('DD') !== -1 ? formatUpper.indexOf('DD') : formatUpper.indexOf('D');
        const monthIndex = formatUpper.indexOf('MM') !== -1 ? formatUpper.indexOf('MM') : formatUpper.indexOf('M');
        const yearIndex = formatUpper.indexOf('YYYY') !== -1 ? formatUpper.indexOf('YYYY') : formatUpper.indexOf('YY');

        const positions = [
          { type: 'day' as const, index: dayIndex },
          { type: 'month' as const, index: monthIndex },
          { type: 'year' as const, index: yearIndex },
        ]
          .filter((p) => p.index !== -1)
          .sort((a, b) => a.index - b.index);

        dateParts.push(...positions.map((p) => p.type));
        openTo = positions[0]?.type || 'month';
      } else {
        dateParts.push('day', 'month', 'year');
        openTo = 'month';
      }

      return {
        views: dateParts.length > 0 ? dateParts : (['day', 'month', 'year'] as ('day' | 'month' | 'year')[]),
        openTo: openTo,
      };
    };

    const { views: dateViews, openTo: dateOpenTo } = getViewsAndOpenTo();

    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <FormControl variant="outlined" sx={{ ...sx }} disabled={disabled}>
          <Stack direction="row" spacing={1} alignItems="center" alignContent="center">
            <DatePicker
              key={resetKey > 0 ? `date-reset-${resetKey}` : defaultValue ? `date-${defaultValue}` : 'date-empty'}
              value={currentDate}
              onChange={handleDateChange}
              disabled={disabled}
              format={format}
              views={dateViews}
              openTo={dateOpenTo}
              disableFuture={disableFuture}
              disablePast={disablePast}
              maxDate={maxDate ? (dayjs.isDayjs(maxDate) ? maxDate : dayjs(maxDate)) : undefined}
              readOnly={readonly}
              slotProps={{
                textField: {
                  variant: 'outlined',
                  fullWidth: true,
                  size: 'small',
                  sx: {
                    minWidth: '200px',
                    alignItems: 'center',
                    display: 'flex',
                    margin: ' 0',
                    justifyContent: 'center',
                    '.MuiOutlinedInput-input': {
                      alignItems: 'center',
                      padding: '4px',
                      height: '36px',
                    },
                  },
                },
              }}
            />
            {today && (
              <Today
                className="pointer"
                onClick={() => {
                  isUserActionRef.current = true;
                  setCurrentDate(currentDate ? null : dayjs());
                }}
              />
            )}
            {yearOnly && (
              <FormControlLabel
                control={<Checkbox />}
                name="birthYearInd"
                sx={{ marginLeft: '10px !important' }}
                checked={birthYearInd}
                onChange={(e: any) => {
                  isUserActionRef.current = true;
                  setBirthYearInd(e.target.checked);
                }}
                label="With Birth Year Only"
              />
            )}
          </Stack>
        </FormControl>
      </LocalizationProvider>
    );
  }
);

DateInput.displayName = 'DateInput';

export default DateInput;

