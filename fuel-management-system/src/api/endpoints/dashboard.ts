import { apiClient } from '../client';
import { DashboardStats } from '../../types';

export const dashboardAPI = {
  getStats: (): Promise<DashboardStats> => 
    apiClient.get('/dashboard/stats'),
  
  getRecentMovements: (limit: number = 10): Promise<any[]> => 
    apiClient.get(`/dashboard/recent-movements?limit=${limit}`),
  
  getConsumptionChart: (params?: { days?: number }): Promise<any> => 
    apiClient.get('/dashboard/consumption-chart', { params }),
  
  getInventoryGauges: (): Promise<any> => 
    apiClient.get('/dashboard/inventory-gauges'),
};