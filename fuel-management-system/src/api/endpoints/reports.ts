import { apiClient } from '../client';
import { ReportParams } from '../../types';

export const reportsAPI = {
  generateReport: (params: ReportParams): Promise<any> => 
    apiClient.get('/reports/generate', { params }),
  
  exportReport: (params: ReportParams): Promise<Blob> => 
    apiClient.get('/reports/export', { 
      params, 
      responseType: 'blob' 
    }),
  
  getVehicleConsumption: (params?: { 
    vehicleId?: number; 
    dateFrom?: string; 
    dateTo?: string; 
  }): Promise<any> => 
    apiClient.get('/reports/vehicle-consumption', { params }),
  
  getGeneratorConsumption: (params?: { 
    generatorId?: number; 
    dateFrom?: string; 
    dateTo?: string; 
  }): Promise<any> => 
    apiClient.get('/reports/generator-consumption', { params }),
  
  getInventoryReport: (params?: { 
    dateFrom?: string; 
    dateTo?: string; 
  }): Promise<any> => 
    apiClient.get('/reports/inventory', { params }),
  
  getMaintenanceReport: (params?: { 
    vehicleId?: number; 
    dateFrom?: string; 
    dateTo?: string; 
  }): Promise<any> => 
    apiClient.get('/reports/maintenance', { params }),
};