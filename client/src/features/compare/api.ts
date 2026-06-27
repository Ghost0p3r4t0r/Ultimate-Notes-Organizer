import api from '@/services/api';

interface CompareItem {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  images: Array<{ url: string; thumbnailUrl: string | null }>;
}

interface CompareFieldValue {
  itemId: string;
  value: any;
  displayValue: string;
}

interface CompareField {
  fieldId: string;
  fieldName: string;
  fieldType: string;
  values: CompareFieldValue[];
  bestIndex?: number;
  allEqual: boolean;
  hasMissing: boolean;
  hasDifferences: boolean;
}

interface CompareResponse {
  collection: { id: string; name: string };
  items: CompareItem[];
  fields: CompareField[];
  totalItems: number;
  totalFields: number;
}

export const compareApi = {
  async compare(itemIds: string[]): Promise<CompareResponse> {
    const { data } = await api.get('/compare', { params: { ids: itemIds.join(',') } });
    return data.data;
  },
};

export type { CompareResponse, CompareField, CompareItem, CompareFieldValue };
