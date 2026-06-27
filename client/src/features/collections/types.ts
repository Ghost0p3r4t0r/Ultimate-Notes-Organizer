export interface FieldDefinition {
  id?: string;
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
  | 'text' | 'longText' | 'number' | 'currency' | 'date' | 'time'
  | 'checkbox' | 'boolean' | 'dropdown' | 'multiSelect' | 'tags'
  | 'rating' | 'image' | 'gallery' | 'video' | 'pdf' | 'file'
  | 'email' | 'phone' | 'url' | 'address' | 'location' | 'color'
  | 'richText' | 'markdown' | 'json';

export interface Collection {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  themeColor?: string;
  coverImage?: string;
  fields: FieldDefinition[];
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

export const FIELD_TYPE_OPTIONS = [
  { value: 'text', label: 'Text', icon: 'Type' },
  { value: 'longText', label: 'Long Text', icon: 'Text' },
  { value: 'number', label: 'Number', icon: 'Hash' },
  { value: 'currency', label: 'Currency', icon: 'DollarSign' },
  { value: 'date', label: 'Date', icon: 'Calendar' },
  { value: 'time', label: 'Time', icon: 'Clock' },
  { value: 'checkbox', label: 'Checkbox', icon: 'CheckSquare' },
  { value: 'boolean', label: 'Boolean', icon: 'ToggleLeft' },
  { value: 'dropdown', label: 'Dropdown', icon: 'ChevronDown' },
  { value: 'multiSelect', label: 'Multi Select', icon: 'List' },
  { value: 'tags', label: 'Tags', icon: 'Tags' },
  { value: 'rating', label: 'Rating', icon: 'Star' },
  { value: 'image', label: 'Image', icon: 'Image' },
  { value: 'gallery', label: 'Gallery', icon: 'Images' },
  { value: 'email', label: 'Email', icon: 'Mail' },
  { value: 'phone', label: 'Phone', icon: 'Phone' },
  { value: 'url', label: 'URL', icon: 'Link' },
  { value: 'color', label: 'Color', icon: 'Palette' },
] as const;
