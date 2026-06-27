import { Response, NextFunction } from 'express';
import { itemService } from '../services/item';
import { searchService } from '../services/search';
import { createItemSchema, updateItemSchema } from '../validators/item';
import { itemFilterQuerySchema } from '../validators/search';
import { AuthRequest } from '../types';
import httpStatus from 'http-status';

export const itemController = {
  async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { collectionId } = req.params;
      const query = itemFilterQuerySchema.parse(req.query);

      if (query.filters) {
        const result = await searchService.filterItems(collectionId, req.userId!, query);
        res.json({
          success: true,
          items: result.items.map((item: any) => ({
            id: item.id,
            collectionId: item.collectionId,
            fieldValues: item.fieldValues as Record<string, any>,
            images: item.media,
            tags: item.tags.map((t: any) => ({ id: t.tag.id, name: t.tag.name, color: t.tag.color })),
            noteCount: item._count.notes,
            mediaCount: item._count.media,
            favorite: item.favorite,
            archived: item.archived,
            createdAt: item.createdAt.toISOString(),
            updatedAt: item.updatedAt.toISOString(),
          })),
          total: result.total,
          page: result.page,
          limit: result.limit,
        });
      } else {
        const result = await itemService.list(collectionId, req.userId!, query);
        res.json({ success: true, ...result });
      }
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
