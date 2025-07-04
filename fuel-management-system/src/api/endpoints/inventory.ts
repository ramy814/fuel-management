import { apiClient } from '../client';
import { GasStore } from '../../types';

export const inventoryAPI = {
  getCurrent: (): Promise<GasStore> => 
    apiClient.get('/gas-store/current'),
  
  getHistory: (params?: { dateFrom?: string; dateTo?: string }): Promise<GasStore[]> => 
    apiClient.get('/gas-store', { params }),
  
  create: (data: Partial<GasStore>): Promise<GasStore> => 
    apiClient.post('/gas-store', data),
  
  update: (id: number, data: Partial<GasStore>): Promise<GasStore> => 
    apiClient.put(`/gas-store/${id}`, data),
  
  getAlerts: (): Promise<any[]> => 
    apiClient.get('/gas-store/alerts'),
  
  getConsumptionChart: (params?: { days?: number }): Promise<any> => 
    apiClient.get('/gas-store/consumption-chart', { params }),
};