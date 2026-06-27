import prisma from '../utils/prisma';

export const favoriteRepository = {
  async findAll(userId: string) {
    return prisma.favorite.findMany({
      where: { userId },
      include: {
        item: {
          include: {
            collection: { select: { id: true, name: true } },
            media: { take: 1 },
            tags: { include: { tag: true } },
            _count: { select: { notes: true, media: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async toggle(userId: string, itemId: string) {
    const existing = await prisma.favorite.findUnique({
      where: { userId_itemId: { userId, itemId } },
    });

    if (existing) {
      await prisma.favorite.delete({ where: { id: existing.id } });
      return { favorited: false };
    }

    await prisma.favorite.create({ data: { userId, itemId } });
    return { favorited: true };
  },

  async isFavorited(userId: string, itemId: string) {
    const fav = await prisma.favorite.findUnique({
      where: { userId_itemId: { userId, itemId } },
    });
    return !!fav;
  },
};
