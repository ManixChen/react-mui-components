import _ from 'lodash';
import dayjs from 'dayjs';

/**
 * Filter data by string matching
 * Similar to the original filterStringFromObj but adapted for array filtering
 */
export function filterStringFromObj(data: any[], filterFn: (value: any, key: any) => boolean): any[] {
  if (!data || !Array.isArray(data)) return [];
  return data.filter((item) => {
    if (typeof item !== 'object' || item === null) return false;
    return Object.keys(item).some((key) => {
      return filterFn(item[key], key);
    });
  });
}

/**
 * Format string to timestamp
 */
export function formatStrToTime(str: string, defaultHours: number = 0): number {
  if (!str) return 0;
  const date = dayjs(str);
  if (!date.isValid()) return 0;
  return date.hour(defaultHours).minute(0).second(0).millisecond(0).valueOf();
}

/**
 * Default table styles
 */
export const defaultTableStyles = {
  muiTableBodySx: {
    color: {
      xs: '#000',
      sm: '#000',
      md: '#000',
      lg: '#000',
      xl: '#000',
    },
    sx: {
      '&:hover': {
        backgroundColor: '#f5f5f5',
      },
    },
  },
  muiTableHead: {
    backgroundColor: '#fafafa',
    fontWeight: 600,
  },
  pagerContentSx: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
};

