import { Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { getStorage } from '../utils/storage';
import prisma from '../utils/prisma';
import { AuthRequest } from '../types';

export const uploadController = {
  async uploadFiles(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { itemId } = req.body;
      const files = req.files as Express.Multer.File[] | undefined;

      if (!files || files.length === 0) {
        res.status(httpStatus.BAD_REQUEST).json({ success: false, message: 'No files provided' });
        return;
      }

      const storage = getStorage();
      const results = [];

      for (const file of files) {
        const saved = await storage.save(file.originalname, file.buffer, file.mimetype);

        const media = await prisma.media.create({
          data: {
            itemId: itemId || null,
            url: saved.url,
            thumbnailUrl: saved.thumbnailUrl,
            filename: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
            width: saved.width,
            height: saved.height,
          },
        });

        results.push(media);
      }

      res.status(httpStatus.CREATED).json({ success: true, data: results });
    } catch (error) {
      next(error);
    }
  },

  async deleteFile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const media = await prisma.media.findUnique({ where: { id } });
      if (!media) {
        res.status(httpStatus.NOT_FOUND).json({ success: false, message: 'File not found' });
        return;
      }

      const storage = getStorage();
      await storage.delete(media.url);
      await prisma.media.delete({ where: { id } });

      res.json({ success: true, message: 'File deleted' });
    } catch (error) {
      next(error);
    }
  },

  async listByItem(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { itemId } = req.params;
      const media = await prisma.media.findMany({
        where: { itemId },
        orderBy: { createdAt: 'desc' },
      });
      res.json({ success: true, data: media });
    } catch (error) {
      next(error);
    }
  },
};
