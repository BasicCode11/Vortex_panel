import apiRequest from './axios';
import { LoginRequest, LoginResponse } from '../types/auth';
import { UserRead } from '../types/user';


export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiRequest.post<LoginResponse>('/api/login', credentials);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('access_token');
  },
  me: async(): Promise<UserRead> => {
    const response = await apiRequest.get<UserRead>('/api/me');
    return response.data;
  },

  getToken: (): string | null => {
    return localStorage.getItem('access_token');
  },

  
  setToken: (token: string): void => {
    localStorage.setItem('access_token', token);
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('access_token');
  },
};
