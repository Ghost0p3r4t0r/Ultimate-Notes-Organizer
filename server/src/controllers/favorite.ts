import { Response, NextFunction } from 'express';
import { favoriteService } from '../services/favorite';
import { AuthRequest } from '../types';

export const favoriteController = {
  async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const items = await favoriteService.list(req.userId!);
      res.json({ success: true, data: items });
    } catch (error) {
      next(error);
    }
  },

  async toggle(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { itemId } = req.params;
      const result = await favoriteService.toggle(req.userId!, itemId);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
};
