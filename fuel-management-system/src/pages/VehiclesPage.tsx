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
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  DirectionsCar,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { RootState, AppDispatch } from '../store';
import { DataTable, Column } from '../components/tables/DataTable';
import { VehicleForm } from '../components/forms/VehicleForm';
import { Vehicle, CreateVehicleDTO, UpdateVehicleDTO } from '../types';
import {
  fetchVehiclesAsync,
  createVehicleAsync,
  updateVehicleAsync,
  deleteVehicleAsync,
  setFilters,
  clearFilters,
} from '../store/slices/vehiclesSlice';
import { showSnackbar } from '../store/slices/uiSlice';

export const VehiclesPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { 
    vehicles, 
    loading, 
    error, 
    filters, 
    pagination 
  } = useSelector((state: RootState) => state.vehicles);
  const { constantsByType } = useSelector((state: RootState) => state.constants);

  const [formOpen, setFormOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);
  const [selectedVehicles, setSelectedVehicles] = useState<Vehicle[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);

  const fuelTypes = constantsByType['FUEL_TYPE'] || [];
  const vehicleStatuses = constantsByType['VEHICLE_STATUS'] || [];
  const assignedToOptions = constantsByType['ASSIGNED_TO'] || [];

  useEffect(() => {
    dispatch(fetchVehiclesAsync(filters));
  }, [dispatch, filters]);

  const handleSearch = () => {
    dispatch(setFilters({ 
      ...filters, 
      vehicleNum: searchTerm,
      page: 0
    }));
  };

  const handleRefresh = () => {
    dispatch(fetchVehiclesAsync(filters));
  };

  const handleAddVehicle = () => {
    setSelectedVehicle(null);
    setFormOpen(true);
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setFormOpen(true);
  };

  const handleDeleteVehicle = (vehicle: Vehicle) => {
    setVehicleToDelete(vehicle);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (vehicleToDelete) {
      try {
        await dispatch(deleteVehicleAsync(vehicleToDelete.oid));
        dispatch(showSnackbar({
          message: 'تم حذف المركبة بنجاح',
          severity: 'success'
        }));
        setDeleteDialogOpen(false);
        setVehicleToDelete(null);
      } catch (error) {
        dispatch(showSnackbar({
          message: 'حدث خطأ أثناء حذف المركبة',
          severity: 'error'
        }));
      }
    }
  };

  const handleFormSubmit = async (data: CreateVehicleDTO | UpdateVehicleDTO) => {
    try {
      if (selectedVehicle) {
        await dispatch(updateVehicleAsync(data as UpdateVehicleDTO));
        dispatch(showSnackbar({
          message: 'تم تحديث بيانات المركبة بنجاح',
          severity: 'success'
        }));
      } else {
        await dispatch(createVehicleAsync(data as CreateVehicleDTO));
        dispatch(showSnackbar({
          message: 'تم إضافة المركبة بنجاح',
          severity: 'success'
        }));
      }
      setFormOpen(false);
    } catch (error) {
      dispatch(showSnackbar({
        message: 'حدث خطأ أثناء حفظ بيانات المركبة',
        severity: 'error'
      }));
    }
  };

  const getStatusChip = (statusName?: string) => {
    const color = statusName?.toLowerCase() === 'active' ? 'success' : 
                 statusName?.toLowerCase() === 'inactive' ? 'error' : 'default';
    return (
      <Chip
        label={statusName || 'غير محدد'}
        color={color}
        size="small"
        sx={{ fontWeight: 'medium' }}
      />
    );
  };

  const columns: Column<Vehicle>[] = [
    {
      id: 'vehicleNum',
      label: 'رقم المركبة',
      minWidth: 120,
      format: (value) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DirectionsCar sx={{ fontSize: 20, color: 'primary.main' }} />
          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
            {value}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'model',
      label: 'الموديل',
      minWidth: 150,
    },
    {
      id: 'modelYear',
      label: 'سنة الصنع',
      minWidth: 100,
      align: 'center',
    },
    {
      id: 'plateNum',
      label: 'رقم اللوحة',
      minWidth: 120,
    },
    {
      id: 'fuelTypeName',
      label: 'نوع الوقود',
      minWidth: 120,
    },
    {
      id: 'assignedToName',
      label: 'مخصصة لـ',
      minWidth: 150,
    },
    {
      id: 'statusName',
      label: 'الحالة',
      minWidth: 100,
      format: (value) => getStatusChip(value),
    },
    {
      id: 'odometer',
      label: 'عداد المسافة',
      minWidth: 120,
      align: 'center',
      format: (value) => value ? `${value.toLocaleString()} كم` : '-',
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          إدارة المركبات
        </Typography>
        <Typography variant="body1" color="text.secondary">
          إدارة وتتبع جميع مركبات البلدية
        </Typography>
      </Box>

      {/* Toolbar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="البحث برقم المركبة أو الموديل..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button
                startIcon={<SearchIcon />}
                onClick={handleSearch}
                variant="outlined"
                size="small"
              >
                بحث
              </Button>
              
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
                onClick={handleAddVehicle}
                variant="contained"
                size="small"
              >
                إضافة مركبة
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
              
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  select
                  label="الحالة"
                  value={filters.statusOid || ''}
                  onChange={(e) => dispatch(setFilters({
                    ...filters,
                    statusOid: e.target.value ? parseInt(e.target.value) : undefined
                  }))}
                >
                  <MenuItem value="">الكل</MenuItem>
                  {vehicleStatuses.map((status) => (
                    <MenuItem key={status.oid} value={status.oid}>
                      {status.cnstName}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  select
                  label="مخصصة لـ"
                  value={filters.assignedTo || ''}
                  onChange={(e) => dispatch(setFilters({
                    ...filters,
                    assignedTo: e.target.value ? parseInt(e.target.value) : undefined
                  }))}
                >
                  <MenuItem value="">الكل</MenuItem>
                  {assignedToOptions.map((option) => (
                    <MenuItem key={option.oid} value={option.oid}>
                      {option.cnstName}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
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
        title="قائمة المركبات"
        columns={columns}
        data={vehicles}
        loading={loading}
        totalCount={pagination.total}
        page={pagination.page}
        rowsPerPage={pagination.pageSize}
        onPageChange={(page) => dispatch(setFilters({ ...filters, page }))}
        onRowsPerPageChange={(pageSize) => dispatch(setFilters({ ...filters, pageSize, page: 0 }))}
        onEdit={handleEditVehicle}
        onDelete={handleDeleteVehicle}
        selectable
        selectedItems={selectedVehicles}
        onSelectionChange={setSelectedVehicles}
        getRowId={(row) => row.oid}
        emptyMessage="لا توجد مركبات مسجلة"
      />

      {/* Vehicle Form Dialog */}
      <VehicleForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        vehicle={selectedVehicle}
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
            هل أنت متأكد من حذف المركبة "{vehicleToDelete?.vehicleNum}"؟
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
  );
};