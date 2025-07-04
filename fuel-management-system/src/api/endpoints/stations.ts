import { apiClient } from '../client';
import { Station } from '../../types';
import { MockApiService } from '../../utils/mockApi';

const useMockApi = import.meta.env.VITE_MOCK_API === 'true' || import.meta.env.DEV;

export const stationsAPI = {
  getAll: async (): Promise<Station[]> => {
    if (useMockApi) {
      const response = await MockApiService.getStations();
      return response.data;
    }
    return apiClient.get('/stations');
  },
  
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