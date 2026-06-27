import api from '@/services/api';

interface SearchResult {
  id: string;
  type: 'collection' | 'item' | 'tag' | 'note';
  title: string;
  subtitle?: string;
  collectionId?: string;
  collectionName?: string;
  url: string;
}

interface SearchResponse {
  results: SearchResult[];
  total: number;
}

export const searchApi = {
  async globalSearch(query: string): Promise<SearchResult[]> {
    if (!query.trim()) return [];
    const { data } = await api.get<SearchResponse>('/search', { params: { q: query, limit: 15 } });
    return data.results;
  },
};
