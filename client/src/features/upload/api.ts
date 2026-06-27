import api from '@/services/api';

interface UploadedMedia {
  id: string;
  itemId: string | null;
  url: string;
  thumbnailUrl: string | null;
  filename: string;
  mimeType: string;
  size: number;
  width: number | null;
  height: number | null;
  createdAt: string;
}

export const uploadApi = {
  async uploadFiles(files: File[], itemId?: string): Promise<UploadedMedia[]> {
    const formData = new FormData();
    files.forEach((f) => formData.append('files', f));
    if (itemId) formData.append('itemId', itemId);
    const { data } = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
  },

  async listByItem(itemId: string): Promise<UploadedMedia[]> {
    const { data } = await api.get(`/upload/item/${itemId}`);
    return data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/upload/${id}`);
  },
};
