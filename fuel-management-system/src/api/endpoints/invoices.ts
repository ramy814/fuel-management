import { apiClient } from '../client';
import { GasBill, GasBillFilters, PaginatedResponse, CreateGasBillDTO, UpdateGasBillDTO } from '../../types';

export const invoicesAPI = {
  getAll: (params?: GasBillFilters): Promise<PaginatedResponse<GasBill>> => 
    apiClient.get('/gas-bills', { params }),
  
  getById: (id: number): Promise<GasBill> => 
    apiClient.get(`/gas-bills/${id}`),
  
  create: (data: CreateGasBillDTO): Promise<GasBill> => 
    apiClient.post('/gas-bills', data),
  
  update: (id: number, data: UpdateGasBillDTO): Promise<GasBill> => 
    apiClient.put(`/gas-bills/${id}`, data),
  
  delete: (id: number): Promise<void> => 
    apiClient.delete(`/gas-bills/${id}`),
  
  getSummary: (params?: { month?: number; year?: number }): Promise<any> => 
    apiClient.get('/gas-bills/summary', { params }),
  
  exportToExcel: (params?: GasBillFilters): Promise<Blob> => 
    apiClient.get('/gas-bills/export/excel', { params, responseType: 'blob' }),
  
  exportToPDF: (params?: GasBillFilters): Promise<Blob> => 
    apiClient.get('/gas-bills/export/pdf', { params, responseType: 'blob' }),
};