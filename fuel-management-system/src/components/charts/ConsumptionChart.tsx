import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Paper, Typography, Box, useTheme } from '@mui/material';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ConsumptionData {
  month: string;
  gas: number;
  solar: number;
  eygptSolar: number;
}

interface ConsumptionChartProps {
  data: ConsumptionData[];
  title?: string;
}

export const ConsumptionChart: React.FC<ConsumptionChartProps> = ({
  data,
  title = 'استهلاك الوقود الشهري',
}) => {
  const theme = useTheme();

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            family: 'Cairo, Roboto, sans-serif',
          },
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: theme.palette.background.paper,
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.primary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        rtl: true,
        titleFont: {
          family: 'Cairo, Roboto, sans-serif',
        },
        bodyFont: {
          family: 'Cairo, Roboto, sans-serif',
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: 'Cairo, Roboto, sans-serif',
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: theme.palette.divider,
        },
        ticks: {
          font: {
            family: 'Cairo, Roboto, sans-serif',
          },
          callback: function(value: any) {
            return value + ' لتر';
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
  };

  const chartData = {
    labels: data.map(item => item.month),
    datasets: [
      {
        label: 'بنزين',
        data: data.map(item => item.gas),
        borderColor: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.main + '20',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: theme.palette.primary.main,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
      {
        label: 'سولار محلي',
        data: data.map(item => item.solar),
        borderColor: theme.palette.secondary.main,
        backgroundColor: theme.palette.secondary.main + '20',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: theme.palette.secondary.main,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
      {
        label: 'سولار مصري',
        data: data.map(item => item.eygptSolar),
        borderColor: theme.palette.success.main,
        backgroundColor: theme.palette.success.main + '20',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: theme.palette.success.main,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  return (
    <Paper
      sx={{
        p: 3,
        height: 400,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          fontWeight: 'bold',
          color: 'text.primary',
          mb: 3,
        }}
      >
        {title}
      </Typography>
      
      <Box sx={{ flexGrow: 1, position: 'relative' }}>
        <Line options={chartOptions} data={chartData} />
      </Box>
    </Paper>
  );
};