import apiRequest from './axios';
import {
  LoginResponseSchema,
  loginUserSchema,
  forgotPasswordResponseSchema,
  verifyResetCodeResponseSchema,
  resetPasswordResponseSchema,
} from '../../schemas/authSchema';
import type {
  LoginRequest,
  LoginResponse,
  LoginUser,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  VerifyResetCodeRequest,
  VerifyResetCodeResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from '../../schemas/authSchema';

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiRequest.post('/api/login', credentials);
    return LoginResponseSchema.parse(response.data);
  },

  logout: () => {
    localStorage.removeItem('access_token');
  },

  me: async (): Promise<LoginUser> => {
    const response = await apiRequest.get('/api/me');
    return loginUserSchema.parse(response.data);
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

  forgotPassword: async (data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> => {
    const response = await apiRequest.post('/api/forgot-password', data);
    return forgotPasswordResponseSchema.parse(response.data);
  },

  verifyResetCode: async (data: VerifyResetCodeRequest): Promise<VerifyResetCodeResponse> => {
    const response = await apiRequest.post('/api/verify-reset-code', data);
    return verifyResetCodeResponseSchema.parse(response.data);
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
    const response = await apiRequest.post('/api/reset-password', data);
    return resetPasswordResponseSchema.parse(response.data);
  },
};
