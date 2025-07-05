import axios, { AxiosInstance, AxiosError } from 'axios';
import { store } from '../store';
import { logout } from '../store/slices/authSlice';
import { showSnackbar } from '../store/slices/uiSlice';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL || '/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      withCredentials: true,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        const token = store.getState().auth.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && originalRequest) {
          store.dispatch(logout());
          store.dispatch(showSnackbar({
            message: 'جلسة العمل انتهت. يرجى تسجيل الدخول مرة أخرى',
            severity: 'error'
          }));
          
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }

        if (error.response?.status === 403) {
          store.dispatch(showSnackbar({
            message: 'ليس لديك صلاحية للوصول إلى هذا المورد',
            severity: 'error'
          }));
        }

        if (error.response && error.response.status >= 500) {
          store.dispatch(showSnackbar({
            message: 'حدث خطأ في الخادم. يرجى المحاولة مرة أخرى',
            severity: 'error'
          }));
        }

        return Promise.reject(error);
      }
    );
  }

  public get<T>(url: string, config?: any): Promise<T> {
    return this.client.get(url, config).then(response => response.data);
  }

  public post<T>(url: string, data?: any, config?: any): Promise<T> {
    return this.client.post(url, data, config).then(response => response.data);
  }

  public put<T>(url: string, data?: any, config?: any): Promise<T> {
    return this.client.put(url, data, config).then(response => response.data);
  }

  public patch<T>(url: string, data?: any, config?: any): Promise<T> {
    return this.client.patch(url, data, config).then(response => response.data);
  }

  public delete<T>(url: string, config?: any): Promise<T> {
    return this.client.delete(url, config).then(response => response.data);
  }

  public getAxiosInstance(): AxiosInstance {
    return this.client;
  }
}

export const apiClient = new ApiClient();
export default apiClient;