import { apiClient } from '../client';
import { Vehicle, VehicleFilters, PaginatedResponse, CreateVehicleDTO, UpdateVehicleDTO, FuelLog } from '../../types';
import { MockApiService } from '../../utils/mockApi';

const useMockApi = import.meta.env.VITE_MOCK_API === 'true' || import.meta.env.DEV;

export const vehiclesAPI = {
  getAll: async (params?: VehicleFilters): Promise<PaginatedResponse<Vehicle>> => {
    if (useMockApi) {
      return await MockApiService.getVehicles(params);
    }
    return apiClient.get('/vehicles', { params });
  },
  
  getById: (id: number): Promise<Vehicle> => 
    apiClient.get(`/vehicles/${id}`),
  
  create: async (data: CreateVehicleDTO): Promise<Vehicle> => {
    if (useMockApi) {
      return await MockApiService.createVehicle(data);
    }
    return apiClient.post('/vehicles', data);
  },
  
  update: (id: number, data: UpdateVehicleDTO): Promise<Vehicle> => 
    apiClient.put(`/vehicles/${id}`, data),
  
  delete: (id: number): Promise<void> => 
    apiClient.delete(`/vehicles/${id}`),
  
  getFuelLogs: (id: number, params?: any): Promise<PaginatedResponse<FuelLog>> => 
    apiClient.get(`/vehicles/${id}/fuel-logs`, { params }),
  
  getMaintenanceHistory: (id: number): Promise<any[]> => 
    apiClient.get(`/vehicles/${id}/maintenance`),
  
  exportToExcel: (params?: VehicleFilters): Promise<Blob> => 
    apiClient.get('/vehicles/export/excel', { params, responseType: 'blob' }),
  
  exportToPDF: (params?: VehicleFilters): Promise<Blob> => 
    apiClient.get('/vehicles/export/pdf', { params, responseType: 'blob' }),
};