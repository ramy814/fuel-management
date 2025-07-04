import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import {
  Paper,
  Typography,
  Box,
  useTheme,
  LinearProgress,
} from '@mui/material';

ChartJS.register(ArcElement, Tooltip, Legend);

interface InventoryGaugeProps {
  title: string;
  current: number;
  capacity: number;
  unit: string;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}

export const InventoryGauge: React.FC<InventoryGaugeProps> = ({
  title,
  current,
  capacity,
  unit,
  color,
}) => {
  const theme = useTheme();
  const percentage = (current / capacity) * 100;

  const getStatusColor = () => {
    if (percentage >= 70) return theme.palette.success.main;
    if (percentage >= 30) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  const getStatusText = () => {
    if (percentage >= 70) return 'مستوى جيد';
    if (percentage >= 30) return 'مستوى متوسط';
    return 'مستوى منخفض';
  };

  const chartData = {
    datasets: [
      {
        data: [current, capacity - current],
        backgroundColor: [
          getStatusColor(),
          theme.palette.grey[200],
        ],
        borderWidth: 0,
        cutout: '70%',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  };

  return (
    <Paper
      sx={{
        p: 3,
        height: 280,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          fontWeight: 'bold',
          textAlign: 'center',
          mb: 2,
        }}
      >
        {title}
      </Typography>

      <Box
        sx={{
          position: 'relative',
          width: 150,
          height: 150,
          mb: 2,
        }}
      >
        <Doughnut data={chartData} options={chartOptions} />
        
        {/* Center text */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              color: getStatusColor(),
              lineHeight: 1,
            }}
          >
            {percentage.toFixed(0)}%
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
          >
            {current.toLocaleString()} {unit}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ width: '100%', mb: 1 }}>
        <LinearProgress
          variant="determinate"
          value={percentage}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: theme.palette.grey[200],
            '& .MuiLinearProgress-bar': {
              backgroundColor: getStatusColor(),
              borderRadius: 4,
            },
          }}
        />
      </Box>

      <Typography
        variant="body2"
        sx={{
          color: getStatusColor(),
          fontWeight: 'bold',
          textAlign: 'center',
        }}
      >
        {getStatusText()}
      </Typography>

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ textAlign: 'center', mt: 1 }}
      >
        السعة الإجمالية: {capacity.toLocaleString()} {unit}
      </Typography>
    </Paper>
  );
};