import React from 'react';
import { MRT_ExpandedState } from 'material-react-table';

export interface TableColumn {
  accessorKey?: string;
  header?: string;
  [key: string]: any;
}

export interface MaterialTableProps {
  columns: TableColumn[];
  searchParam?: any;
  apiInstance?: (params: any) => Promise<any>;
  loadingErrorMessage?: string;
  onDataLoad?: (data: any) => void;
  newFormFn?: () => void;
  newFormFnText?: string;
  tableBoxClass?: string;
  customState?: any;
  frontPager?: boolean;
  enablePager?: boolean;
  enableEditing?: boolean;
  enableGrouping?: boolean;
  enableColumnOrdering?: boolean;
  maxHeight?: string | number | null;
  minHeight?: string | number | null;
  searchFromEnd?: boolean;
  leftForm?: React.ReactNode;
  onPageCall?: (data: any[]) => void;
  print?: boolean;
  isPrint?: boolean;
  enableSorting?: boolean;
  renderDetailPanel?: (row: any) => React.ReactNode | null;
  getSubRows?: (row: any) => any[] | undefined;
  muiTableBodyRowProps?: (props: any) => any;
  muiTableBodyCellProps?: (props: any) => any;
  enableFilter?: boolean;
  loading?: boolean;
  isSearch?: boolean;
  refreshCall?: () => void;
  title?: React.ReactNode;
  onDataChange?: (data: any) => void;
  enableSelect?: boolean;
  columnVisibilityObj?: Record<string, boolean>;
  enableAllPager?: boolean;
  showPager?: boolean;
  showAll?: boolean;
  onCurrentDataChange?: (data: any[]) => void;
  // Configurable handlers
  config?: TableConfig;
}

export interface TableConfig {
  // Translation function
  t?: (key: string) => string;
  // Loading component
  LoadingComponent?: React.ComponentType<{ loading: boolean }>;
  // User info getter (for API calls)
  getUserInfo?: () => any;
  // Format functions
  filterStringFromObj?: (data: any[], filterFn: (value: any, key: any) => boolean) => any[];
  formatStrToTime?: (str: string, defaultHours?: number) => number;
  // Styles
  muiTableBodySx?: any;
  muiTableHead?: any;
  pagerContentSx?: any;
  // Check column component
  CheckBoxComponent?: React.ComponentType<any>;
  // Mobile detection
  isMobile?: () => boolean;
}

export interface MaterialTableRef {
  setTableRadioCheckedStatus: (row: any, key: string, values: 'Y' | 'N') => void;
  setTableCheckBoxCheckedStatus: (row: any, key: string, values: 'Y' | 'N') => void;
  setTableItemData: (key: string, values: any, row: any) => void;
  refreshTable: () => void;
}

