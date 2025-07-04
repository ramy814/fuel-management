import { apiClient } from '../client';
import { Station } from '../../types';

export const stationsAPI = {
  getAll: (): Promise<Station[]> => 
    apiClient.get('/stations'),
  
  getById: (id: number): Promise<Station> => 
    apiClient.get(`/stations/${id}`),
  
  create: (data: Partial<Station>): Promise<Station> => 
    apiClient.post('/stations', data),
  
  update: (id: number, data: Partial<Station>): Promise<Station> => 
    apiClient.put(`/stations/${id}`, data),
  
  delete: (id: number): Promise<void> => 
    apiClient.delete(`/stations/${id}`),
  
  getHierarchy: (): Promise<Station[]> => 
    apiClient.get('/stations/hierarchy'),
};