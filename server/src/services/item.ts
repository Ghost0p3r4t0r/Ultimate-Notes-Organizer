import { itemRepository } from '../repositories/item';
import { collectionRepository } from '../repositories/collection';
import { NotFoundError } from '../utils/errors';

export const itemService = {
  async list(collectionId: string, userId: string, params: { page: number; limit: number; sort?: string; order: 'asc' | 'desc'; search?: string }) {
    const collection = await collectionRepository.findById(collectionId, userId);
    if (!collection) throw new NotFoundError('Collection not found');

    const result = await itemRepository.findAll({ collectionId, ...params });

    return {
      items: result.items.map((item) => ({
        id: item.id,
        collectionId: item.collectionId,
        fieldValues: item.fieldValues as Record<string, any>,
        images: item.media,
        tags: item.tags.map((t) => ({ id: t.tag.id, name: t.tag.name, color: t.tag.color })),
        pinnedNotes: item.notes,
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
    };
  },

  async getById(id: string, userId: string) {
    const item = await itemRepository.findById(id);
    if (!item) throw new NotFoundError('Item not found');
    if (item.collection.userId !== userId) throw new NotFoundError('Item not found');

    return {
      id: item.id,
      collectionId: item.collectionId,
      collection: {
        id: item.collection.id,
        name: item.collection.name,
        fields: item.collection.fields.map((f) => ({
          id: f.id,
          name: f.name,
          type: f.type,
          required: f.required,
          placeholder: f.placeholder,
          defaultValue: f.defaultValue,
          validation: f.validation,
          displayOptions: f.displayOptions,
          order: f.order,
        })),
      },
      fieldValues: item.fieldValues as Record<string, any>,
      images: item.media,
      tags: item.tags.map((t) => ({ id: t.tag.id, name: t.tag.name, color: t.tag.color })),
      notes: item.notes,
      noteCount: item._count.notes,
      mediaCount: item._count.media,
      favorite: item.favorite,
      archived: item.archived,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    };
  },

  async create(data: { collectionId: string; fieldValues: Record<string, any> }, userId: string) {
    const collection = await collectionRepository.findById(data.collectionId, userId);
    if (!collection) throw new NotFoundError('Collection not found');

    const item = await itemRepository.create(data);
    return item;
  },

  async update(id: string, userId: string, data: { fieldValues?: Record<string, any>; favorite?: boolean; archived?: boolean }) {
    const item = await itemRepository.findById(id);
    if (!item) throw new NotFoundError('Item not found');
    if (item.collection.userId !== userId) throw new NotFoundError('Item not found');

    return itemRepository.update(id, data);
  },

  async delete(id: string, userId: string) {
    const item = await itemRepository.findById(id);
    if (!item) throw new NotFoundError('Item not found');
    if (item.collection.userId !== userId) throw new NotFoundError('Item not found');

    await itemRepository.delete(id);
  },
};
