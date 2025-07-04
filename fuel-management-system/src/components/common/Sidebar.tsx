import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Collapse,
} from '@mui/material';
import {
  Dashboard,
  DirectionsCar,
  Power,
  LocalGasStation,
  Receipt,
  Inventory,
  Assessment,
  Settings,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { setSidebarOpen } from '../../store/slices/uiSlice';

interface MenuItem {
  title: string;
  path?: string;
  icon: React.ReactElement;
  children?: MenuItem[];
  permission?: string;
}

const menuItems: MenuItem[] = [
  {
    title: 'لوحة التحكم',
    path: '/dashboard',
    icon: <Dashboard />,
  },
  {
    title: 'إدارة المركبات',
    path: '/vehicles',
    icon: <DirectionsCar />,
  },
  {
    title: 'إدارة المولدات',
    path: '/generators',
    icon: <Power />,
  },
  {
    title: 'حركات الوقود',
    path: '/fuel-logs',
    icon: <LocalGasStation />,
  },
  {
    title: 'إدارة الفواتير',
    path: '/invoices',
    icon: <Receipt />,
  },
  {
    title: 'مراقبة المخزون',
    path: '/inventory',
    icon: <Inventory />,
  },
  {
    title: 'التقارير',
    path: '/reports',
    icon: <Assessment />,
  },
  {
    title: 'الإعدادات',
    icon: <Settings />,
    children: [
      {
        title: 'إدارة المستخدمين',
        path: '/settings/users',
        icon: <Settings />,
        permission: 'manage_users',
      },
      {
        title: 'إدارة الثوابت',
        path: '/settings/constants',
        icon: <Settings />,
        permission: 'manage_constants',
      },
      {
        title: 'إدارة المحطات',
        path: '/settings/stations',
        icon: <Settings />,
        permission: 'manage_stations',
      },
    ],
  },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { sidebarOpen } = useSelector((state: RootState) => state.ui);
  const { user } = useSelector((state: RootState) => state.auth);
  const [openSubmenu, setOpenSubmenu] = React.useState<string | null>(null);

  const sidebarWidth = 280;

  const hasPermission = (permission?: string) => {
    if (!permission) return true;
    return user?.permissions?.includes(permission) || false;
  };

  const handleItemClick = (path?: string) => {
    if (path) {
      navigate(path);
    }
  };

  const handleSubmenuToggle = (title: string) => {
    setOpenSubmenu(openSubmenu === title ? null : title);
  };

  const renderMenuItem = (item: MenuItem, level = 0) => {
    if (!hasPermission(item.permission)) {
      return null;
    }

    const isActive = item.path === location.pathname;
    const hasChildren = item.children && item.children.length > 0;
    const isSubmenuOpen = openSubmenu === item.title;

    return (
      <React.Fragment key={item.title}>
        <ListItem disablePadding sx={{ display: 'block' }}>
          <ListItemButton
            sx={{
              minHeight: 48,
              justifyContent: sidebarOpen ? 'initial' : 'center',
              px: 2.5,
              pl: level > 0 ? 4 : 2.5,
              bgcolor: isActive ? 'primary.main' : 'transparent',
              color: isActive ? 'white' : 'inherit',
              '&:hover': {
                bgcolor: isActive ? 'primary.dark' : 'action.hover',
              },
            }}
            onClick={() => {
              if (hasChildren) {
                handleSubmenuToggle(item.title);
              } else {
                handleItemClick(item.path);
              }
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: sidebarOpen ? 3 : 'auto',
                justifyContent: 'center',
                color: isActive ? 'white' : 'inherit',
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.title}
              sx={{
                opacity: sidebarOpen ? 1 : 0,
                '& .MuiListItemText-primary': {
                  fontSize: '0.9rem',
                },
              }}
            />
            {hasChildren && sidebarOpen && (
              isSubmenuOpen ? <ExpandLess /> : <ExpandMore />
            )}
          </ListItemButton>
        </ListItem>

        {hasChildren && (
          <Collapse in={isSubmenuOpen && sidebarOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children?.map((child) => renderMenuItem(child, level + 1))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: sidebarOpen ? sidebarWidth : 60,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: sidebarOpen ? sidebarWidth : 60,
          boxSizing: 'border-box',
          transition: (theme) =>
            theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          overflowX: 'hidden',
          bgcolor: 'background.paper',
          borderRight: (theme) => `1px solid ${theme.palette.divider}`,
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2,
          py: 2,
          minHeight: 64,
          bgcolor: 'primary.main',
          color: 'white',
        }}
      >
        {sidebarOpen && (
          <Typography variant="h6" noWrap sx={{ fontWeight: 'bold' }}>
            نظام المحروقات
          </Typography>
        )}
      </Box>
      
      <Divider />
      
      <List sx={{ pt: 1 }}>
        {menuItems.map((item) => renderMenuItem(item))}
      </List>
    </Drawer>
  );
};