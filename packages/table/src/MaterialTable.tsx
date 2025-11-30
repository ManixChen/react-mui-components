import React, { useEffect, useMemo, useState, useTransition, useCallback, forwardRef, useImperativeHandle } from 'react';
import { Box, Button, IconButton, InputAdornment, MenuItem, Pagination, Select, TextField, CircularProgress } from '@mui/material';
import { MaterialReactTable, MRT_ExpandedState, MRT_ShowHideColumnsButton, useMaterialReactTable } from 'material-react-table';
import _ from 'lodash';
import RefreshCircleFilledIcon from '@mui/icons-material/ReplayCircleFilled';
import { Clear, Search } from '@mui/icons-material';
import { MaterialTableProps, MaterialTableRef, TableConfig } from './types';
import { filterStringFromObj, formatStrToTime, defaultTableStyles } from './utils';
import { checkColumn } from './CheckColumn';

// Default Loading Component
const DefaultLoading: React.FC<{ loading: boolean }> = ({ loading }: { loading: boolean }) => {
  if (!loading) return null;
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        zIndex: 1000,
      }}
    >
      <CircularProgress />
    </Box>
  );
};

const MaterialTable = forwardRef<MaterialTableRef, MaterialTableProps>(
  (
    props: MaterialTableProps,
    ref: React.ForwardedRef<MaterialTableRef>
  ) => {
    const {
      columns,
      searchParam = {},
      apiInstance,
      loadingErrorMessage = 'Error Loading Data',
      onDataLoad,
      newFormFn,
      newFormFnText = 'New',
      tableBoxClass = '',
      customState = {},
      frontPager = false,
      enablePager = true,
      enableEditing = false,
      enableGrouping = false,
      enableColumnOrdering = true,
      maxHeight = null,
      minHeight = null,
      searchFromEnd = false,
      leftForm = null,
      onPageCall,
      print = false,
      isPrint = false,
      enableSorting = true,
      renderDetailPanel = null,
      getSubRows = null,
      muiTableBodyRowProps = () => ({}),
      muiTableBodyCellProps = () => ({}),
      enableFilter = true,
      loading = false,
      isSearch = true,
      refreshCall,
      title = null,
      onDataChange,
      enableSelect = null,
      columnVisibilityObj = {
        itemCheckedStatus: false,
      },
      enableAllPager = false,
      showPager = true,
      showAll = false,
      onCurrentDataChange,
      config = {},
    } = props;
    const {
      t = (key: string) => key,
      LoadingComponent = DefaultLoading,
      getUserInfo = () => ({}),
      filterStringFromObj: customFilterStringFromObj,
      formatStrToTime: customFormatStrToTime,
      muiTableBodySx,
      muiTableHead,
      pagerContentSx,
      CheckBoxComponent,
      isMobile = () => window.innerWidth < 960,
    } = config as TableConfig;

    const filterFn = customFilterStringFromObj || filterStringFromObj;
    const formatTimeFn: (str: string, defaultHours?: number) => number = customFormatStrToTime || formatStrToTime;
    const tableBodySx = muiTableBodySx || defaultTableStyles.muiTableBodySx;
    const tableHead = muiTableHead || defaultTableStyles.muiTableHead;
    const pagerSx = pagerContentSx || defaultTableStyles.pagerContentSx;

    const [pendingTableData, startPendingTableData] = useTransition();
    const [pagination, setPagination] = useState({
      pageIndex: frontPager ? 0 : 1,
      pageSize: 10,
    });
    const showRowsPage = [10, 20, 30, 50];
    const [tableSorting, setTableSorting] = useState<any>([]);
    const [expanded, setExpanded] = useState<MRT_ExpandedState>({});
    const [tablesDataDefault, setTablesDataDefault] = useState<any[]>([]);
    const [loadTime, setLoadTime] = useState((searchParam as any)?.timeStamp || 0);
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(loading);
    const [isFetching, setIsFetching] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const effectiveShowPager = showAll ? false : showPager;
    const effectiveEnablePager = showAll ? false : enablePager;
    const [isEnablePager, setIsEnablePager] = useState(effectiveEnablePager && effectiveShowPager);
    const [rowCount, setRowCount] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [searchCondition, setSearchCondition] = useState('');
    const [isEnableAllPager, setIsEnableAllPager] = useState(enableAllPager || showAll);
    const [columnVisibility, setColumnVisibility] = useState<any>(null);
    const [tablesReqInfo, setTablesReqInfo] = useState<any>(null);
    const [tablesData, setTablesData] = useState<any[]>([]);
    const [filterString, setFilterString] = useState<string | null>(null);
    const isMoblie = isMobile();

    const refreshTable = () => {
      setIsError(false);
      setFilterString(null);
      setIsLoading(loading);
      if (!apiInstance) {
        setPagination({ ...pagination, ...{ pageIndex: frontPager ? 0 : 1 } });
        setGlobalFilter('');
        if (refreshCall && typeof refreshCall === 'function') {
          refreshCall();
        } else {
          initDataTable({
            resultData: {
              total: tablesDataDefault ? tablesDataDefault?.length : 0,
              list: tablesDataDefault || [],
            },
          });
        }
      } else {
        setPagination({ ...pagination, ...{ pageIndex: frontPager ? 0 : 1 } });
        (searchParam as any).timeStamp = new Date().getTime();
        setLoadTime(new Date().getTime());
      }
    };

    const handleChange = (event: any) => {
      setSearchCondition(event?.target.value || '');
    };

    const filterTableData: any[] = useMemo(() => {
      if (filterString) {
        const filterData = filterFn(tablesData, (value: any, key: any) => {
          if (!value) return false;
          const valueStr = value.toString().toLowerCase();
          const filterStr = _.trim(filterString.toString().toLowerCase());
          return valueStr.indexOf(filterStr) !== -1;
        });
        setRowCount(filterData.length);
        setTotalPage(filterData.length ? Math.ceil(filterData.length / pagination.pageSize) : 0);
        return filterData;
      }
      const total = (tablesReqInfo && tablesReqInfo?.total) || 0;
      const pageCount = (tablesReqInfo && tablesReqInfo?.pageCount) || 0;
      setRowCount(total);
      setTotalPage(pageCount);
      return tablesData;
    }, [filterString, tablesData, tablesReqInfo, filterFn, pagination.pageSize]);

    const bottomgPagerInfo = useCallback(() => {
      return effectiveShowPager ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: {
              xs: 'column',
              sm: 'column',
              md: 'column',
              lg: 'row',
              xl: 'row',
            },
            justifyContent: {
              xs: 'flex-start',
              sm: 'flex-start',
              md: 'flex-start',
              lg: 'space-between',
              xl: 'space-between',
            },
            alignItems: {
              xs: 'flex-start',
              sm: 'flex-start',
              md: 'flex-start',
              lg: 'center',
              xl: 'center',
            },
            gap: {
              xs: '8px',
              sm: '8px',
              md: '8px',
              lg: 0,
              xl: 0,
            },
            padding: '8px',
          }}
        >
          <Box sx={{ padding: '0', alignItems: 'center', display: 'flex' }}>
            <Box component="span" className="total_counts">Total {rowCount} Records</Box>
          </Box>
          {isEnablePager ? (
            <Box className="visibleNotPrinter">
              <Box className="flex flex-1" sx={{ justifyContent: 'space-between', padding: '8px' }}>
                <Box className="" sx={pagerSx}>
                  <Box component="span" className="total_counts">Rows Per Page:</Box>
                  <Select
                    disabled={isLoading}
                    className="tablePageSize"
                    value={[10, 20, 30, 50].includes(pagination.pageSize) ? pagination.pageSize : 0}
                    onChange={(event: any) => {
                      startPendingTableData(() => {
                        if (event?.target?.value === 0) {
                          setIsEnableAllPager(true);
                          setPagination({ ...pagination, ...{ pageSize: rowCount || 10, pageIndex: 0 } });
                        } else {
                          setIsEnableAllPager(false);
                          setPagination({ ...pagination, ...{ pageSize: event?.target?.value || 10, pageIndex: 1 } });
                          const pageCount = rowCount ? Math.ceil(rowCount / event?.target?.value || 10) : 0;
                          setTotalPage(pageCount);
                        }
                      });
                    }}
                    sx={{ marginLeft: '8px' }}
                  >
                    {showRowsPage.map((pageItem: any, indexItem: number) => (
                      <MenuItem key={indexItem} value={pageItem}>
                        {pageItem === 0 ? 'All' : pageItem}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
                <Pagination
                  className="tablePage"
                  disabled={isLoading}
                  showFirstButton
                  showLastButton
                  shape="rounded"
                  page={pagination.pageIndex + (frontPager ? 1 : 0)}
                  count={totalPage}
                  onChange={(event: any, page: number) => {
                    setPagination({ ...pagination, ...{ pageIndex: (frontPager ? -1 : 0) + page } });
                  }}
                />
              </Box>
            </Box>
          ) : (
            ''
          )}
        </Box>
      ) : (
        ''
      );
    }, [rowCount, frontPager, pagination, isLoading, totalPage, effectiveShowPager, isEnablePager, pagerSx]);

    const checkTabelRowItem = (event: any, row: any) => {
      setTablesData((itemVal: any) =>
        itemVal.map((l: any, i: number) =>
          l.itemRowKey === row.itemRowKey
            ? {
                ...row,
                itemCheckedStatus: event.target.checked ? 'Y' : 'N',
              }
            : l
        )
      );
    };

    const columnsData = useMemo(() => {
      if (enableSelect) {
        const checkCol = checkColumn({
          t,
          accessorKey: 'itemCheckedStatus',
          header: ' ',
          checkedKey: 'itemCheckedStatus',
          onChange: checkTabelRowItem,
        });
        return [checkCol, ...columns];
      }
      return columns;
    }, [columns, t, enableSelect, checkTabelRowItem]);

    const table: any = useMaterialReactTable({
      columns: columnsData,
      data: filterTableData,
      enablePagination: isEnablePager && effectiveShowPager,
      enableRowVirtualization: !effectiveShowPager,
      muiSkeletonProps: {
        animation: 'pulse',
        height: 28,
      },
      initialState: {
        pagination,
        density: 'comfortable',
        showGlobalFilter: !isPrint,
        ...customState,
        expanded: expanded,
      },
      manualPagination: !frontPager,
      rowCount: rowCount,
      pageCount: pagination.pageSize,
      state: {
        pagination,
        isLoading: isLoading,
        showAlertBanner: isError,
        showProgressBars: isFetching,
        columnVisibility: columnVisibility,
        sorting: tableSorting,
      },
      paginationDisplayMode: 'pages',
      enableStickyFooter: true,
      enableColumnOrdering: enableColumnOrdering,
      enableColumnResizing: true,
      layoutMode: 'semantic',
      enableFullScreenToggle: false,
      enableColumnDragging: false,
      enableDensityToggle: false,
      enableColumnActions: false,
      enableFilters: false,
      manualFiltering: false,
      enableRowSelection: false,
      enableGlobalFilter: false,
      positionGlobalFilter: 'right',
      enableSubRowSelection: false,
      enableSelectAll: false,
      muiSelectCheckboxProps: {
        color: 'secondary',
      },
      onGlobalFilterChange: setGlobalFilter,
      onColumnFiltersChange: () => {},
      onShowColumnFiltersChange: () => {},
      enableColumnFilterModes: false,
      enableTableHead: true,
      enableMultiSort: false,
      manualSorting: false,
      enableEditing: false,
      enableGrouping: enableGrouping,
      enableHiding: true,
      enableSorting: enableSorting,
      sortingFns: {
        sortByTime: (rowA: any, rowB: any, columnId: any) => {
          const val1 = rowA.getValue(columnId);
          const val2 = rowB.getValue(columnId);
          const start1 = formatTimeFn(typeof val1 === 'string' ? val1 : String(val1 || ''), 23);
          const start2 = formatTimeFn(typeof val2 === 'string' ? val2 : String(val2 || ''), 23);
          return start1 - start2;
        },
      },
      onSortingChange: setTableSorting,
      renderDetailPanel: renderDetailPanel,
      getSubRows: getSubRows,
      muiTableHeadProps: {
        sx: {
          '&.MuiTableHead-root': tableHead,
        },
        children: <Box> </Box>,
      },
      muiTableContainerProps: {
        sx: {
          maxHeight: isEnablePager || isEnableAllPager || maxHeight ? (maxHeight ? `${parseInt(String(maxHeight)) + 100}px!important` : '600px!important') : 'unset',
        },
      },
      muiTableBodyProps: {
        sx: {
          maxHeight: isEnablePager || maxHeight ? maxHeight || '600px' : 'unset',
          overflowY: 'auto',
          minHeight: minHeight,
          '&.MuiTableBody-root': {
            ' .MuiTableRow-root': {
              ...tableBodySx.color,
              '&:hover': isMoblie
                ? {
                    backgroundColor: '#fff !important',
                    'td:after': {
                      backgroundColor: '#fff !important',
                    },
                  }
                : {},
              ...tableBodySx.sx,
              '> .MuiTableCell-root': {
                borderBottom: isMoblie ? '1px solid #fff' : null,
              },
            },
          },
        },
      },
      muiTableProps: {
        sx: {},
      },
      muiTableHeadCellProps: {
        sx: isMoblie
          ? {
              display: 'none!important',
            }
          : {},
      },
      muiTableBodyRowProps: {
        sx: isMoblie
          ? {
              display: 'block!important',
              '&:hover': {
                backgroundColor: '#fff !important',
              },
              border: '3px solid #eee',
              margin: '0 0 20px 0',
              td: {
                padding: 0,
              },
            }
          : {},
      },
      muiTableBodyCellProps: {
        sx: {
          ...(isMoblie
            ? {
                width: '100%!important',
                display: 'block!important',
              }
            : {}),
        },
      },
      renderTopToolbarCustomActions: () => (
        <Box className="m-r-10 table_top_left">
          <Box className="flex flex-1">
            {title || ''}
            {newFormFn && (
              <Box component="span" className="m-r-10 visibleNotPrinter">
                <Button onClick={newFormFn} size="small" variant="contained" color="primary" disableRipple>
                  {newFormFnText}
                </Button>
              </Box>
            )}
            {leftForm}
          </Box>
        </Box>
      ),
      renderToolbarInternalActions: ({ table }: { table: any }) => {
        return (
          <>
            {searchFromEnd && isSearch ? (
              <Box className="visibleNotPrinter">
                <TextField
                  name="searchCondition"
                  onChange={handleChange}
                  onBlur={() => {
                    setLoadTime(new Date().getTime());
                  }}
                  value={searchCondition}
                  autoComplete="off"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search
                          onClick={() => {
                            setLoadTime(new Date().getTime());
                          }}
                          sx={{ cursor: 'pointer' }}
                        />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="start">
                        <Clear
                          onClick={() => {
                            setSearchCondition('');
                            setLoadTime(new Date().getTime());
                          }}
                          sx={{ cursor: 'pointer' }}
                        />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            ) : isSearch ? (
              <Box className="visibleNotPrinter">
                <TextField
                  name="searchCondition"
                  onChange={(e: any) => {
                    setGlobalFilter(e.target.value || '');
                  }}
                  value={globalFilter}
                  autoComplete="off"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ cursor: 'pointer' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="start">
                        <Clear
                          onClick={() => {
                            setGlobalFilter('');
                          }}
                          sx={{ cursor: 'pointer' }}
                        />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            ) : (
              ''
            )}
            {!isPrint && (
              <>
                <IconButton className="visibleNotPrinter" onClick={refreshTable}>
                  <RefreshCircleFilledIcon />
                </IconButton>
                <MRT_ShowHideColumnsButton className="visibleNotPrinter" table={table} />
              </>
            )}
          </>
        );
      },
      renderBottomToolbar: bottomgPagerInfo,
      muiToolbarAlertBannerProps: isError
        ? {
            color: 'error',
            children: loadingErrorMessage,
          }
        : undefined,
    });

    const initDataTable = async (respData: any) => {
      startPendingTableData(() => {
        if (!respData?.resultData?.total && !respData?.resultData?.pageSize && !frontPager) {
          setIsEnablePager(false);
        }
        let list = respData?.resultData?.list || respData?.resultData || [];
        const total = respData?.resultData?.total || respData?.resultData?.length || 0;
        setRowCount(total);
        list = list.map((itemList: any, indexList: number) => {
          return {
            ...itemList,
            itemCheckedStatus: 'N',
            itemRowKey: indexList,
          };
        });
        list && setTablesData(list);
        setTablesDataDefault(list);
        const pageCount = total ? Math.ceil(total / pagination.pageSize) : 0;
        setTotalPage(pageCount);
        setTablesReqInfo({
          list: list,
          total: total,
          pageCount: pageCount,
        });
        setIsError(false);
        setIsFetching(false);
        if (onDataChange && typeof onDataChange === 'function') {
          onDataChange({
            list: list,
            total: total,
            pageCount: pageCount,
          });
        }
        if (!apiInstance) {
        } else {
          setIsLoading(false);
          setIsFetching(false);
        }
      });
    };

    const initTotalDataTable = async (respData: any) => {
      startPendingTableData(() => {
        const list = respData?.resultData?.list || respData?.resultData || [];
        const total = respData?.resultData?.total || respData?.resultData?.length || 0;
        setRowCount(total);
        list && setTablesData(list);
        setTablesDataDefault(list);
        const pageCount = 1;
        setTotalPage(pageCount);
        setTablesReqInfo({
          list: list,
          total: total,
          pageCount: pageCount,
        });
        setIsError(false);
        setIsFetching(false);
        if (onDataChange && typeof onDataChange === 'function') {
          onDataChange({
            list: list,
            total: total,
            pageCount: pageCount,
          });
        }
        if (!apiInstance) {
        } else {
          setIsLoading(false);
          setIsFetching(false);
        }
      });
    };

    async function getCurrentTablesData() {
      const userInfo = getUserInfo();
      if (!tablesData.length) {
        setIsLoading(true);
      }
      const timeStamp = (searchParam as any)?.timeStamp || 0;
      if (frontPager && rowCount !== 0 && timeStamp - new Date().getTime() < -1000) {
        // Skip if front pager and data is recent
        return;
      } else {
        const pageReq: any = {
          ...userInfo,
          page: showAll ? 0 : pagination.pageIndex,
          limit: showAll ? 0 : pagination.pageSize,
          ...searchParam,
        };
        if (searchFromEnd) {
          pageReq.searchCondition = searchCondition;
        }
        setIsLoading(true);
        delete pageReq.timeStamp;
        apiInstance &&
          apiInstance(pageReq)
            .then((res: any) => {
              if (res.code === 0) {
                if (showAll || pagination.pageIndex === 0) {
                  initTotalDataTable(res);
                } else {
                  initDataTable(res);
                }
              } else {
                setIsLoading(false);
                setIsError(false);
              }
              setIsLoading(false);
              setIsError(false);
            })
            .catch(() => {
              setIsLoading(false);
              setIsFetching(false);
            })
            .finally(() => {
              setIsLoading(false);
            });
      }
    }

    useEffect(() => {
      if (searchFromEnd || !filterString?.length || !frontPager) {
        setIsLoading(true);
        apiInstance && getCurrentTablesData();
      }
    }, [searchParam, loadTime, pagination.pageIndex, pagination.pageSize]);

    useEffect(() => {
      setFilterString(globalFilter);
    }, [globalFilter]);

    useEffect(() => {
      setPagination((prev: { pageIndex: number; pageSize: number }) => ({ ...prev, pageIndex: frontPager ? 0 : 1 }));
    }, [filterString, frontPager]);

    useEffect(() => {
      if (onPageCall) {
        onPageCall(tablesData);
      }
    }, [pagination.pageIndex, pagination.pageSize, onPageCall, tablesData]);

    useEffect(() => {
      if (totalPage !== 1 && pagination.pageIndex !== 0) {
        setPagination((prev: { pageIndex: number; pageSize: number }) => ({ ...prev, pageIndex: frontPager ? 0 : 1 }));
      }
    }, [totalPage, frontPager]);

    useEffect(() => {
      if (!apiInstance) {
        setIsLoading(loading);
      }
    }, [loading, apiInstance]);

    useEffect(() => {
      if (columnVisibilityObj) {
        setColumnVisibility((prev: any) => ({
          ...(prev || {}),
          ...columnVisibilityObj,
        }));
      }
    }, [columnVisibilityObj]);

    useEffect(() => {
      if (onCurrentDataChange && typeof onCurrentDataChange === 'function') {
        onCurrentDataChange(tablesData);
      }
    }, [tablesData, onCurrentDataChange]);

    useImperativeHandle(ref, () => {
      return {
        setTableRadioCheckedStatus: (row: any, key: string, values: 'Y' | 'N') => {
          setTablesData((itemVal: any) => itemVal.map((l: any, i: number) => (l?.[key] === row?.[key] ? { ...row, itemCheckedStatus: values } : { ...l, itemCheckedStatus: 'N' })));
        },
        setTableCheckBoxCheckedStatus: (row: any, key: string, values: 'Y' | 'N') => {
          setTablesData((itemVal: any) => itemVal.map((l: any, i: number) => (l?.[key] === row?.[key] ? { ...row, itemCheckedStatus: values } : { ...l })));
        },
        setTableItemData: (key: string, values: any, row: any) => {
          setTablesData((itemVal: any) => itemVal.map((l: any, i: number) => (l?.[key] === values?.[key] ? values : l)));
        },
        refreshTable: () => {
          refreshTable();
        },
      };
    });

    return (
      <Box className={`table_box ${tableBoxClass}`} sx={{ position: 'relative' }}>
        <LoadingComponent loading={pendingTableData || isLoading} />
        <MaterialReactTable table={table} />
      </Box>
    );
  }
);

MaterialTable.displayName = 'MaterialTable';

export default MaterialTable;

