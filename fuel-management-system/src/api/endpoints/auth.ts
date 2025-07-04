import { apiClient } from '../client';
import { LoginCredentials, AuthResponse, User } from '../../types';

export const authAPI = {
  login: (credentials: LoginCredentials): Promise<AuthResponse> => 
    apiClient.post('/auth/login', credentials),
  
  logout: (): Promise<void> => 
    apiClient.post('/auth/logout'),
  
  verifyToken: (): Promise<{ user: User }> => 
    apiClient.get('/auth/verify'),
  
  refreshToken: (): Promise<{ token: string }> => 
    apiClient.post('/auth/refresh'),
  
  changePassword: (data: { currentPassword: string; newPassword: string }): Promise<void> => 
    apiClient.post('/auth/change-password', data),
};