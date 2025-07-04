import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  MenuItem,
  Box,
  Typography,
  Divider,
  Alert,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Vehicle, CreateVehicleDTO, UpdateVehicleDTO } from '../../types';

const vehicleSchema = yup.object({
  vehicleNum: yup.string().required('رقم المركبة مطلوب'),
  model: yup.string().required('الموديل مطلوب'),
  modelYear: yup
    .number()
    .min(1980, 'السنة غير صحيحة')
    .max(new Date().getFullYear() + 1, 'السنة غير صحيحة')
    .nullable(),
  plateNum: yup.string(),
  vinNum: yup.string(),
  fuelTypeOid: yup.number().nullable(),
  engineCapacity: yup.number().positive('يجب أن تكون قيمة موجبة').nullable(),
  tankCapacity: yup.number().positive('يجب أن تكون قيمة موجبة').nullable(),
  odometer: yup.number().min(0, 'يجب أن تكون قيمة موجبة أو صفر').nullable(),
  statusOid: yup.number().nullable(),
  assignedTo: yup.number().nullable(),
});

interface VehicleFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateVehicleDTO | UpdateVehicleDTO) => Promise<void>;
  vehicle?: Vehicle | null;
  loading?: boolean;
}

export const VehicleForm: React.FC<VehicleFormProps> = ({
  open,
  onClose,
  onSubmit,
  vehicle,
  loading = false,
}) => {
  const { constantsByType } = useSelector((state: RootState) => state.constants);
  
  const fuelTypes = constantsByType['FUEL_TYPE'] || [];
  const vehicleStatuses = constantsByType['VEHICLE_STATUS'] || [];
  const assignedToOptions = constantsByType['ASSIGNED_TO'] || [];

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<CreateVehicleDTO>({
    resolver: yupResolver(vehicleSchema),
    defaultValues: {
      vehicleNum: '',
      model: '',
      modelYear: null,
      plateNum: '',
      vinNum: '',
      fuelTypeOid: null,
      engineCapacity: null,
      tankCapacity: null,
      odometer: null,
      statusOid: null,
      assignedTo: null,
    },
  });

  useEffect(() => {
    if (vehicle) {
      reset({
        vehicleNum: vehicle.vehicleNum || '',
        model: vehicle.model || '',
        modelYear: vehicle.modelYear || null,
        plateNum: vehicle.plateNum || '',
        vinNum: vehicle.vinNum || '',
        fuelTypeOid: vehicle.fuelTypeOid || null,
        engineCapacity: vehicle.engineCapacity || null,
        tankCapacity: vehicle.tankCapacity || null,
        odometer: vehicle.odometer || null,
        statusOid: vehicle.statusOid || null,
        assignedTo: vehicle.assignedTo || null,
      });
    } else {
      reset({
        vehicleNum: '',
        model: '',
        modelYear: null,
        plateNum: '',
        vinNum: '',
        fuelTypeOid: null,
        engineCapacity: null,
        tankCapacity: null,
        odometer: null,
        statusOid: null,
        assignedTo: null,
      });
    }
  }, [vehicle, reset]);

  const handleFormSubmit = async (data: CreateVehicleDTO) => {
    try {
      if (vehicle) {
        await onSubmit({ ...data, oid: vehicle.oid } as UpdateVehicleDTO);
      } else {
        await onSubmit(data);
      }
      onClose();
    } catch (error) {
      console.error('Error submitting vehicle form:', error);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: 600 },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          {vehicle ? 'تعديل المركبة' : 'إضافة مركبة جديدة'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {vehicle ? 'تعديل بيانات المركبة الموجودة' : 'إدخال بيانات المركبة الجديدة'}
        </Typography>
      </DialogTitle>
      
      <Divider />
      
      <DialogContent sx={{ pt: 3 }}>
        <Box component="form" onSubmit={handleSubmit(handleFormSubmit)}>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                المعلومات الأساسية
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Controller
                name="vehicleNum"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="رقم المركبة *"
                    error={!!errors.vehicleNum}
                    helperText={errors.vehicleNum?.message}
                    disabled={loading}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Controller
                name="model"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="الموديل *"
                    error={!!errors.model}
                    helperText={errors.model?.message}
                    disabled={loading}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Controller
                name="modelYear"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="سنة الصنع"
                    type="number"
                    error={!!errors.modelYear}
                    helperText={errors.modelYear?.message}
                    disabled={loading}
                    value={field.value || ''}
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Controller
                name="plateNum"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="رقم اللوحة"
                    disabled={loading}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Controller
                name="vinNum"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="رقم الشاسيه"
                    disabled={loading}
                  />
                )}
              />
            </Grid>
            
            {/* Technical Information */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                المعلومات التقنية
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Controller
                name="fuelTypeOid"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    select
                    label="نوع الوقود"
                    disabled={loading}
                    value={field.value || ''}
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                  >
                    <MenuItem value="">اختر نوع الوقود</MenuItem>
                    {fuelTypes.map((type) => (
                      <MenuItem key={type.oid} value={type.oid}>
                        {type.cnstName}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Controller
                name="engineCapacity"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="سعة المحرك (CC)"
                    type="number"
                    error={!!errors.engineCapacity}
                    helperText={errors.engineCapacity?.message}
                    disabled={loading}
                    value={field.value || ''}
                    onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Controller
                name="tankCapacity"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="سعة الخزان (لتر)"
                    type="number"
                    error={!!errors.tankCapacity}
                    helperText={errors.tankCapacity?.message}
                    disabled={loading}
                    value={field.value || ''}
                    onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Controller
                name="odometer"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="عداد المسافة (كم)"
                    type="number"
                    error={!!errors.odometer}
                    helperText={errors.odometer?.message}
                    disabled={loading}
                    value={field.value || ''}
                    onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                  />
                )}
              />
            </Grid>
            
            {/* Assignment Information */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                معلومات التخصيص
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Controller
                name="statusOid"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    select
                    label="حالة المركبة"
                    disabled={loading}
                    value={field.value || ''}
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                  >
                    <MenuItem value="">اختر الحالة</MenuItem>
                    {vehicleStatuses.map((status) => (
                      <MenuItem key={status.oid} value={status.oid}>
                        {status.cnstName}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Controller
                name="assignedTo"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    select
                    label="مخصصة لـ"
                    disabled={loading}
                    value={field.value || ''}
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                  >
                    <MenuItem value="">اختر الجهة</MenuItem>
                    {assignedToOptions.map((option) => (
                      <MenuItem key={option.oid} value={option.oid}>
                        {option.cnstName}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      
      <Divider />
      
      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={handleClose}
          disabled={loading}
          color="inherit"
        >
          إلغاء
        </Button>
        <Button
          onClick={handleSubmit(handleFormSubmit)}
          variant="contained"
          disabled={loading || !isDirty}
          sx={{ minWidth: 120 }}
        >
          {loading ? 'جاري الحفظ...' : vehicle ? 'تحديث' : 'حفظ'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};