import { Response, NextFunction } from 'express';
import { collectionService } from '../services/collection';
import { createCollectionSchema, updateCollectionSchema } from '../validators/collection';
import { AuthRequest } from '../types';
import httpStatus from 'http-status';

export const collectionController = {
  async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const collections = await collectionService.list(req.userId!);
      res.json({ success: true, data: collections });
    } catch (error) {
      next(error);
    }
  },

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const collection = await collectionService.getById(req.params.id, req.userId!);
      res.json({ success: true, data: collection });
    } catch (error) {
      next(error);
    }
  },

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = createCollectionSchema.parse(req.body);
      const collection = await collectionService.create(data, req.userId!);
      res.status(httpStatus.CREATED).json({ success: true, data: collection });
    } catch (error) {
      next(error);
    }
  },

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = updateCollectionSchema.parse(req.body);
      const collection = await collectionService.update(req.params.id, req.userId!, data);
      res.json({ success: true, data: collection });
    } catch (error) {
      next(error);
    }
  },

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await collectionService.delete(req.params.id, req.userId!);
      res.json({ success: true, message: 'Collection deleted' });
    } catch (error) {
      next(error);
    }
  },
};
