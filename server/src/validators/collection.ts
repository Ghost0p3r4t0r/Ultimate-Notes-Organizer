import { z } from 'zod';

const fieldTypes = [
  'text', 'longText', 'number', 'currency', 'date', 'time',
  'checkbox', 'boolean', 'dropdown', 'multiSelect', 'tags',
  'rating', 'image', 'gallery', 'video', 'pdf', 'file',
  'email', 'phone', 'url', 'address', 'location', 'color',
  'richText', 'markdown', 'json',
] as const;

export const fieldDefinitionSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Field name is required'),
  type: z.enum(fieldTypes),
  required: z.boolean().default(false),
  placeholder: z.string().optional(),
  defaultValue: z.any().optional(),
  validation: z.record(z.any()).optional(),
  displayOptions: z.record(z.any()).optional(),
  order: z.number().int().min(0),
});

export const createCollectionSchema = z.object({
  name: z.string().min(1, 'Collection name is required').max(200),
  description: z.string().max(1000).optional(),
  icon: z.string().optional(),
  themeColor: z.string().optional(),
  coverImage: z.string().optional(),
  fields: z.array(fieldDefinitionSchema).default([]),
});

export const updateCollectionSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  icon: z.string().optional(),
  themeColor: z.string().optional(),
  coverImage: z.string().optional(),
  fields: z.array(fieldDefinitionSchema).optional(),
});
