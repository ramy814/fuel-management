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
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Generator, CreateGeneratorDTO, UpdateGeneratorDTO } from '../../types';

const generatorSchema = yup.object({
  name: yup.string().required('اسم المولد مطلوب'),
  assignedTo: yup.number().nullable(),
  fuelTypeOid: yup.number().nullable(),
  engineCapacity: yup.number().positive('يجب أن تكون قيمة موجبة').nullable(),
  vehicleNum: yup.string(),
});

interface GeneratorFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateGeneratorDTO | UpdateGeneratorDTO) => Promise<void>;
  generator?: Generator | null;
  loading?: boolean;
}

export const GeneratorForm: React.FC<GeneratorFormProps> = ({
  open,
  onClose,
  onSubmit,
  generator,
  loading = false,
}) => {
  const { constantsByType } = useSelector((state: RootState) => state.constants);
  
  const fuelTypes = constantsByType['FUEL_TYPE'] || [];
  const assignedToOptions = constantsByType['ASSIGNED_TO'] || [];

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<CreateGeneratorDTO>({
    resolver: yupResolver(generatorSchema),
    defaultValues: {
      name: '',
      assignedTo: null,
      fuelTypeOid: null,
      engineCapacity: null,
      vehicleNum: '',
    },
  });

  useEffect(() => {
    if (generator) {
      reset({
        name: generator.name || '',
        assignedTo: generator.assignedTo || null,
        fuelTypeOid: generator.fuelTypeOid || null,
        engineCapacity: generator.engineCapacity || null,
        vehicleNum: generator.vehicleNum || '',
      });
    } else {
      reset({
        name: '',
        assignedTo: null,
        fuelTypeOid: null,
        engineCapacity: null,
        vehicleNum: '',
      });
    }
  }, [generator, reset]);

  const handleFormSubmit = async (data: CreateGeneratorDTO) => {
    try {
      if (generator) {
        await onSubmit({ ...data, oid: generator.oid } as UpdateGeneratorDTO);
      } else {
        await onSubmit(data);
      }
      onClose();
    } catch (error) {
      console.error('Error submitting generator form:', error);
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
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { minHeight: 400 },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          {generator ? 'تعديل المولد' : 'إضافة مولد جديد'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {generator ? 'تعديل بيانات المولد الموجود' : 'إدخال بيانات المولد الجديد'}
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
            
            <Grid item xs={12}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="اسم المولد *"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    disabled={loading}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Controller
                name="vehicleNum"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="رقم المركبة المرتبطة"
                    disabled={loading}
                    helperText="اختياري - إذا كان المولد مثبت على مركبة"
                  />
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
                    label="القدرة (كيلو واط)"
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
            
            {/* Assignment Information */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                معلومات التخصيص
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
                name="assignedTo"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    select
                    label="مخصص لـ"
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
          {loading ? 'جاري الحفظ...' : generator ? 'تحديث' : 'حفظ'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};