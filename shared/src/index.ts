export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  limit: number;
}

export interface FieldDefinition {
  id: string;
  name: string;
  type: FieldType;
  required: boolean;
  placeholder?: string;
  defaultValue?: unknown;
  validation?: Record<string, unknown>;
  displayOptions?: Record<string, unknown>;
  order: number;
}

export type FieldType =
  | 'text'
  | 'longText'
  | 'number'
  | 'currency'
  | 'date'
  | 'time'
  | 'checkbox'
  | 'boolean'
  | 'dropdown'
  | 'multiSelect'
  | 'tags'
  | 'rating'
  | 'image'
  | 'gallery'
  | 'video'
  | 'pdf'
  | 'file'
  | 'email'
  | 'phone'
  | 'url'
  | 'address'
  | 'location'
  | 'color'
  | 'richText'
  | 'markdown'
  | 'json';

export interface Collection {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  themeColor?: string;
  coverImage?: string;
  fields: FieldDefinition[];
  createdAt: string;
  updatedAt: string;
}

export interface Item {
  id: string;
  collectionId: string;
  fieldValues: Record<string, unknown>;
  images: Media[];
  tags: Tag[];
  notes: Note[];
  favorite: boolean;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Media {
  id: string;
  url: string;
  thumbnailUrl?: string;
  filename: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  createdAt: string;
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
}

export interface Note {
  id: string;
  content: string;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}
