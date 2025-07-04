import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
} from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: SvgIconComponent;
  color: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  subtitle?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  change,
  subtitle,
}) => {
  const getChangeColor = () => {
    if (!change) return 'default';
    return change.type === 'increase' ? 'success' : 'error';
  };

  const getChangeText = () => {
    if (!change) return '';
    const prefix = change.type === 'increase' ? '+' : '-';
    return `${prefix}${Math.abs(change.value)}%`;
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'visible',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: (theme) => theme.shadows[8],
        },
        transition: 'all 0.3s ease-in-out',
      }}
    >
      <CardContent sx={{ flexGrow: 1, pb: 2 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 2,
          }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 600,
                mb: 1,
                color: 'text.primary',
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="h3"
              component="div"
              sx={{
                fontWeight: 'bold',
                color: `${color}.main`,
                lineHeight: 1.2,
              }}
            >
              {value}
            </Typography>
            {subtitle && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
          
          <Avatar
            sx={{
              bgcolor: `${color}.main`,
              width: 56,
              height: 56,
              ml: 2,
            }}
          >
            <Icon sx={{ fontSize: 28 }} />
          </Avatar>
        </Box>

        {change && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <Chip
              label={getChangeText()}
              size="small"
              color={getChangeColor()}
              sx={{
                fontSize: '0.75rem',
                fontWeight: 'bold',
              }}
            />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ ml: 1 }}
            >
              مقارنة بالشهر الماضي
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};