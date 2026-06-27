export interface Item {
  id: string;
  collectionId: string;
  fieldValues: Record<string, any>;
  images: any[];
  tags: any[];
  pinnedNotes: any[];
  noteCount: number;
  mediaCount: number;
  favorite: boolean;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ItemDetail extends Item {
  collection: {
    id: string;
    name: string;
    fields: Array<{
      id: string;
      name: string;
      type: string;
      required: boolean;
      placeholder?: string;
      defaultValue?: any;
      validation?: any;
      displayOptions?: any;
      order: number;
    }>;
  };
  notes: any[];
}

export interface PaginatedItems {
  items: Item[];
  total: number;
  page: number;
  limit: number;
}
