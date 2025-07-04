import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';
import { AppDispatch, RootState } from './store';
import { LoginPage } from './features/auth/LoginPage';
import { ProtectedRoute } from './features/auth/ProtectedRoute';
import { MainLayout } from './layouts/MainLayout';
import { DashboardPage } from './pages/DashboardPage';
import { VehiclesPage } from './pages/VehiclesPage';
import { GeneratorsPage } from './pages/GeneratorsPage';
import { FuelLogsPage } from './pages/FuelLogsPage';
import { InvoicesPage } from './pages/InvoicesPage';
import { InventoryPage } from './pages/InventoryPage';
import { ReportsPage } from './pages/ReportsPage';
import { verifyTokenAsync } from './store/slices/authSlice';
import { fetchConstantsAsync } from './store/slices/constantsSlice';
import { fetchStationsAsync } from './store/slices/stationsSlice';

// Create rtl cache
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { language, theme } = useSelector((state: RootState) => state.ui);
  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(verifyTokenAsync());
    }
    dispatch(fetchConstantsAsync());
    dispatch(fetchStationsAsync());
  }, [dispatch, token]);

  const muiTheme = createTheme({
    direction: language === 'ar' ? 'rtl' : 'ltr',
    palette: {
      mode: theme,
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
    },
    typography: {
      fontFamily: language === 'ar' ? 
        '"Cairo", "Roboto", "Helvetica", "Arial", sans-serif' : 
        '"Roboto", "Helvetica", "Arial", sans-serif',
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            direction: language === 'ar' ? 'rtl' : 'ltr',
          },
        },
      },
    },
  });

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <Box sx={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}>
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Routes>
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/vehicles" element={<VehiclesPage />} />
                        <Route path="/generators" element={<GeneratorsPage />} />
                        <Route path="/fuel-logs" element={<FuelLogsPage />} />
                        <Route path="/invoices" element={<InvoicesPage />} />
                        <Route path="/inventory" element={<InventoryPage />} />
                        <Route path="/reports" element={<ReportsPage />} />
                      </Routes>
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
        </Box>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default App;
