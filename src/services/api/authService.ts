import apiRequest from './axios';
import { LoginResponseSchema, meResponseSchema } from '../../schemas/authSchema';
import type { LoginRequest, LoginResponse, MeResponse } from '../../schemas/authSchema';

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiRequest.post('/api/login', credentials);
    return LoginResponseSchema.parse(response.data);
  },

  logout: () => {
    localStorage.removeItem('access_token');
  },

  me: async (): Promise<MeResponse> => {
    const response = await apiRequest.get('/api/me');
    return meResponseSchema.parse(response.data);
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
