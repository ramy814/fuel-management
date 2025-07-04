import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Checkbox,
  IconButton,
  Toolbar,
  Typography,
  Box,
  Chip,
  alpha,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';

export interface Column<T = any> {
  id: keyof T;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T = any> {
  title: string;
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  totalCount?: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;
  selectable?: boolean;
  selectedItems?: T[];
  onSelectionChange?: (selectedItems: T[]) => void;
  getRowId: (row: T) => string | number;
  emptyMessage?: string;
}

export function DataTable<T = any>({
  title,
  columns,
  data,
  loading = false,
  totalCount = data.length,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onEdit,
  onDelete,
  onView,
  selectable = false,
  selectedItems = [],
  onSelectionChange,
  getRowId,
  emptyMessage = 'لا توجد بيانات',
}: DataTableProps<T>) {
  const isSelected = (item: T) => 
    selectedItems.some(selected => getRowId(selected) === getRowId(item));

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!onSelectionChange) return;
    
    if (event.target.checked) {
      onSelectionChange(data);
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectItem = (item: T) => {
    if (!onSelectionChange) return;
    
    const selectedIndex = selectedItems.findIndex(
      selected => getRowId(selected) === getRowId(item)
    );
    
    let newSelected: T[] = [];
    
    if (selectedIndex === -1) {
      newSelected = [...selectedItems, item];
    } else {
      newSelected = selectedItems.filter(
        selected => getRowId(selected) !== getRowId(item)
      );
    }
    
    onSelectionChange(newSelected);
  };

  const numSelected = selectedItems.length;
  const rowCount = data.length;

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      {(title || numSelected > 0) && (
        <Toolbar
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
            ...(numSelected > 0 && {
              bgcolor: (theme) =>
                alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
            }),
          }}
        >
          {numSelected > 0 ? (
            <Typography
              sx={{ flex: '1 1 100%' }}
              color="inherit"
              variant="subtitle1"
              component="div"
            >
              تم تحديد {numSelected} عنصر
            </Typography>
          ) : (
            <Typography
              sx={{ flex: '1 1 100%' }}
              variant="h6"
              id="tableTitle"
              component="div"
            >
              {title}
            </Typography>
          )}

          {numSelected > 0 && onDelete && (
            <IconButton
              color="error"
              onClick={() => selectedItems.forEach(onDelete)}
            >
              <DeleteIcon />
            </IconButton>
          )}
        </Toolbar>
      )}
      
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {selectable && (
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    indeterminate={numSelected > 0 && numSelected < rowCount}
                    checked={rowCount > 0 && numSelected === rowCount}
                    onChange={handleSelectAll}
                    inputProps={{
                      'aria-label': 'تحديد جميع العناصر',
                    }}
                  />
                </TableCell>
              )}
              
              {columns.map((column) => (
                <TableCell
                  key={String(column.id)}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                  sx={{ fontWeight: 'bold' }}
                >
                  {column.label}
                </TableCell>
              ))}
              
              {(onEdit || onDelete || onView) && (
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                  العمليات
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell 
                  colSpan={columns.length + (selectable ? 1 : 0) + (onEdit || onDelete || onView ? 1 : 0)}
                  align="center"
                  sx={{ py: 4 }}
                >
                  جاري التحميل...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell 
                  colSpan={columns.length + (selectable ? 1 : 0) + (onEdit || onDelete || onView ? 1 : 0)}
                  align="center"
                  sx={{ py: 4 }}
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => {
                const isItemSelected = isSelected(row);
                
                return (
                  <TableRow 
                    hover 
                    key={getRowId(row)}
                    selected={isItemSelected}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    }}
                  >
                    {selectable && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          onChange={() => handleSelectItem(row)}
                          inputProps={{
                            'aria-labelledby': `enhanced-table-checkbox-${getRowId(row)}`,
                          }}
                        />
                      </TableCell>
                    )}
                    
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={String(column.id)} align={column.align}>
                          {column.format ? column.format(value, row) : value}
                        </TableCell>
                      );
                    })}
                    
                    {(onEdit || onDelete || onView) && (
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          {onView && (
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => onView(row)}
                              title="عرض التفاصيل"
                            >
                              <ViewIcon />
                            </IconButton>
                          )}
                          
                          {onEdit && (
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => onEdit(row)}
                              title="تعديل"
                            >
                              <EditIcon />
                            </IconButton>
                          )}
                          
                          {onDelete && (
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => onDelete(row)}
                              title="حذف"
                            >
                              <DeleteIcon />
                            </IconButton>
                          )}
                        </Box>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_, newPage) => onPageChange(newPage)}
        onRowsPerPageChange={(event) => onRowsPerPageChange(parseInt(event.target.value, 10))}
        labelRowsPerPage="عدد الصفوف في الصفحة:"
        labelDisplayedRows={({ from, to, count }) => 
          `${from}–${to} من ${count !== -1 ? count : `أكثر من ${to}`}`
        }
        sx={{
          '.MuiTablePagination-toolbar': {
            direction: 'ltr',
          },
          '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
            direction: 'rtl',
          },
        }}
      />
    </Paper>
  );
}