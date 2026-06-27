import { Request } from 'express';

export interface AuthRequest extends Request {
  userId?: string;
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Collection {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  themeColor: string | null;
  coverImage: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CollectionField {
  id: string;
  collectionId: string;
  name: string;
  type: string;
  required: boolean;
  placeholder: string | null;
  defaultValue: unknown | null;
  validation: unknown | null;
  displayOptions: unknown | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Item {
  id: string;
  collectionId: string;
  fieldValues: Record<string, unknown>;
  favorite: boolean;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Media {
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

export interface Note {
  id: string;
  itemId: string;
  content: string;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string | null;
}

export interface Activity {
  id: string;
  userId: string | null;
  itemId: string | null;
  action: string;
  details: unknown | null;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}
