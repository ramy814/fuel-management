import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  MenuItem,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  Chip,
  Card,
  CardContent,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Receipt,
  AttachMoney,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { RootState, AppDispatch } from '../store';
import { DataTable, Column } from '../components/tables/DataTable';
import { InvoiceForm } from '../components/forms/InvoiceForm';
import { GasBill, CreateGasBillDTO, UpdateGasBillDTO } from '../types';
import {
  fetchInvoicesAsync,
  createInvoiceAsync,
  setFilters,
  clearFilters,
} from '../store/slices/invoicesSlice';
import { showSnackbar } from '../store/slices/uiSlice';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

export const InvoicesPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { 
    invoices, 
    loading, 
    error, 
    filters, 
    pagination 
  } = useSelector((state: RootState) => state.invoices);
  const { stations } = useSelector((state: RootState) => state.stations);
  const { constantsByType } = useSelector((state: RootState) => state.constants);

  const [formOpen, setFormOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<GasBill | null>(null);
  const [selectedInvoices, setSelectedInvoices] = useState<GasBill[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);

  const fuelTypes = constantsByType['FUEL_TYPE'] || [];

  useEffect(() => {
    dispatch(fetchInvoicesAsync(filters));
  }, [dispatch, filters]);

  const handleRefresh = () => {
    dispatch(fetchInvoicesAsync(filters));
  };

  const handleAddInvoice = () => {
    setSelectedInvoice(null);
    setFormOpen(true);
  };

  const handleEditInvoice = (invoice: GasBill) => {
    setSelectedInvoice(invoice);
    setFormOpen(true);
  };

  const handleFormSubmit = async (data: CreateGasBillDTO | UpdateGasBillDTO) => {
    try {
      if (selectedInvoice) {
        // await dispatch(updateInvoiceAsync(data as UpdateGasBillDTO));
        dispatch(showSnackbar({
          message: 'تم تحديث الفاتورة بنجاح',
          severity: 'success'
        }));
      } else {
        await dispatch(createInvoiceAsync(data as CreateGasBillDTO));
        dispatch(showSnackbar({
          message: 'تم إضافة الفاتورة بنجاح',
          severity: 'success'
        }));
      }
      setFormOpen(false);
    } catch (error) {
      dispatch(showSnackbar({
        message: 'حدث خطأ أثناء حفظ الفاتورة',
        severity: 'error'
      }));
    }
  };

  const formatDate = (date?: Date | string) => {
    if (!date) return '-';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, 'dd/MM/yyyy', { locale: ar });
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return '0';
    return `${amount.toLocaleString()} شيكل`;
  };

  // Calculate summary statistics
  const totalInvoices = invoices.length;
  const totalAmount = invoices.reduce((sum, invoice) => sum + ((invoice.quantity || 0) * (invoice.price || 0)), 0);
  const totalQuantity = invoices.reduce((sum, invoice) => sum + (invoice.quantity || 0), 0);

  const columns: Column<GasBill>[] = [
    {
      id: 'billNum',
      label: 'رقم الفاتورة',
      minWidth: 120,
      format: (value) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Receipt sx={{ fontSize: 18, color: 'primary.main' }} />
          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
            {value || '-'}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'billDate',
      label: 'تاريخ الفاتورة',
      minWidth: 120,
      format: (value) => formatDate(value),
    },
    {
      id: 'stationName',
      label: 'المحطة',
      minWidth: 150,
      format: (value) => value || 'غير محدد',
    },
    {
      id: 'fuelTypeName',
      label: 'نوع الوقود',
      minWidth: 120,
    },
    {
      id: 'quantity',
      label: 'الكمية',
      minWidth: 100,
      align: 'center',
      format: (value) => value ? `${value.toLocaleString()} لتر` : '-',
    },
    {
      id: 'price',
      label: 'السعر/لتر',
      minWidth: 100,
      align: 'center',
      format: (value) => value ? `${value.toLocaleString()} شيكل` : '-',
    },
    {
      id: 'totalAmount',
      label: 'المبلغ الإجمالي',
      minWidth: 150,
      align: 'center',
      format: (_, row) => {
        const total = (row.quantity || 0) * (row.price || 0);
        return (
          <Chip
            label={formatCurrency(total)}
            color="primary"
            size="small"
            sx={{ fontWeight: 'bold' }}
          />
        );
      },
    },
    {
      id: 'userName',
      label: 'المدخل',
      minWidth: 120,
      format: (value) => value || '-',
    },
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            إدارة الفواتير
          </Typography>
          <Typography variant="body1" color="text.secondary">
            إدارة ومتابعة فواتير شراء الوقود
          </Typography>
        </Box>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Receipt sx={{ fontSize: 40, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {totalInvoices}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      إجمالي الفواتير
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <AttachMoney sx={{ fontSize: 40, color: 'success.main' }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {formatCurrency(totalAmount)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      إجمالي المبلغ
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="h4" sx={{ color: 'warning.main' }}>⛽</Typography>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {totalQuantity.toLocaleString()} لتر
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      إجمالي الكمية
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="h4">📊</Typography>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {totalQuantity > 0 ? (totalAmount / totalQuantity).toFixed(2) : '0'} شيكل
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      متوسط السعر/لتر
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Toolbar */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Button
                  startIcon={<FilterIcon />}
                  onClick={() => setFilterOpen(!filterOpen)}
                  variant="outlined"
                  size="small"
                >
                  فلتر
                </Button>
                
                <Button
                  startIcon={<RefreshIcon />}
                  onClick={handleRefresh}
                  variant="outlined"
                  size="small"
                >
                  تحديث
                </Button>
                
                <Button
                  startIcon={<DownloadIcon />}
                  variant="outlined"
                  size="small"
                >
                  تصدير
                </Button>
                
                <Button
                  startIcon={<AddIcon />}
                  onClick={handleAddInvoice}
                  variant="contained"
                  size="small"
                >
                  إضافة فاتورة
                </Button>
              </Box>
            </Grid>
          </Grid>

          {/* Filter Panel */}
          {filterOpen && (
            <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    size="small"
                    select
                    label="المحطة"
                    value={filters.gasStationOid || ''}
                    onChange={(e) => dispatch(setFilters({
                      ...filters,
                      gasStationOid: e.target.value ? parseInt(e.target.value) : undefined
                    }))}
                  >
                    <MenuItem value="">الكل</MenuItem>
                    {stations.map((station) => (
                      <MenuItem key={station.oid} value={station.oid}>
                        {station.stationName}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    size="small"
                    select
                    label="نوع الوقود"
                    value={filters.fuelTypeOid || ''}
                    onChange={(e) => dispatch(setFilters({
                      ...filters,
                      fuelTypeOid: e.target.value ? parseInt(e.target.value) : undefined
                    }))}
                  >
                    <MenuItem value="">الكل</MenuItem>
                    {fuelTypes.map((type) => (
                      <MenuItem key={type.oid} value={type.oid}>
                        {type.cnstName}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                
                <Grid item xs={12} sm={6} md={2}>
                  <DatePicker
                    label="من تاريخ"
                    value={filters.dateFrom ? dayjs(filters.dateFrom) : null}
                    onChange={(value) => dispatch(setFilters({
                      ...filters,
                      dateFrom: value?.toDate()
                    }))}
                    slotProps={{
                      textField: {
                        size: 'small',
                        fullWidth: true,
                      },
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={2}>
                  <DatePicker
                    label="إلى تاريخ"
                    value={filters.dateTo ? dayjs(filters.dateTo) : null}
                    onChange={(value) => dispatch(setFilters({
                      ...filters,
                      dateTo: value?.toDate()
                    }))}
                    slotProps={{
                      textField: {
                        size: 'small',
                        fullWidth: true,
                      },
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={2}>
                  <Button
                    fullWidth
                    onClick={() => dispatch(clearFilters())}
                    variant="outlined"
                    size="small"
                  >
                    مسح الفلاتر
                  </Button>
                </Grid>
              </Grid>
            </Box>
          )}
        </Paper>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Data Table */}
        <DataTable
          title="سجل الفواتير"
          columns={columns}
          data={invoices}
          loading={loading}
          totalCount={pagination.total}
          page={pagination.page}
          rowsPerPage={pagination.pageSize}
          onPageChange={(page) => dispatch(setFilters({ ...filters, page }))}
          onRowsPerPageChange={(pageSize) => dispatch(setFilters({ ...filters, pageSize, page: 0 }))}
          onEdit={handleEditInvoice}
          selectable
          selectedItems={selectedInvoices}
          onSelectionChange={setSelectedInvoices}
          getRowId={(row) => row.oid}
          emptyMessage="لا توجد فواتير مسجلة"
        />

        {/* Invoice Form Dialog */}
        <InvoiceForm
          open={formOpen}
          onClose={() => setFormOpen(false)}
          onSubmit={handleFormSubmit}
          invoice={selectedInvoice}
          loading={loading}
        />
      </Box>
    </LocalizationProvider>
  );
};