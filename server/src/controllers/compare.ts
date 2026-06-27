import { Response, NextFunction } from 'express';
import { compareService } from '../services/compare';
import { compareQuerySchema } from '../validators/compare';
import { AuthRequest } from '../types';

export const compareController = {
  async compare(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { ids } = compareQuerySchema.parse(req.query);
      const itemIds = ids.split(',').map((id: string) => id.trim()).filter(Boolean);
      const result = await compareService.compare(req.userId!, itemIds);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
};
