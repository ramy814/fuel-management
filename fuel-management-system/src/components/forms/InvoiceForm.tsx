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
  Card,
  CardContent,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { GasBill, CreateGasBillDTO, UpdateGasBillDTO } from '../../types';

const invoiceSchema = yup.object({
  gasStationOid: yup.number().nullable(),
  billNum: yup.number().positive('رقم الفاتورة يجب أن يكون موجب').required('رقم الفاتورة مطلوب'),
  billDate: yup.date().required('تاريخ الفاتورة مطلوب'),
  fuelTypeOid: yup.number().required('نوع الوقود مطلوب'),
  quantity: yup.number().positive('الكمية يجب أن تكون موجبة').required('الكمية مطلوبة'),
  price: yup.number().positive('السعر يجب أن يكون موجب').required('السعر مطلوب'),
  note: yup.string(),
});

interface InvoiceFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateGasBillDTO | UpdateGasBillDTO) => Promise<void>;
  invoice?: GasBill | null;
  loading?: boolean;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({
  open,
  onClose,
  onSubmit,
  invoice,
  loading = false,
}) => {
  const { stations } = useSelector((state: RootState) => state.stations);
  const { constantsByType } = useSelector((state: RootState) => state.constants);

  const fuelTypes = constantsByType['FUEL_TYPE'] || [];

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<CreateGasBillDTO>({
    resolver: yupResolver(invoiceSchema),
    defaultValues: {
      gasStationOid: null,
      billNum: null,
      billDate: new Date(),
      fuelTypeOid: null,
      quantity: null,
      price: null,
      note: '',
    },
  });

  const watchedQuantity = watch('quantity');
  const watchedPrice = watch('price');
  const totalAmount = (watchedQuantity || 0) * (watchedPrice || 0);

  useEffect(() => {
    if (invoice) {
      reset({
        gasStationOid: invoice.gasStationOid || null,
        billNum: invoice.billNum || null,
        billDate: invoice.billDate ? new Date(invoice.billDate) : new Date(),
        fuelTypeOid: invoice.fuelTypeOid || null,
        quantity: invoice.quantity || null,
        price: invoice.price || null,
        note: invoice.note || '',
      });
    } else {
      reset({
        gasStationOid: null,
        billNum: null,
        billDate: new Date(),
        fuelTypeOid: null,
        quantity: null,
        price: null,
        note: '',
      });
    }
  }, [invoice, reset]);

  const handleFormSubmit = async (data: CreateGasBillDTO) => {
    try {
      if (invoice) {
        await onSubmit({ ...data, oid: invoice.oid } as UpdateGasBillDTO);
      } else {
        await onSubmit(data);
      }
      onClose();
    } catch (error) {
      console.error('Error submitting invoice form:', error);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { minHeight: 500 },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            {invoice ? 'تعديل الفاتورة' : 'إضافة فاتورة جديدة'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {invoice ? 'تعديل بيانات الفاتورة' : 'إدخال بيانات فاتورة جديدة'}
          </Typography>
        </DialogTitle>
        
        <Divider />
        
        <DialogContent sx={{ pt: 3 }}>
          <Box component="form" onSubmit={handleSubmit(handleFormSubmit)}>
            <Grid container spacing={3}>
              {/* Invoice Information */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                  معلومات الفاتورة
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Controller
                  name="billNum"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="رقم الفاتورة *"
                      type="number"
                      error={!!errors.billNum}
                      helperText={errors.billNum?.message}
                      disabled={loading}
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Controller
                  name="billDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      label="تاريخ الفاتورة *"
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(value) => field.onChange(value?.toDate() || null)}
                      disabled={loading}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.billDate,
                          helperText: errors.billDate?.message,
                        },
                      }}
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Controller
                  name="gasStationOid"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      select
                      label="محطة الوقود"
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
                  name="fuelTypeOid"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      select
                      label="نوع الوقود *"
                      error={!!errors.fuelTypeOid}
                      helperText={errors.fuelTypeOid?.message}
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
              
              {/* Quantity and Price */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                  الكمية والسعر
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <Controller
                  name="quantity"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="الكمية (لتر) *"
                      type="number"
                      error={!!errors.quantity}
                      helperText={errors.quantity?.message}
                      disabled={loading}
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <Controller
                  name="price"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="السعر للتر الواحد *"
                      type="number"
                      error={!!errors.price}
                      helperText={errors.price?.message}
                      disabled={loading}
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                      InputProps={{
                        endAdornment: 'شيكل',
                      }}
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      المبلغ الإجمالي
                    </Typography>
                    <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
                      {totalAmount.toLocaleString()} شيكل
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              {/* Notes */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
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
            {loading ? 'جاري الحفظ...' : invoice ? 'تحديث' : 'حفظ'}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};