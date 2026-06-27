import api from '@/services/api';

interface ImportResult {
  imported: number;
  errors: Array<{ row: number; message: string }>;
}

interface ExportPreview {
  fields: Array<{ id: string; name: string; type: string }>;
  totalItems: number;
  preview: Array<{ id: string; fieldValues: Record<string, any> }>;
}

export const importExportApi = {
  async importData(collectionId: string, file: File, columnMapping: Record<string, string>): Promise<ImportResult> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('collectionId', collectionId);
    formData.append('columnMapping', JSON.stringify(columnMapping));
    const { data } = await api.post('/import-export/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 120000,
    });
    return data.data;
  },

  async getExportPreview(collectionId: string): Promise<ExportPreview> {
    const { data } = await api.get('/import-export/export-preview', { params: { collectionId } });
    return data.data;
  },

  async exportData(collectionId: string, format: 'csv' | 'json' | 'xlsx', fieldIds: string[]): Promise<void> {
    const response = await api.get('/import-export/export', {
      params: { collectionId, format, fieldIds: fieldIds.join(',') },
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    const disposition = response.headers['content-disposition'];
    const filename = disposition ? disposition.split('filename=')[1]?.replace(/"/g, '') : `export.${format}`;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};
