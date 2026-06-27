import { z } from 'zod';

export const filterConditionSchema = z.object({
  field: z.string(),
  operator: z.enum(['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'between', 'contains', 'notContains', 'startsWith', 'endsWith', 'in', 'notIn', 'isEmpty', 'isNotEmpty']),
  value: z.any(),
});

export const filterGroupSchema: z.ZodType<any> = z.object({
  logic: z.enum(['AND', 'OR']).default('AND'),
  conditions: z.array(filterConditionSchema).default([]),
  groups: z.array(z.lazy(() => filterGroupSchema)).default([]),
});

export const searchQuerySchema = z.object({
  q: z.string().optional(),
  collectionId: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export const itemFilterQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).default('desc'),
  search: z.string().optional(),
  filters: z.string().optional(),
});
