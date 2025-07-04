import React, { useEffect, useState } from 'react';
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
  ToggleButton,
  ToggleButtonGroup,
  Autocomplete,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DirectionsCar, Power } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { FuelLog, CreateFuelLogDTO, UpdateFuelLogDTO } from '../../types';

const fuelLogSchema = yup.object({
  vehOid: yup.number().nullable(),
  generatorOid: yup.number().nullable(),
  fillUpDate: yup.date().required('تاريخ التعبئة مطلوب'),
  gallons: yup.number().positive('الكمية يجب أن تكون موجبة').required('الكمية مطلوبة'),
  odometer: yup.number().min(0, 'قراءة العداد يجب أن تكون موجبة أو صفر').nullable(),
  stationOid: yup.number().nullable(),
  fuelId: yup.number().nullable(),
  statusOid: yup.number().nullable(),
  note: yup.string(),
}).test('vehicle-or-generator', 'يجب اختيار مركبة أو مولد', function(value) {
  return !!(value.vehOid || value.generatorOid);
});

interface FuelLogFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateFuelLogDTO | UpdateFuelLogDTO) => Promise<void>;
  fuelLog?: FuelLog | null;
  loading?: boolean;
}

export const FuelLogForm: React.FC<FuelLogFormProps> = ({
  open,
  onClose,
  onSubmit,
  fuelLog,
  loading = false,
}) => {
  const { vehicles } = useSelector((state: RootState) => state.vehicles);
  const { generators } = useSelector((state: RootState) => state.generators);
  const { stations } = useSelector((state: RootState) => state.stations);
  const { constantsByType } = useSelector((state: RootState) => state.constants);

  const [entityType, setEntityType] = useState<'vehicle' | 'generator'>('vehicle');

  const fuelTypes = constantsByType['FUEL_TYPE'] || [];
  const logStatuses = constantsByType['LOG_STATUS'] || [];

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<CreateFuelLogDTO>({
    resolver: yupResolver(fuelLogSchema),
    defaultValues: {
      vehOid: null,
      generatorOid: null,
      fillUpDate: new Date(),
      gallons: null,
      odometer: null,
      stationOid: null,
      fuelId: null,
      statusOid: null,
      note: '',
    },
  });

  const watchedVehOid = watch('vehOid');
  const watchedGeneratorOid = watch('generatorOid');

  useEffect(() => {
    if (fuelLog) {
      setEntityType(fuelLog.vehOid ? 'vehicle' : 'generator');
      reset({
        vehOid: fuelLog.vehOid || null,
        generatorOid: fuelLog.generatorOid || null,
        fillUpDate: fuelLog.fillUpDate ? new Date(fuelLog.fillUpDate) : new Date(),
        gallons: fuelLog.gallons || null,
        odometer: fuelLog.odometer || null,
        stationOid: fuelLog.stationOid || null,
        fuelId: fuelLog.fuelId || null,
        statusOid: fuelLog.statusOid || null,
        note: fuelLog.note || '',
      });
    } else {
      reset({
        vehOid: null,
        generatorOid: null,
        fillUpDate: new Date(),
        gallons: null,
        odometer: null,
        stationOid: null,
        fuelId: null,
        statusOid: null,
        note: '',
      });
    }
  }, [fuelLog, reset]);

  useEffect(() => {
    if (entityType === 'vehicle') {
      setValue('generatorOid', null);
    } else {
      setValue('vehOid', null);
      setValue('odometer', null); // Generators don't have odometer
    }
  }, [entityType, setValue]);

  const handleFormSubmit = async (data: CreateFuelLogDTO) => {
    try {
      if (fuelLog) {
        await onSubmit({ ...data, oid: fuelLog.oid } as UpdateFuelLogDTO);
      } else {
        await onSubmit(data);
      }
      onClose();
    } catch (error) {
      console.error('Error submitting fuel log form:', error);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  const selectedVehicle = vehicles.find(v => v.oid === watchedVehOid);
  const selectedGenerator = generators.find(g => g.oid === watchedGeneratorOid);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
            {fuelLog ? 'تعديل حركة الوقود' : 'إضافة حركة وقود جديدة'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {fuelLog ? 'تعديل بيانات حركة الوقود' : 'تسجيل حركة وقود جديدة'}
          </Typography>
        </DialogTitle>
        
        <Divider />
        
        <DialogContent sx={{ pt: 3 }}>
          <Box component="form" onSubmit={handleSubmit(handleFormSubmit)}>
            <Grid container spacing={3}>
              {/* Entity Type Selection */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                  نوع الكيان
                </Typography>
                <ToggleButtonGroup
                  value={entityType}
                  exclusive
                  onChange={(_, newType) => newType && setEntityType(newType)}
                  sx={{ mb: 2 }}
                  disabled={loading}
                >
                  <ToggleButton value="vehicle">
                    <DirectionsCar sx={{ mr: 1 }} />
                    مركبة
                  </ToggleButton>
                  <ToggleButton value="generator">
                    <Power sx={{ mr: 1 }} />
                    مولد
                  </ToggleButton>
                </ToggleButtonGroup>
              </Grid>

              {/* Entity Selection */}
              {entityType === 'vehicle' ? (
                <Grid item xs={12}>
                  <Controller
                    name="vehOid"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        options={vehicles}
                        getOptionLabel={(option) => `${option.vehicleNum} - ${option.model}`}
                        onChange={(_, value) => field.onChange(value?.oid || null)}
                        value={vehicles.find(v => v.oid === field.value) || null}
                        disabled={loading}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="المركبة *"
                            error={!!errors.vehOid}
                            helperText={errors.vehOid?.message}
                          />
                        )}
                      />
                    )}
                  />
                  {selectedVehicle && (
                    <Box sx={{ mt: 1, p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        نوع الوقود: {selectedVehicle.fuelTypeName} | 
                        سعة الخزان: {selectedVehicle.tankCapacity} لتر |
                        آخر قراءة عداد: {selectedVehicle.odometer} كم
                      </Typography>
                    </Box>
                  )}
                </Grid>
              ) : (
                <Grid item xs={12}>
                  <Controller
                    name="generatorOid"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        options={generators}
                        getOptionLabel={(option) => option.name}
                        onChange={(_, value) => field.onChange(value?.oid || null)}
                        value={generators.find(g => g.oid === field.value) || null}
                        disabled={loading}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="المولد *"
                            error={!!errors.generatorOid}
                            helperText={errors.generatorOid?.message}
                          />
                        )}
                      />
                    )}
                  />
                  {selectedGenerator && (
                    <Box sx={{ mt: 1, p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        نوع الوقود: {selectedGenerator.fuelTypeName} | 
                        القدرة: {selectedGenerator.engineCapacity} كيلو واط
                      </Typography>
                    </Box>
                  )}
                </Grid>
              )}

              {/* Movement Details */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                  تفاصيل الحركة
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="fillUpDate"
                  control={control}
                  render={({ field }) => (
                    <DateTimePicker
                      {...field}
                      label="تاريخ ووقت التعبئة *"
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(value) => field.onChange(value?.toDate() || null)}
                      disabled={loading}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.fillUpDate,
                          helperText: errors.fillUpDate?.message,
                        },
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="gallons"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="الكمية (لتر) *"
                      type="number"
                      error={!!errors.gallons}
                      helperText={errors.gallons?.message}
                      disabled={loading}
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                    />
                  )}
                />
              </Grid>

              {entityType === 'vehicle' && (
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="odometer"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="قراءة العداد (كم)"
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
              )}

              <Grid item xs={12} sm={6}>
                <Controller
                  name="stationOid"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      select
                      label="المحطة"
                      disabled={loading}
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                    >
                      <MenuItem value="">اختر المحطة</MenuItem>
                      {stations.map((station) => (
                        <MenuItem key={station.oid} value={station.oid}>
                          {station.stationName}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="fuelId"
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
                  name="statusOid"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      select
                      label="حالة الحركة"
                      disabled={loading}
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                    >
                      <MenuItem value="">اختر الحالة</MenuItem>
                      {logStatuses.map((status) => (
                        <MenuItem key={status.oid} value={status.oid}>
                          {status.cnstName}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="note"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="ملاحظات"
                      multiline
                      rows={3}
                      disabled={loading}
                    />
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
            {loading ? 'جاري الحفظ...' : fuelLog ? 'تحديث' : 'حفظ'}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};