import api from './api';
import type { ApiResponse, AuthTokens, User } from '@/types';

interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/login', { email, password });
    return data.data!;
  },

  async register(email: string, password: string, name: string): Promise<AuthResponse> {
    const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/register', { email, password, name });
    return data.data!;
  },

  async logout(refreshToken: string): Promise<void> {
    await api.post('/auth/logout', { refreshToken });
  },

  async getProfile(): Promise<User> {
    const { data } = await api.get<ApiResponse<User>>('/auth/profile');
    return data.data!;
  },

  async refresh(refreshToken: string): Promise<AuthTokens> {
    const { data } = await api.post<ApiResponse<AuthTokens>>('/auth/refresh', { refreshToken });
    return data.data!;
  },
};
