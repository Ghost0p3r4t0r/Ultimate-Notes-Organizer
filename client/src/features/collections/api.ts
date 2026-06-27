import api from '@/services/api';
import type { Collection } from './types';
import type { ApiResponse } from '@/types';

export const collectionsApi = {
  async list(): Promise<Collection[]> {
    const { data } = await api.get<ApiResponse<Collection[]>>('/collections');
    return data.data!;
  },

  async getById(id: string): Promise<Collection> {
    const { data } = await api.get<ApiResponse<Collection>>(`/collections/${id}`);
    return data.data!;
  },

  async create(body: { name: string; description?: string; icon?: string; themeColor?: string; coverImage?: string; fields?: any[] }): Promise<Collection> {
    const { data } = await api.post<ApiResponse<Collection>>('/collections', body);
    return data.data!;
  },

  async update(id: string, body: Partial<{ name: string; description: string; icon: string; themeColor: string; coverImage: string; fields: any[] }>): Promise<Collection> {
    const { data } = await api.put<ApiResponse<Collection>>(`/collections/${id}`, body);
    return data.data!;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/collections/${id}`);
  },
};
