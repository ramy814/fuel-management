import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  Alert,
  Button,
  LinearProgress,
  Chip,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Warning as WarningIcon,
  TrendingUp,
  TrendingDown,
  LocalGasStation,
  Inventory as InventoryIcon,
} from '@mui/icons-material';
import { RootState, AppDispatch } from '../store';
import { InventoryGauge } from '../components/charts/InventoryGauge';
import { ConsumptionChart } from '../components/charts/ConsumptionChart';
import { fetchCurrentInventoryAsync, fetchInventoryHistoryAsync } from '../store/slices/inventorySlice';

export const InventoryPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentInventory, inventoryHistory, loading, error } = useSelector((state: RootState) => state.inventory);

  useEffect(() => {
    dispatch(fetchCurrentInventoryAsync());
    dispatch(fetchInventoryHistoryAsync());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchCurrentInventoryAsync());
    dispatch(fetchInventoryHistoryAsync());
  };

  // Mock data for demonstration (replace with real calculation)
  const getInventoryLevel = (current: number, capacity: number) => {
    const percentage = (current / capacity) * 100;
    if (percentage >= 70) return { level: 'high', color: 'success', text: 'مستوى جيد' };
    if (percentage >= 30) return { level: 'medium', color: 'warning', text: 'مستوى متوسط' };
    return { level: 'low', color: 'error', text: 'مستوى منخفض' };
  };

  const gasLevel = getInventoryLevel(currentInventory?.gasQuantity || 0, 80000);
  const solarLevel = getInventoryLevel(currentInventory?.solarQuantity || 0, 60000);
  const egyptSolarLevel = getInventoryLevel(currentInventory?.eygptSolarQuantity || 0, 40000);

  // Sample consumption data
  const consumptionData = [
    { month: 'يناير', gas: 15000, solar: 25000, eygptSolar: 12000 },
    { month: 'فبراير', gas: 18000, solar: 28000, eygptSolar: 14000 },
    { month: 'مارس', gas: 16000, solar: 30000, eygptSolar: 13000 },
    { month: 'أبريل', gas: 20000, solar: 32000, eygptSolar: 15000 },
    { month: 'مايو', gas: 22000, solar: 35000, eygptSolar: 16000 },
    { month: 'يونيو', gas: 19000, solar: 33000, eygptSolar: 14500 },
  ];

  const alerts = [
    {
      type: 'warning',
      title: 'مخزون منخفض',
      message: 'مستوى السولار المصري أقل من 50% من السعة الإجمالية',
      action: 'طلب شحنة جديدة',
    },
    {
      type: 'info',
      title: 'استهلاك مرتفع',
      message: 'استهلاك البنزين هذا الشهر أعلى من المتوسط بنسبة 15%',
      action: 'مراجعة الاستهلاك',
    },
  ];

  const InventoryCard = ({ title, current, capacity, unit, color, trend }: any) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {title}
          </Typography>
          <LocalGasStation sx={{ color: `${color}.main` }} />
        </Box>
        
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: `${color}.main`, mb: 1 }}>
          {current.toLocaleString()}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {unit} من أصل {capacity.toLocaleString()} {unit}
        </Typography>
        
        <LinearProgress
          variant="determinate"
          value={(current / capacity) * 100}
          sx={{
            height: 8,
            borderRadius: 4,
            mb: 2,
            backgroundColor: 'grey.200',
            '& .MuiLinearProgress-bar': {
              backgroundColor: `${color}.main`,
              borderRadius: 4,
            },
          }}
        />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Chip
            label={`${((current / capacity) * 100).toFixed(0)}%`}
            color={color}
            size="small"
            sx={{ fontWeight: 'bold' }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {trend > 0 ? (
              <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} />
            ) : (
              <TrendingDown sx={{ fontSize: 16, color: 'error.main' }} />
            )}
            <Typography variant="caption" color={trend > 0 ? 'success.main' : 'error.main'}>
              {Math.abs(trend)}%
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            مراقبة المخزون
          </Typography>
          <Typography variant="body1" color="text.secondary">
            متابعة مستويات الوقود والتنبيهات
          </Typography>
        </Box>
        <Button
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          variant="outlined"
          disabled={loading}
        >
          تحديث
        </Button>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Inventory Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <InventoryCard
            title="بنزين"
            current={currentInventory?.gasQuantity || 45000}
            capacity={80000}
            unit="لتر"
            color="primary"
            trend={5.2}
          />
        </Grid>
        
        <Grid item xs={12} md={4}>
          <InventoryCard
            title="سولار محلي"
            current={currentInventory?.solarQuantity || 32000}
            capacity={60000}
            unit="لتر"
            color="secondary"
            trend={-2.8}
          />
        </Grid>
        
        <Grid item xs={12} md={4}>
          <InventoryCard
            title="سولار مصري"
            current={currentInventory?.eygptSolarQuantity || 18000}
            capacity={40000}
            unit="لتر"
            color="warning"
            trend={-8.5}
          />
        </Grid>
      </Grid>

      {/* Detailed Gauges and Alerts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} lg={8}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <InventoryGauge
                title="بنزين"
                current={currentInventory?.gasQuantity || 45000}
                capacity={80000}
                unit="لتر"
                color="primary"
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <InventoryGauge
                title="سولار محلي"
                current={currentInventory?.solarQuantity || 32000}
                capacity={60000}
                unit="لتر"
                color="secondary"
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <InventoryGauge
                title="سولار مصري"
                current={currentInventory?.eygptSolarQuantity || 18000}
                capacity={40000}
                unit="لتر"
                color="warning"
              />
            </Grid>
          </Grid>
        </Grid>
        
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
              <WarningIcon color="warning" />
              التنبيهات والإشعارات
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {alerts.map((alert, index) => (
                <Alert
                  key={index}
                  severity={alert.type as any}
                  action={
                    <Button size="small" color="inherit">
                      {alert.action}
                    </Button>
                  }
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    {alert.title}
                  </Typography>
                  <Typography variant="body2">
                    {alert.message}
                  </Typography>
                </Alert>
              ))}
              
              {alerts.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <InventoryIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    لا توجد تنبيهات حالياً
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Consumption Chart */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <ConsumptionChart 
            data={consumptionData} 
            title="اتجاه الاستهلاك الشهري"
          />
        </Grid>
      </Grid>

      {/* Inventory Summary Table */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
          ملخص المخزون
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                {((currentInventory?.gasQuantity || 0) + 
                  (currentInventory?.solarQuantity || 0) + 
                  (currentInventory?.eygptSolarQuantity || 0)).toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                إجمالي المخزون (لتر)
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>
                180,000
              </Typography>
              <Typography variant="body2" color="text.secondary">
                السعة الإجمالية (لتر)
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h4" color="warning.main" sx={{ fontWeight: 'bold' }}>
                85,000
              </Typography>
              <Typography variant="body2" color="text.secondary">
                المساحة المتاحة (لتر)
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h4" color="info.main" sx={{ fontWeight: 'bold' }}>
                53%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                نسبة الإشغال
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};