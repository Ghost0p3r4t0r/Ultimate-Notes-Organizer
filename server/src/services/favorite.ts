import { favoriteRepository } from '../repositories/favorite';

export const favoriteService = {
  async list(userId: string) {
    const favorites = await favoriteRepository.findAll(userId);
    return favorites.map((fav) => ({
      id: fav.item.id,
      collectionId: fav.item.collectionId,
      collectionName: fav.item.collection.name,
      fieldValues: fav.item.fieldValues as Record<string, any>,
      images: fav.item.media,
      tags: fav.item.tags.map((t) => ({ id: t.tag.id, name: t.tag.name, color: t.tag.color })),
      noteCount: fav.item._count.notes,
      mediaCount: fav.item._count.media,
      favorite: true,
      createdAt: fav.item.createdAt.toISOString(),
      updatedAt: fav.item.updatedAt.toISOString(),
      favoritedAt: fav.createdAt.toISOString(),
    }));
  },

  async toggle(userId: string, itemId: string) {
    return favoriteRepository.toggle(userId, itemId);
  },
};
