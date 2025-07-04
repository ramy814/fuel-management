import { apiClient } from '../client';
import { FuelLog, FuelLogFilters, PaginatedResponse, CreateFuelLogDTO, UpdateFuelLogDTO } from '../../types';

export const fuelLogsAPI = {
  getAll: (params?: FuelLogFilters): Promise<PaginatedResponse<FuelLog>> => 
    apiClient.get('/fuel-logs', { params }),
  
  getById: (id: number): Promise<FuelLog> => 
    apiClient.get(`/fuel-logs/${id}`),
  
  create: (data: CreateFuelLogDTO): Promise<FuelLog> => 
    apiClient.post('/fuel-logs', data),
  
  update: (id: number, data: UpdateFuelLogDTO): Promise<FuelLog> => 
    apiClient.put(`/fuel-logs/${id}`, data),
  
  delete: (id: number): Promise<void> => 
    apiClient.delete(`/fuel-logs/${id}`),
  
  getRecent: (limit: number = 10): Promise<FuelLog[]> => 
    apiClient.get(`/fuel-logs/recent?limit=${limit}`),
  
  getConsumptionStats: (params?: { dateFrom?: string; dateTo?: string }): Promise<any> => 
    apiClient.get('/fuel-logs/consumption-stats', { params }),
  
  exportToExcel: (params?: FuelLogFilters): Promise<Blob> => 
    apiClient.get('/fuel-logs/export/excel', { params, responseType: 'blob' }),
};