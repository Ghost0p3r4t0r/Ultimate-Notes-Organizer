import { Response, NextFunction } from 'express';
import { itemService } from '../services/item';
import { createItemSchema, updateItemSchema, listItemsQuerySchema } from '../validators/item';
import { AuthRequest } from '../types';
import httpStatus from 'http-status';

export const itemController = {
  async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { collectionId } = req.params;
      const query = listItemsQuerySchema.parse(req.query);
      const result = await itemService.list(collectionId, req.userId!, query);
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  },

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const item = await itemService.getById(req.params.id, req.userId!);
      res.json({ success: true, data: item });
    } catch (error) {
      next(error);
    }
  },

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = createItemSchema.parse(req.body);
      const item = await itemService.create(data, req.userId!);
      res.status(httpStatus.CREATED).json({ success: true, data: item });
    } catch (error) {
      next(error);
    }
  },

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = updateItemSchema.parse(req.body);
      const item = await itemService.update(req.params.id, req.userId!, data);
      res.json({ success: true, data: item });
    } catch (error) {
      next(error);
    }
  },

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await itemService.delete(req.params.id, req.userId!);
      res.json({ success: true, message: 'Item deleted' });
    } catch (error) {
      next(error);
    }
  },
};
