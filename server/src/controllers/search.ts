import { Response, NextFunction } from 'express';
import { searchService } from '../services/search';
import { searchQuerySchema } from '../validators/search';
import { AuthRequest } from '../types';

export const searchController = {
  async globalSearch(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const query = searchQuerySchema.parse(req.query);
      const results = await searchService.globalSearch(query.q || '', req.userId!, query.page, query.limit);
      res.json({ success: true, ...results });
    } catch (error) {
      next(error);
    }
  },
};
