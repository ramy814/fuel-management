import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

export const ReportsPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        التقارير
      </Typography>
      
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="body1">
          صفحة التقارير - قيد التطوير
        </Typography>
      </Paper>
    </Box>
  );
};