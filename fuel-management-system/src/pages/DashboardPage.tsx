import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Grid,
  Alert,
  Skeleton,
} from '@mui/material';
import {
  DirectionsCar,
  Power,
  LocalGasStation,
  Inventory,
  TrendingUp,
  Warning,
} from '@mui/icons-material';
import { RootState, AppDispatch } from '../store';
import { StatsCard } from '../components/common/StatsCard';
import { ConsumptionChart } from '../components/charts/ConsumptionChart';
import { InventoryGauge } from '../components/charts/InventoryGauge';
import { RecentMovementsTable } from '../components/tables/RecentMovementsTable';
import { fetchVehiclesAsync } from '../store/slices/vehiclesSlice';
import { fetchGeneratorsAsync } from '../store/slices/generatorsSlice';
import { fetchFuelLogsAsync } from '../store/slices/fuelLogsSlice';
import { fetchCurrentInventoryAsync } from '../store/slices/inventorySlice';

export const DashboardPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { vehicles, loading: vehiclesLoading } = useSelector((state: RootState) => state.vehicles);
  const { generators, loading: generatorsLoading } = useSelector((state: RootState) => state.generators);
  const { fuelLogs, loading: fuelLogsLoading } = useSelector((state: RootState) => state.fuelLogs);
  const { currentInventory, loading: inventoryLoading } = useSelector((state: RootState) => state.inventory);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Fetch data for dashboard
    dispatch(fetchVehiclesAsync({ pageSize: 100 }));
    dispatch(fetchGeneratorsAsync());
    dispatch(fetchFuelLogsAsync({ pageSize: 10 }));
    dispatch(fetchCurrentInventoryAsync());
  }, [dispatch]);

  // Calculate stats
  const activeVehicles = vehicles.filter(v => v.statusName?.toLowerCase() === 'active').length;
  const totalConsumptionToday = fuelLogs
    .filter(log => {
      const today = new Date();
      const logDate = new Date(log.fillUpDate || '');
      return logDate.toDateString() === today.toDateString();
    })
    .reduce((sum, log) => sum + (log.gallons || 0), 0);

  // Sample data for charts (replace with real data from API)
  const consumptionData = [
    { month: 'يناير', gas: 15000, solar: 25000, eygptSolar: 12000 },
    { month: 'فبراير', gas: 18000, solar: 28000, eygptSolar: 14000 },
    { month: 'مارس', gas: 16000, solar: 30000, eygptSolar: 13000 },
    { month: 'أبريل', gas: 20000, solar: 32000, eygptSolar: 15000 },
    { month: 'مايو', gas: 22000, solar: 35000, eygptSolar: 16000 },
    { month: 'يونيو', gas: 19000, solar: 33000, eygptSolar: 14500 },
  ];

  const isLoading = vehiclesLoading || generatorsLoading || fuelLogsLoading || inventoryLoading;

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          لوحة التحكم
        </Typography>
        <Typography variant="body1" color="text.secondary">
          مرحباً {user?.fullName || user?.username}، إليك نظرة عامة على نظام إدارة المحروقات
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          {isLoading ? (
            <Skeleton variant="rectangular" height={200} />
          ) : (
            <StatsCard
              title="إجمالي المركبات"
              value={vehicles.length}
              icon={DirectionsCar}
              color="primary"
              change={{ value: 5, type: 'increase' }}
              subtitle={`${activeVehicles} مركبة نشطة`}
            />
          )}
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          {isLoading ? (
            <Skeleton variant="rectangular" height={200} />
          ) : (
            <StatsCard
              title="إجمالي المولدات"
              value={generators.length}
              icon={Power}
              color="secondary"
              change={{ value: 2, type: 'increase' }}
              subtitle="جميع المولدات نشطة"
            />
          )}
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          {isLoading ? (
            <Skeleton variant="rectangular" height={200} />
          ) : (
            <StatsCard
              title="استهلاك اليوم"
              value={`${totalConsumptionToday.toLocaleString()}`}
              icon={LocalGasStation}
              color="success"
              change={{ value: 8, type: 'increase' }}
              subtitle="لتر"
            />
          )}
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          {isLoading ? (
            <Skeleton variant="rectangular" height={200} />
          ) : (
            <StatsCard
              title="المخزون الحالي"
              value={`${(currentInventory?.gasQuantity || 0).toLocaleString()}`}
              icon={Inventory}
              color="warning"
              change={{ value: 3, type: 'decrease' }}
              subtitle="لتر بنزين"
            />
          )}
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} lg={8}>
          <ConsumptionChart data={consumptionData} />
        </Grid>
        
        <Grid item xs={12} lg={4}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <InventoryGauge
                title="بنزين"
                current={currentInventory?.gasQuantity || 45000}
                capacity={80000}
                unit="لتر"
                color="primary"
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Inventory Gauges */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <InventoryGauge
            title="سولار محلي"
            current={currentInventory?.solarQuantity || 32000}
            capacity={60000}
            unit="لتر"
            color="secondary"
          />
        </Grid>
        
        <Grid item xs={12} md={4}>
          <InventoryGauge
            title="سولار مصري"
            current={currentInventory?.eygptSolarQuantity || 18000}
            capacity={40000}
            unit="لتر"
            color="success"
          />
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Alert severity="warning" icon={<Warning />}>
              <Typography variant="subtitle2">تنبيه مخزون</Typography>
              <Typography variant="body2">
                مستوى السولار المصري منخفض (أقل من 50%)
              </Typography>
            </Alert>
            
            <Alert severity="info" icon={<TrendingUp />}>
              <Typography variant="subtitle2">تحديث</Typography>
              <Typography variant="body2">
                تم استلام شحنة جديدة من البنزين اليوم
              </Typography>
            </Alert>
          </Box>
        </Grid>
      </Grid>

      {/* Recent Movements */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <RecentMovementsTable
            movements={fuelLogs}
            maxRows={10}
          />
        </Grid>
      </Grid>
    </Box>
  );
};