import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Avatar,
  Box,
  IconButton,
} from '@mui/material';
import {
  DirectionsCar,
  Power,
  Visibility,
  LocalGasStation,
} from '@mui/icons-material';
import { FuelLog } from '../../types';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface RecentMovementsTableProps {
  movements: FuelLog[];
  title?: string;
  maxRows?: number;
}

export const RecentMovementsTable: React.FC<RecentMovementsTableProps> = ({
  movements,
  title = 'آخر الحركات',
  maxRows = 5,
}) => {
  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'مكتمل':
        return 'success';
      case 'pending':
      case 'قيد الانتظار':
        return 'warning';
      case 'cancelled':
      case 'ملغي':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'مكتمل';
      case 'pending':
        return 'قيد الانتظار';
      case 'cancelled':
        return 'ملغي';
      default:
        return status || 'غير محدد';
    }
  };

  const formatDate = (date?: Date | string) => {
    if (!date) return '-';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, 'dd/MM/yyyy HH:mm', { locale: ar });
  };

  const displayedMovements = movements.slice(0, maxRows);

  return (
    <Paper sx={{ p: 3 }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          fontWeight: 'bold',
          mb: 3,
        }}
      >
        {title}
      </Typography>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>النوع</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>الرقم/الاسم</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>الكمية</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>التاريخ</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>الحالة</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>العمليات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedMovements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="text.secondary">
                    لا توجد حركات حديثة
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              displayedMovements.map((movement) => (
                <TableRow
                  key={movement.oid}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: movement.vehOid ? 'primary.main' : 'secondary.main',
                        }}
                      >
                        {movement.vehOid ? (
                          <DirectionsCar sx={{ fontSize: 18 }} />
                        ) : (
                          <Power sx={{ fontSize: 18 }} />
                        )}
                      </Avatar>
                      <Typography variant="body2">
                        {movement.vehOid ? 'مركبة' : 'مولد'}
                      </Typography>
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                      {movement.vehicleNum || movement.generatorName || '-'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {movement.fuelTypeName}
                    </Typography>
                  </TableCell>
                  
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocalGasStation sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        {movement.gallons?.toLocaleString() || 0} لتر
                      </Typography>
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(movement.fillUpDate)}
                    </Typography>
                  </TableCell>
                  
                  <TableCell>
                    <Chip
                      label={getStatusText(movement.statusName)}
                      color={getStatusColor(movement.statusName)}
                      size="small"
                      sx={{ fontWeight: 'medium' }}
                    />
                  </TableCell>
                  
                  <TableCell>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => {
                        // Handle view details
                        console.log('View movement details:', movement.oid);
                      }}
                    >
                      <Visibility sx={{ fontSize: 18 }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {movements.length > maxRows && (
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography
            variant="body2"
            color="primary"
            sx={{
              cursor: 'pointer',
              textDecoration: 'underline',
              '&:hover': {
                color: 'primary.dark',
              },
            }}
            onClick={() => {
              // Navigate to full movements page
              console.log('Navigate to fuel logs page');
            }}
          >
            عرض جميع الحركات ({movements.length})
          </Typography>
        </Box>
      )}
    </Paper>
  );
};