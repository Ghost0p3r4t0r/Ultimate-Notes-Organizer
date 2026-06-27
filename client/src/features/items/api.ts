import api from '@/services/api';
import type { Item, ItemDetail, PaginatedItems } from './types';
import type { ApiResponse } from '@/types';

export const itemsApi = {
  async list(collectionId: string, params?: { page?: number; limit?: number; sort?: string; order?: string; search?: string }): Promise<PaginatedItems> {
    const { data } = await api.get(`/items/collection/${collectionId}`, { params });
    return data;
  },

  async getById(id: string): Promise<ItemDetail> {
    const { data } = await api.get<ApiResponse<ItemDetail>>(`/items/${id}`);
    return data.data!;
  },

  async create(body: { collectionId: string; fieldValues: Record<string, any> }): Promise<Item> {
    const { data } = await api.post<ApiResponse<Item>>('/items', body);
    return data.data!;
  },

  async update(id: string, body: { fieldValues?: Record<string, any>; favorite?: boolean; archived?: boolean }): Promise<Item> {
    const { data } = await api.put<ApiResponse<Item>>(`/items/${id}`, body);
    return data.data!;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/items/${id}`);
  },
};
