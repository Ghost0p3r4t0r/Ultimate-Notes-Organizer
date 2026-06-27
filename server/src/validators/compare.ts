import { z } from 'zod';

export const compareQuerySchema = z.object({
  ids: z.string().min(1, 'Item IDs are required'),
});
