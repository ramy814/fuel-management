import { apiClient } from '../client';
import { Constant } from '../../types';

export const constantsAPI = {
  getAll: (): Promise<Constant[]> => 
    apiClient.get('/constants'),
  
  getByType: (type: string): Promise<Constant[]> => 
    apiClient.get(`/constants/type/${type}`),
  
  create: (data: Partial<Constant>): Promise<Constant> => 
    apiClient.post('/constants', data),
  
  update: (id: number, data: Partial<Constant>): Promise<Constant> => 
    apiClient.put(`/constants/${id}`, data),
  
  delete: (id: number): Promise<void> => 
    apiClient.delete(`/constants/${id}`),
};