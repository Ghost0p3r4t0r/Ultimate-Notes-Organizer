import api from '@/services/api';

interface DashboardData {
  totalCollections: number;
  totalItems: number;
  totalMedia: number;
  totalFavorites: number;
  collectionStats: Array<{ id: string; name: string; themeColor: string | null; itemCount: number }>;
  recentItems: Array<{
    id: string; collectionId: string; collectionName: string;
    fieldValues: Record<string, any>; mediaCount: number; noteCount: number;
    favorite: boolean; updatedAt: string;
  }>;
  activities: Array<{ id: string; action: string; details: any; itemId: string | null; collectionId: string | null; createdAt: string }>;
}

export const dashboardApi = {
  async getStats(): Promise<DashboardData> {
    const { data } = await api.get('/dashboard');
    return data.data;
  },
};

export type { DashboardData };
