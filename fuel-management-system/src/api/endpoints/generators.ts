import { apiClient } from '../client';
import { Generator, CreateGeneratorDTO, UpdateGeneratorDTO, FuelLog } from '../../types';
import { MockApiService } from '../../utils/mockApi';

const useMockApi = import.meta.env.VITE_MOCK_API === 'true' || import.meta.env.DEV;

export const generatorsAPI = {
  getAll: async (): Promise<Generator[]> => {
    if (useMockApi) {
      const response = await MockApiService.getGenerators();
      return response.data;
    }
    return apiClient.get('/generators');
  },
  
  getById: (id: number): Promise<Generator> => 
    apiClient.get(`/generators/${id}`),
  
  create: (data: CreateGeneratorDTO): Promise<Generator> => 
    apiClient.post('/generators', data),
  
  update: (id: number, data: UpdateGeneratorDTO): Promise<Generator> => 
    apiClient.put(`/generators/${id}`, data),
  
  delete: (id: number): Promise<void> => 
    apiClient.delete(`/generators/${id}`),
  
  getFuelLogs: (id: number): Promise<FuelLog[]> => 
    apiClient.get(`/generators/${id}/fuel-logs`),
};