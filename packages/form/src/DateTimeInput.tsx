import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef } from 'react';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Today } from '@mui/icons-material';
import { Stack } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';

export interface DateTimeInputProps {
  callBack?: (val: string | null, date?: any) => void;
  defaultValue?: string | Date | any | null;
  ampm?: boolean;
  disabled?: boolean;
  disableFuture?: boolean;
  format?: string;
  clearToday?: boolean;
  disableTime?: boolean;
  views?: ('day' | 'month' | 'year' | 'hours' | 'minutes' | 'seconds')[];
  name?: string;
  id?: string;
}

export interface DateTimeInputRef {
  setCurrentDate: (date: string | Date | any | null) => void;
  reset: () => void;
}

const DateTimeInput = forwardRef<DateTimeInputRef, DateTimeInputProps>(
  (
    {
      callBack,
      defaultValue = null,
      ampm = false,
      disabled = false,
      disableFuture = false,
      format = 'DD-MM-YYYY HH:mm',
      clearToday = false,
      disableTime = false,
      views = ['day', 'month', 'year', 'hours', 'minutes'],
      name,
      id,
    },
    ref
  ) => {
    const isUserActionRef = useRef<boolean>(false);
    const isUpdatingFromDefaultValueRef = useRef<boolean>(false);
    const prevCurrentDateStrRef = useRef<string>('');
    const prevDefaultValueStrRef = useRef<string | null>(null);

    const [currentDate, setCurrentDate] = useState<any>(() => {
      if (defaultValue) {
        const parsed = typeof defaultValue === 'string' ? dayjs(defaultValue, format) : dayjs(defaultValue);
        if (parsed.isValid()) {
          const dateStr = parsed.format(format);
          prevCurrentDateStrRef.current = dateStr;
          prevDefaultValueStrRef.current = dateStr;
          return parsed;
        }
      }
      return null;
    });

    const reset = () => {
      setCurrentDate(null);
      prevCurrentDateStrRef.current = '';
      isUserActionRef.current = true;
    };

    useImperativeHandle(ref, () => ({
      setCurrentDate: (date: string | Date | any | null) => {
        if (!date) {
          setCurrentDate(null);
          prevCurrentDateStrRef.current = '';
          return;
        }
        const parsed = typeof date === 'string' ? dayjs(date, format) : dayjs(date);
        if (parsed.isValid()) {
          isUpdatingFromDefaultValueRef.current = true;
          const dateStr = parsed.format(format);
          setCurrentDate(parsed);
          prevCurrentDateStrRef.current = dateStr;
        }
      },
      reset,
    }));

    const handleDateChange = (newDate: any | null) => {
      isUserActionRef.current = true;
      isUpdatingFromDefaultValueRef.current = false;
      setCurrentDate(newDate);
    };

    useEffect(() => {
      if (isUpdatingFromDefaultValueRef.current) {
        isUpdatingFromDefaultValueRef.current = false;
        return;
      }

      if (isUserActionRef.current) {
        const dateStr = currentDate ? dayjs(currentDate).format(format) : '';
        const prevDateStr = prevCurrentDateStrRef.current;

        if (dateStr !== prevDateStr) {
          prevCurrentDateStrRef.current = dateStr;
          callBack?.(dateStr || null, currentDate);
        }
        isUserActionRef.current = false;
      }
    }, [currentDate, format, callBack]);

    useEffect(() => {
      const normalizeValue = (val: string | Date | any | null | undefined): string | null => {
        if (!val) return null;
        if (typeof val === 'string') return val.trim() || null;
        if (val instanceof Date || dayjs.isDayjs(val)) {
          const d = dayjs(val);
          return d.isValid() ? d.format(format) : null;
        }
        return null;
      };

      const prevValueStr = prevDefaultValueStrRef.current;
      const currentValueStr = normalizeValue(defaultValue);

      if (prevValueStr !== currentValueStr) {
        prevDefaultValueStrRef.current = currentValueStr;
        isUpdatingFromDefaultValueRef.current = true;

        if (defaultValue) {
          const parsedDate = typeof defaultValue === 'string' ? dayjs(defaultValue, format, true) : dayjs(defaultValue);
          if (parsedDate.isValid()) {
            const currentDateStr = prevCurrentDateStrRef.current;
            const newDateStr = parsedDate.format(format);
            if (currentDateStr !== newDateStr) {
              setCurrentDate(parsedDate);
              prevCurrentDateStrRef.current = newDateStr;
            } else {
              prevCurrentDateStrRef.current = newDateStr;
            }
          } else {
            if (prevCurrentDateStrRef.current !== '') {
              setCurrentDate(null);
              prevCurrentDateStrRef.current = '';
            }
          }
        } else {
          if (prevCurrentDateStrRef.current !== '') {
            setCurrentDate(null);
            prevCurrentDateStrRef.current = '';
          }
        }
      }
    }, [defaultValue, format]);

    const getViewsAndOpenTo = () => {
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

      const timeParts: ('hours' | 'minutes' | 'seconds')[] = [];
      const originalFormat = format;

      if (originalFormat.includes('HH') || (originalFormat.includes('H') && !originalFormat.includes('HH'))) {
        timeParts.push('hours');
      }
      if (originalFormat.includes('mm') && !originalFormat.includes('MM')) {
        timeParts.push('minutes');
      } else if (originalFormat.includes('mm')) {
        const mmIndex = originalFormat.indexOf('mm');
        const MMIndex = originalFormat.indexOf('MM');
        if (mmIndex > MMIndex) {
          timeParts.push('minutes');
        }
      }
      if (originalFormat.includes('ss') || originalFormat.includes('SS')) {
        timeParts.push('seconds');
      }

      let finalViews: any[] = views;
      const isDefaultViews =
        views &&
        views.length === 5 &&
        views[0] === 'day' &&
        views[1] === 'month' &&
        views[2] === 'year' &&
        views[3] === 'hours' &&
        views[4] === 'minutes';

      if (!views || views.length === 0 || isDefaultViews) {
        finalViews = [...dateParts, ...timeParts];
      }

      return {
        views: finalViews,
        openTo: openTo,
      };
    };

    const { views: dateTimeViews, openTo: dateTimeOpenTo } = getViewsAndOpenTo();
    const ref1 = useRef(null);

    useEffect(() => {
      if (ref1.current) {
        (ref1.current as any).setAttribute('readonly', 'readonly');
      }
    }, []);

    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Stack direction="row" spacing={3}>
          <DateTimePicker
            ampm={ampm}
            disabled={disabled}
            format={format}
            timeSteps={{ hours: 1, minutes: 1, seconds: 1 }}
            disableFuture={disableFuture}
            className="flex-1"
            value={currentDate ? dayjs(currentDate) : null}
            onChange={handleDateChange}
            shouldDisableTime={(value: any, view: any) => {
              return disableTime;
            }}
            inputRef={ref1}
            views={dateTimeViews}
            openTo={dateTimeOpenTo}
          />
          {clearToday && (
            <Today
              className="pointer"
              onClick={() => {
                isUserActionRef.current = true;
                isUpdatingFromDefaultValueRef.current = false;
                setCurrentDate(currentDate ? null : dayjs());
              }}
            />
          )}
        </Stack>
      </LocalizationProvider>
    );
  }
);

DateTimeInput.displayName = 'DateTimeInput';

export default DateTimeInput;

