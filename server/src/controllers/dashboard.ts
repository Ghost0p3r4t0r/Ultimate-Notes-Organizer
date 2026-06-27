import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import prisma from '../utils/prisma';

export const dashboardController = {
  async stats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;

      const [collections, items, media, favorites, recentItems] = await Promise.all([
        prisma.collection.count({ where: { userId } }),
        prisma.item.count({ where: { collection: { userId } } }),
        prisma.media.count({ where: { item: { collection: { userId } } } }),
        prisma.favorite.count({ where: { userId } }),
        prisma.item.findMany({
          where: { collection: { userId } },
          orderBy: { updatedAt: 'desc' },
          take: 5,
          include: {
            collection: { select: { name: true } },
            _count: { select: { media: true, notes: true } },
          },
        }),
      ]);

      // Per-collection stats for chart
      const collectionStats = await prisma.collection.findMany({
        where: { userId },
        select: {
          id: true,
          name: true,
          themeColor: true,
          _count: { select: { items: true } },
        },
        orderBy: { updatedAt: 'desc' },
      });

      // Recent activity
      const activities = await prisma.activity.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          item: { select: { id: true, fieldValues: true, collectionId: true } },
        },
      });

      res.json({
        success: true,
        data: {
          totalCollections: collections,
          totalItems: items,
          totalMedia: media,
          totalFavorites: favorites,
          collectionStats: collectionStats.map((c) => ({
            id: c.id,
            name: c.name,
            themeColor: c.themeColor,
            itemCount: c._count.items,
          })),
          recentItems: recentItems.map((item) => ({
            id: item.id,
            collectionId: item.collectionId,
            collectionName: item.collection.name,
            fieldValues: item.fieldValues,
            mediaCount: item._count.media,
            noteCount: item._count.notes,
            favorite: item.favorite,
            updatedAt: item.updatedAt.toISOString(),
          })),
          activities: activities.map((a) => ({
            id: a.id,
            action: a.action,
            details: a.details,
            itemId: a.itemId,
            collectionId: a.item?.collectionId,
            createdAt: a.createdAt.toISOString(),
          })),
        },
      });
    } catch (error) {
      next(error);
    }
  },
};
