import { z } from 'zod';

export const createItemSchema = z.object({
  collectionId: z.string(),
  fieldValues: z.record(z.any()).default({}),
});

export const updateItemSchema = z.object({
  fieldValues: z.record(z.any()).optional(),
  favorite: z.boolean().optional(),
  archived: z.boolean().optional(),
});

export const listItemsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).default('desc'),
  search: z.string().optional(),
});
