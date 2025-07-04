import { apiClient } from '../client';
import { Constant } from '../../types';
import { MockApiService } from '../../utils/mockApi';

const useMockApi = import.meta.env.VITE_MOCK_API === 'true' || import.meta.env.DEV;

export const constantsAPI = {
  getAll: async (): Promise<Constant[]> => {
    if (useMockApi) {
      const response = await MockApiService.getConstants();
      return response.data;
    }
    return apiClient.get('/constants');
  },
  
  getByType: (type: string): Promise<Constant[]> => 
    apiClient.get(`/constants/type/${type}`),
  
  create: (data: Partial<Constant>): Promise<Constant> => 
    apiClient.post('/constants', data),
  
  update: (id: number, data: Partial<Constant>): Promise<Constant> => 
    apiClient.put(`/constants/${id}`, data),
  
  delete: (id: number): Promise<void> => 
    apiClient.delete(`/constants/${id}`),
};