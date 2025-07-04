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
  Avatar,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  LocalGasStation,
  DirectionsCar,
  Power,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { RootState, AppDispatch } from '../store';
import { DataTable, Column } from '../components/tables/DataTable';
import { FuelLogForm } from '../components/forms/FuelLogForm';
import { FuelLog, CreateFuelLogDTO, UpdateFuelLogDTO } from '../types';
import {
  fetchFuelLogsAsync,
  createFuelLogAsync,
  updateFuelLogAsync,
  deleteFuelLogAsync,
  setFilters,
  clearFilters,
} from '../store/slices/fuelLogsSlice';
import { showSnackbar } from '../store/slices/uiSlice';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

export const FuelLogsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { 
    fuelLogs, 
    loading, 
    error, 
    filters, 
    pagination 
  } = useSelector((state: RootState) => state.fuelLogs);
  const { vehicles } = useSelector((state: RootState) => state.vehicles);
  const { generators } = useSelector((state: RootState) => state.generators);
  const { stations } = useSelector((state: RootState) => state.stations);
  const { constantsByType } = useSelector((state: RootState) => state.constants);

  const [formOpen, setFormOpen] = useState(false);
  const [selectedFuelLog, setSelectedFuelLog] = useState<FuelLog | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fuelLogToDelete, setFuelLogToDelete] = useState<FuelLog | null>(null);
  const [selectedFuelLogs, setSelectedFuelLogs] = useState<FuelLog[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);

  const fuelTypes = constantsByType['FUEL_TYPE'] || [];
  const logStatuses = constantsByType['LOG_STATUS'] || [];

  useEffect(() => {
    dispatch(fetchFuelLogsAsync(filters));
  }, [dispatch, filters]);

  const handleRefresh = () => {
    dispatch(fetchFuelLogsAsync(filters));
  };

  const handleAddFuelLog = () => {
    setSelectedFuelLog(null);
    setFormOpen(true);
  };

  const handleEditFuelLog = (fuelLog: FuelLog) => {
    setSelectedFuelLog(fuelLog);
    setFormOpen(true);
  };

  const handleDeleteFuelLog = (fuelLog: FuelLog) => {
    setFuelLogToDelete(fuelLog);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (fuelLogToDelete) {
      try {
        await dispatch(deleteFuelLogAsync(fuelLogToDelete.oid));
        dispatch(showSnackbar({
          message: 'تم حذف حركة الوقود بنجاح',
          severity: 'success'
        }));
        setDeleteDialogOpen(false);
        setFuelLogToDelete(null);
      } catch (error) {
        dispatch(showSnackbar({
          message: 'حدث خطأ أثناء حذف حركة الوقود',
          severity: 'error'
        }));
      }
    }
  };

  const handleFormSubmit = async (data: CreateFuelLogDTO | UpdateFuelLogDTO) => {
    try {
      if (selectedFuelLog) {
        await dispatch(updateFuelLogAsync(data as UpdateFuelLogDTO));
        dispatch(showSnackbar({
          message: 'تم تحديث حركة الوقود بنجاح',
          severity: 'success'
        }));
      } else {
        await dispatch(createFuelLogAsync(data as CreateFuelLogDTO));
        dispatch(showSnackbar({
          message: 'تم إضافة حركة الوقود بنجاح',
          severity: 'success'
        }));
      }
      setFormOpen(false);
    } catch (error) {
      dispatch(showSnackbar({
        message: 'حدث خطأ أثناء حفظ حركة الوقود',
        severity: 'error'
      }));
    }
  };

  const getStatusChip = (statusName?: string) => {
    const color = statusName?.toLowerCase() === 'completed' ? 'success' : 
                 statusName?.toLowerCase() === 'pending' ? 'warning' : 
                 statusName?.toLowerCase() === 'cancelled' ? 'error' : 'default';
    return (
      <Chip
        label={statusName || 'غير محدد'}
        color={color}
        size="small"
        sx={{ fontWeight: 'medium' }}
      />
    );
  };

  const formatDate = (date?: Date | string) => {
    if (!date) return '-';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, 'dd/MM/yyyy HH:mm', { locale: ar });
  };

  const columns: Column<FuelLog>[] = [
    {
      id: 'fillUpDate',
      label: 'التاريخ والوقت',
      minWidth: 150,
      format: (value) => formatDate(value),
    },
    {
      id: 'vehicleNum',
      label: 'المركبة/المولد',
      minWidth: 150,
      format: (value, row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: row.vehOid ? 'primary.main' : 'secondary.main',
            }}
          >
            {row.vehOid ? (
              <DirectionsCar sx={{ fontSize: 18 }} />
            ) : (
              <Power sx={{ fontSize: 18 }} />
            )}
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              {row.vehicleNum || row.generatorName || '-'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {row.vehOid ? 'مركبة' : 'مولد'}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      id: 'gallons',
      label: 'الكمية',
      minWidth: 100,
      align: 'center',
      format: (value) => value ? `${value.toLocaleString()} لتر` : '-',
    },
    {
      id: 'fuelTypeName',
      label: 'نوع الوقود',
      minWidth: 120,
    },
    {
      id: 'stationName',
      label: 'المحطة',
      minWidth: 150,
      format: (value) => value || '-',
    },
    {
      id: 'odometer',
      label: 'قراءة العداد',
      minWidth: 120,
      align: 'center',
      format: (value) => value ? `${value.toLocaleString()} كم` : '-',
    },
    {
      id: 'statusName',
      label: 'الحالة',
      minWidth: 100,
      format: (value) => getStatusChip(value),
    },
    {
      id: 'userName',
      label: 'المستخدم',
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
            حركات الوقود
          </Typography>
          <Typography variant="body1" color="text.secondary">
            تتبع وإدارة جميع حركات الوقود للمركبات والمولدات
          </Typography>
        </Box>

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
                  onClick={handleAddFuelLog}
                  variant="contained"
                  size="small"
                >
                  إضافة حركة
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
                    label="المركبة"
                    value={filters.vehOid || ''}
                    onChange={(e) => dispatch(setFilters({
                      ...filters,
                      vehOid: e.target.value ? parseInt(e.target.value) : undefined
                    }))}
                  >
                    <MenuItem value="">الكل</MenuItem>
                    {vehicles.map((vehicle) => (
                      <MenuItem key={vehicle.oid} value={vehicle.oid}>
                        {vehicle.vehicleNum} - {vehicle.model}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    size="small"
                    select
                    label="المولد"
                    value={filters.generatorOid || ''}
                    onChange={(e) => dispatch(setFilters({
                      ...filters,
                      generatorOid: e.target.value ? parseInt(e.target.value) : undefined
                    }))}
                  >
                    <MenuItem value="">الكل</MenuItem>
                    {generators.map((generator) => (
                      <MenuItem key={generator.oid} value={generator.oid}>
                        {generator.name}
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
          title="سجل حركات الوقود"
          columns={columns}
          data={fuelLogs}
          loading={loading}
          totalCount={pagination.total}
          page={pagination.page}
          rowsPerPage={pagination.pageSize}
          onPageChange={(page) => dispatch(setFilters({ ...filters, page }))}
          onRowsPerPageChange={(pageSize) => dispatch(setFilters({ ...filters, pageSize, page: 0 }))}
          onEdit={handleEditFuelLog}
          onDelete={handleDeleteFuelLog}
          selectable
          selectedItems={selectedFuelLogs}
          onSelectionChange={setSelectedFuelLogs}
          getRowId={(row) => row.oid}
          emptyMessage="لا توجد حركات وقود مسجلة"
        />

        {/* Fuel Log Form Dialog */}
        <FuelLogForm
          open={formOpen}
          onClose={() => setFormOpen(false)}
          onSubmit={handleFormSubmit}
          fuelLog={selectedFuelLog}
          loading={loading}
        />

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>تأكيد الحذف</DialogTitle>
          <DialogContent>
            <DialogContentText>
              هل أنت متأكد من حذف هذه الحركة؟
              هذا الإجراء لا يمكن التراجع عنه.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={confirmDelete} color="error" variant="contained">
              حذف
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};