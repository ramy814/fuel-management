import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Logout,
  Settings,
  Notifications,
  Language,
  DarkMode,
  LightMode,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { logoutAsync } from '../../store/slices/authSlice';
import { toggleSidebar, setTheme, setLanguage } from '../../store/slices/uiSlice';

export const Header: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { theme, language } = useSelector((state: RootState) => state.ui);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    await dispatch(logoutAsync());
  };

  const handleThemeToggle = () => {
    dispatch(setTheme(theme === 'light' ? 'dark' : 'light'));
  };

  const handleLanguageToggle = () => {
    dispatch(setLanguage(language === 'ar' ? 'en' : 'ar'));
  };

  const handleSidebarToggle = () => {
    dispatch(toggleSidebar());
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: 'primary.main',
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleSidebarToggle}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
          <img
            src="/logo.png"
            alt="Gaza Municipality"
            style={{ height: 40, marginRight: 10 }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <Box>
            <Typography variant="h6" noWrap sx={{ fontWeight: 'bold' }}>
              نظام إدارة المحروقات
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              بلدية غزة
            </Typography>
          </Box>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton color="inherit" onClick={handleThemeToggle}>
            {theme === 'light' ? <DarkMode /> : <LightMode />}
          </IconButton>

          <IconButton color="inherit" onClick={handleLanguageToggle}>
            <Language />
          </IconButton>

          <IconButton color="inherit">
            <Notifications />
          </IconButton>

          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            onClick={handleMenuOpen}
            color="inherit"
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
              {user?.fullName?.charAt(0) || user?.username?.charAt(0) || 'U'}
            </Avatar>
          </IconButton>
        </Box>

        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          sx={{ mt: 1 }}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
              {user?.fullName || user?.username}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>
          <Divider />
          
          <MenuItem onClick={handleMenuClose}>
            <AccountCircle sx={{ mr: 1 }} />
            الملف الشخصي
          </MenuItem>
          
          <MenuItem onClick={handleMenuClose}>
            <Settings sx={{ mr: 1 }} />
            الإعدادات
          </MenuItem>
          
          <Divider />
          
          <MenuItem onClick={handleLogout}>
            <Logout sx={{ mr: 1 }} />
            تسجيل الخروج
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};