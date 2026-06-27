import api from '@/services/api';

export interface FavoriteItem {
  id: string;
  collectionId: string;
  collectionName: string;
  fieldValues: Record<string, any>;
  images: Array<{ id: string; url: string; thumbnailUrl: string | null }>;
  tags: Array<{ id: string; name: string; color: string | null }>;
  noteCount: number;
  mediaCount: number;
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
  favoritedAt: string;
}

export const favoritesApi = {
  async list(): Promise<FavoriteItem[]> {
    const { data } = await api.get('/favorites');
    return data.data;
  },

  async toggle(itemId: string): Promise<{ favorited: boolean }> {
    const { data } = await api.post(`/favorites/${itemId}/toggle`);
    return data.data;
  },
};
