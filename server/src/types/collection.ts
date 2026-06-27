export interface FieldOption {
  label: string;
  value: string;
}

export const FIELD_TYPES = [
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
