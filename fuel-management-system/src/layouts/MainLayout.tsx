import React from 'react';
import { Box } from '@mui/material';
import { Header } from '../components/common/Header';
import { Sidebar } from '../components/common/Sidebar';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { sidebarOpen } = useSelector((state: RootState) => state.ui);

  const sidebarWidth = 280;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Header />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${sidebarOpen ? sidebarWidth : 0}px)` },
          ml: { sm: sidebarOpen ? `${sidebarWidth}px` : 0 },
          mt: '64px', // Account for header height
          transition: (theme) =>
            theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
        }}
      >
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};