import { Response, NextFunction } from 'express';
import { importerService } from '../services/importer';
import { exporterService } from '../services/exporter';
import { AuthRequest } from '../types';
import httpStatus from 'http-status';
import prisma from '../utils/prisma';

export const importExportController = {
  async importData(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { collectionId, columnMapping } = req.body;
      const file = req.file;

      if (!file) {
        res.status(httpStatus.BAD_REQUEST).json({ success: false, message: 'No file uploaded' });
        return;
      }

      let mapping: Record<string, string>;
      try {
        mapping = typeof columnMapping === 'string' ? JSON.parse(columnMapping) : columnMapping;
      } catch {
        res.status(httpStatus.BAD_REQUEST).json({ success: false, message: 'Invalid column mapping' });
        return;
      }

      const result = await importerService.import({
        collectionId,
        columnMapping: mapping,
        fileBuffer: file.buffer,
        mimeType: file.mimetype,
      });

      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },

  async exportData(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { collectionId, format, fieldIds } = req.query;

      if (!collectionId || !format) {
        res.status(httpStatus.BAD_REQUEST).json({ success: false, message: 'collectionId and format are required' });
        return;
      }

      const exportResult = await exporterService.export({
        collectionId: collectionId as string,
        format: format as 'csv' | 'json' | 'xlsx',
        fieldIds: fieldIds ? (fieldIds as string).split(',') : [],
        userId: req.userId!,
      });

      res.setHeader('Content-Type', exportResult.mimeType);
      res.setHeader('Content-Disposition', `attachment; filename="${exportResult.filename}"`);
      res.send(exportResult.data);
    } catch (error) {
      next(error);
    }
  },

  async exportPreview(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { collectionId } = req.query;

      if (!collectionId) {
        res.status(httpStatus.BAD_REQUEST).json({ success: false, message: 'collectionId is required' });
        return;
      }

      const collection = await prisma.collection.findFirst({
        where: { id: collectionId as string, userId: req.userId! },
        include: { fields: { orderBy: { order: 'asc' } }, _count: { select: { items: true } } },
      });

      if (!collection) {
        res.status(httpStatus.NOT_FOUND).json({ success: false, message: 'Collection not found' });
        return;
      }

      const items = await prisma.item.findMany({
        where: { collectionId: collectionId as string },
        take: 3,
        orderBy: { createdAt: 'desc' },
      });

      res.json({
        success: true,
        data: {
          fields: collection.fields.map((f) => ({ id: f.id, name: f.name, type: f.type })),
          totalItems: collection._count.items,
          preview: items.map((item) => ({
            id: item.id,
            fieldValues: item.fieldValues,
          })),
        },
      });
    } catch (error) {
      next(error);
    }
  },
};
