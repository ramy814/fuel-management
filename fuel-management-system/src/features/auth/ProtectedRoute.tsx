import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { RootState, AppDispatch } from '../../store';
import { verifyTokenAsync } from '../../store/slices/authSlice';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredPermission 
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const { isAuthenticated, loading, user, token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (token && !isAuthenticated) {
      dispatch(verifyTokenAsync());
    }
  }, [token, isAuthenticated, dispatch]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: 2,
        }}
      >
        <CircularProgress size={50} />
        <Typography variant="h6">جاري التحقق من الهوية...</Typography>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredPermission && user && !user.permissions?.includes(requiredPermission)) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: 2,
        }}
      >
        <Typography variant="h5" color="error">
          ليس لديك صلاحية للوصول إلى هذه الصفحة
        </Typography>
        <Typography variant="body1">
          يرجى التواصل مع مدير النظام للحصول على الصلاحيات المطلوبة
        </Typography>
      </Box>
    );
  }

  return <>{children}</>;
};