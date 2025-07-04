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
  Card,
  CardContent,
  Alert,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Print as PrintIcon,
  Assessment as AssessmentIcon,
  TrendingUp,
  LocalGasStation,
  DirectionsCar,
  Power,
  Receipt,
  BarChart,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { RootState, AppDispatch } from '../store';
import { ConsumptionChart } from '../components/charts/ConsumptionChart';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`report-tabpanel-${index}`}
      aria-labelledby={`report-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export const ReportsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { vehicles } = useSelector((state: RootState) => state.vehicles);
  const { generators } = useSelector((state: RootState) => state.generators);
  const { stations } = useSelector((state: RootState) => state.stations);
  const { constantsByType } = useSelector((state: RootState) => state.constants);

  const [activeTab, setActiveTab] = useState(0);
  const [dateFrom, setDateFrom] = useState<Date | null>(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [dateTo, setDateTo] = useState<Date | null>(new Date());
  const [selectedVehicle, setSelectedVehicle] = useState<number | ''>('');
  const [selectedGenerator, setSelectedGenerator] = useState<number | ''>('');
  const [selectedStation, setSelectedStation] = useState<number | ''>('');

  const fuelTypes = constantsByType['FUEL_TYPE'] || [];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
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

  // Mock data for demonstration
  const vehicleConsumptionData = [
    { vehicleNum: 'V001', model: 'تويوتا كامري', totalConsumption: 2500, trips: 45, avgConsumption: 55.6, cost: 3750 },
    { vehicleNum: 'V002', model: 'هونداي النترا', totalConsumption: 2200, trips: 38, avgConsumption: 57.9, cost: 3300 },
    { vehicleNum: 'V003', model: 'نيسان صني', totalConsumption: 1800, trips: 32, avgConsumption: 56.3, cost: 2700 },
    { vehicleNum: 'V004', model: 'كيا سيراتو', totalConsumption: 2100, trips: 41, avgConsumption: 51.2, cost: 3150 },
  ];

  const generatorUsageData = [
    { name: 'مولد المبنى الرئيسي', capacity: '500 كيلو واط', hoursUsed: 240, fuelConsumed: 1200, cost: 1800 },
    { name: 'مولد الطوارئ', capacity: '250 كيلو واط', hoursUsed: 120, fuelConsumed: 600, cost: 900 },
    { name: 'مولد المستودع', capacity: '100 كيلو واط', hoursUsed: 180, fuelConsumed: 450, cost: 675 },
  ];

  const inventoryReportData = [
    { fuelType: 'بنزين', currentStock: 45000, capacity: 80000, consumption: 15000, percentage: 56.3 },
    { fuelType: 'سولار محلي', currentStock: 32000, capacity: 60000, consumption: 18000, percentage: 53.3 },
    { fuelType: 'سولار مصري', currentStock: 18000, capacity: 40000, consumption: 12000, percentage: 45.0 },
  ];

  const financialData = [
    { month: 'يناير', vehicles: 15000, generators: 8000, total: 23000 },
    { month: 'فبراير', vehicles: 18000, generators: 9500, total: 27500 },
    { month: 'مارس', vehicles: 16000, generators: 7500, total: 23500 },
    { month: 'أبريل', vehicles: 20000, generators: 10000, total: 30000 },
  ];

  const handleExportPDF = () => {
    // Implement PDF export logic
    console.log('Exporting to PDF...');
  };

  const handleExportExcel = () => {
    // Implement Excel export logic
    console.log('Exporting to Excel...');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            التقارير والإحصائيات
          </Typography>
          <Typography variant="body1" color="text.secondary">
            تقارير شاملة عن استهلاك الوقود والأداء المالي
          </Typography>
        </Box>

        {/* Filter Panel */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            فلاتر التقارير
          </Typography>
          
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={2}>
              <DatePicker
                label="من تاريخ"
                value={dateFrom ? dayjs(dateFrom) : null}
                onChange={(value) => setDateFrom(value?.toDate() || null)}
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
                value={dateTo ? dayjs(dateTo) : null}
                onChange={(value) => setDateTo(value?.toDate() || null)}
                slotProps={{
                  textField: {
                    size: 'small',
                    fullWidth: true,
                  },
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                size="small"
                select
                label="المركبة"
                value={selectedVehicle}
                onChange={(e) => setSelectedVehicle(e.target.value as number | '')}
              >
                <MenuItem value="">الكل</MenuItem>
                {vehicles.map((vehicle) => (
                  <MenuItem key={vehicle.oid} value={vehicle.oid}>
                    {vehicle.vehicleNum} - {vehicle.model}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                size="small"
                select
                label="المولد"
                value={selectedGenerator}
                onChange={(e) => setSelectedGenerator(e.target.value as number | '')}
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
              <TextField
                fullWidth
                size="small"
                select
                label="المحطة"
                value={selectedStation}
                onChange={(e) => setSelectedStation(e.target.value as number | '')}
              >
                <MenuItem value="">الكل</MenuItem>
                {stations.map((station) => (
                  <MenuItem key={station.oid} value={station.oid}>
                    {station.stationName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  startIcon={<DownloadIcon />}
                  onClick={handleExportPDF}
                  variant="outlined"
                  size="small"
                  fullWidth
                >
                  PDF
                </Button>
                <Button
                  startIcon={<DownloadIcon />}
                  onClick={handleExportExcel}
                  variant="outlined"
                  size="small"
                  fullWidth
                >
                  Excel
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Report Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab
              icon={<DirectionsCar />}
              label="تقرير المركبات"
              iconPosition="start"
            />
            <Tab
              icon={<Power />}
              label="تقرير المولدات"
              iconPosition="start"
            />
            <Tab
              icon={<LocalGasStation />}
              label="تقرير المخزون"
              iconPosition="start"
            />
            <Tab
              icon={<Receipt />}
              label="التقرير المالي"
              iconPosition="start"
            />
          </Tabs>

          {/* Vehicle Report */}
          <TabPanel value={activeTab} index={0}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                تقرير استهلاك المركبات
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                الفترة: {formatDate(dateFrom)} - {formatDate(dateTo)}
              </Typography>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <DirectionsCar sx={{ fontSize: 40, color: 'primary.main' }} />
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {vehicleConsumptionData.length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          عدد المركبات
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
                      <LocalGasStation sx={{ fontSize: 40, color: 'success.main' }} />
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {vehicleConsumptionData.reduce((sum, v) => sum + v.totalConsumption, 0).toLocaleString()} لتر
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          إجمالي الاستهلاك
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
                      <TrendingUp sx={{ fontSize: 40, color: 'warning.main' }} />
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {(vehicleConsumptionData.reduce((sum, v) => sum + v.avgConsumption, 0) / vehicleConsumptionData.length).toFixed(1)} لتر/100كم
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          متوسط الاستهلاك
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
                      <Receipt sx={{ fontSize: 40, color: 'error.main' }} />
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {formatCurrency(vehicleConsumptionData.reduce((sum, v) => sum + v.cost, 0))}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          إجمالي التكلفة
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>رقم المركبة</TableCell>
                    <TableCell>الموديل</TableCell>
                    <TableCell align="center">إجمالي الاستهلاك</TableCell>
                    <TableCell align="center">عدد الرحلات</TableCell>
                    <TableCell align="center">متوسط الاستهلاك</TableCell>
                    <TableCell align="center">التكلفة</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {vehicleConsumptionData.map((vehicle, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                            <DirectionsCar sx={{ fontSize: 18 }} />
                          </Avatar>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {vehicle.vehicleNum}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{vehicle.model}</TableCell>
                      <TableCell align="center">{vehicle.totalConsumption.toLocaleString()} لتر</TableCell>
                      <TableCell align="center">{vehicle.trips}</TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={`${vehicle.avgConsumption} لتر/100كم`}
                          color={vehicle.avgConsumption > 60 ? 'error' : vehicle.avgConsumption > 55 ? 'warning' : 'success'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">{formatCurrency(vehicle.cost)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          {/* Generator Report */}
          <TabPanel value={activeTab} index={1}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                تقرير استخدام المولدات
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                الفترة: {formatDate(dateFrom)} - {formatDate(dateTo)}
              </Typography>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Power sx={{ fontSize: 40, color: 'secondary.main' }} />
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {generatorUsageData.length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          عدد المولدات
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
                      <BarChart sx={{ fontSize: 40, color: 'info.main' }} />
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {generatorUsageData.reduce((sum, g) => sum + g.hoursUsed, 0)} ساعة
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ساعات التشغيل
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
                      <LocalGasStation sx={{ fontSize: 40, color: 'success.main' }} />
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {generatorUsageData.reduce((sum, g) => sum + g.fuelConsumed, 0).toLocaleString()} لتر
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          استهلاك الوقود
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
                      <Receipt sx={{ fontSize: 40, color: 'error.main' }} />
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {formatCurrency(generatorUsageData.reduce((sum, g) => sum + g.cost, 0))}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          إجمالي التكلفة
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>اسم المولد</TableCell>
                    <TableCell>القدرة</TableCell>
                    <TableCell align="center">ساعات التشغيل</TableCell>
                    <TableCell align="center">استهلاك الوقود</TableCell>
                    <TableCell align="center">التكلفة</TableCell>
                    <TableCell align="center">الكفاءة</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {generatorUsageData.map((generator, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                            <Power sx={{ fontSize: 18 }} />
                          </Avatar>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {generator.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{generator.capacity}</TableCell>
                      <TableCell align="center">{generator.hoursUsed} ساعة</TableCell>
                      <TableCell align="center">{generator.fuelConsumed.toLocaleString()} لتر</TableCell>
                      <TableCell align="center">{formatCurrency(generator.cost)}</TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={`${(generator.fuelConsumed / generator.hoursUsed).toFixed(1)} لتر/ساعة`}
                          color="info"
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          {/* Inventory Report */}
          <TabPanel value={activeTab} index={2}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                تقرير مستويات المخزون
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                تقرير حالي لجميع أنواع الوقود
              </Typography>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              {inventoryReportData.map((fuel, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                        {fuel.fuelType}
                      </Typography>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                          {fuel.currentStock.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          لتر من أصل {fuel.capacity.toLocaleString()} لتر
                        </Typography>
                      </Box>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          نسبة الإشغال: {fuel.percentage}%
                        </Typography>
                        <Box sx={{ 
                          width: '100%', 
                          height: 8, 
                          bgcolor: 'grey.200', 
                          borderRadius: 4,
                          position: 'relative'
                        }}>
                          <Box sx={{
                            width: `${fuel.percentage}%`,
                            height: '100%',
                            bgcolor: fuel.percentage > 70 ? 'success.main' : fuel.percentage > 30 ? 'warning.main' : 'error.main',
                            borderRadius: 4,
                          }} />
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          استهلاك الشهر: {fuel.consumption.toLocaleString()} لتر
                        </Typography>
                        <Chip
                          label={fuel.percentage > 70 ? 'مستوى جيد' : fuel.percentage > 30 ? 'مستوى متوسط' : 'مستوى منخفض'}
                          color={fuel.percentage > 70 ? 'success' : fuel.percentage > 30 ? 'warning' : 'error'}
                          size="small"
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                توزيع المخزون
              </Typography>
              <ConsumptionChart 
                data={inventoryReportData.map(fuel => ({
                  month: fuel.fuelType,
                  gas: fuel.fuelType === 'بنزين' ? fuel.currentStock : 0,
                  solar: fuel.fuelType === 'سولار محلي' ? fuel.currentStock : 0,
                  eygptSolar: fuel.fuelType === 'سولار مصري' ? fuel.currentStock : 0,
                }))}
                title="توزيع المخزون الحالي"
              />
            </Paper>
          </TabPanel>

          {/* Financial Report */}
          <TabPanel value={activeTab} index={3}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                التقرير المالي
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                تحليل التكاليف والمصروفات - الفترة: {formatDate(dateFrom)} - {formatDate(dateTo)}
              </Typography>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      إجمالي المصروفات
                    </Typography>
                    <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                      {formatCurrency(financialData.reduce((sum, f) => sum + f.total, 0))}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      مصروفات المركبات
                    </Typography>
                    <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>
                      {formatCurrency(financialData.reduce((sum, f) => sum + f.vehicles, 0))}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      مصروفات المولدات
                    </Typography>
                    <Typography variant="h4" color="warning.main" sx={{ fontWeight: 'bold' }}>
                      {formatCurrency(financialData.reduce((sum, f) => sum + f.generators, 0))}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      متوسط الشهري
                    </Typography>
                    <Typography variant="h4" color="info.main" sx={{ fontWeight: 'bold' }}>
                      {formatCurrency(financialData.reduce((sum, f) => sum + f.total, 0) / financialData.length)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    اتجاه المصروفات الشهرية
                  </Typography>
                  <ConsumptionChart 
                    data={financialData.map(f => ({
                      month: f.month,
                      gas: f.vehicles,
                      solar: f.generators,
                      eygptSolar: 0,
                    }))}
                    title="توزيع المصروفات"
                  />
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>الشهر</TableCell>
                        <TableCell align="center">المركبات</TableCell>
                        <TableCell align="center">المولدات</TableCell>
                        <TableCell align="center">الإجمالي</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {financialData.map((data, index) => (
                        <TableRow key={index}>
                          <TableCell>{data.month}</TableCell>
                          <TableCell align="center">{(data.vehicles / 1000).toFixed(0)}ك</TableCell>
                          <TableCell align="center">{(data.generators / 1000).toFixed(0)}ك</TableCell>
                          <TableCell align="center">
                            <Chip 
                              label={`${(data.total / 1000).toFixed(0)}ك شيكل`}
                              color="primary"
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </TabPanel>
        </Paper>

        {/* Export Actions */}
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            تصدير التقارير
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              startIcon={<DownloadIcon />}
              onClick={handleExportPDF}
              variant="contained"
              color="primary"
            >
              تصدير PDF
            </Button>
            <Button
              startIcon={<DownloadIcon />}
              onClick={handleExportExcel}
              variant="contained"
              color="success"
            >
              تصدير Excel
            </Button>
            <Button
              startIcon={<PrintIcon />}
              onClick={handlePrint}
              variant="outlined"
            >
              طباعة
            </Button>
          </Box>
        </Paper>
      </Box>
    </LocalizationProvider>
  );
};