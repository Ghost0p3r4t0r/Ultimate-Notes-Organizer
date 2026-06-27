import { collectionRepository } from '../repositories/collection';
import { NotFoundError } from '../utils/errors';

function formatCollection(collection: any) {
  return {
    id: collection.id,
    name: collection.name,
    description: collection.description,
    icon: collection.icon,
    themeColor: collection.themeColor,
    coverImage: collection.coverImage,
    fields: collection.fields.map((f: any) => ({
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
    itemCount: collection._count?.items ?? 0,
    createdAt: collection.createdAt.toISOString(),
    updatedAt: collection.updatedAt.toISOString(),
  };
}

export const collectionService = {
  async list(userId: string) {
    const collections = await collectionRepository.findAll(userId);
    return collections.map(formatCollection);
  },

  async getById(id: string, userId: string) {
    const collection = await collectionRepository.findById(id, userId);
    if (!collection) throw new NotFoundError('Collection not found');
    return formatCollection(collection);
  },

  async create(data: { name: string; description?: string; icon?: string; themeColor?: string; coverImage?: string; fields?: Array<{ name: string; type: string; required: boolean; placeholder?: string; defaultValue?: any; validation?: any; displayOptions?: any; order: number }> }, userId: string) {
    const collection = await collectionRepository.create({ ...data, userId });
    if (data.fields && data.fields.length > 0) {
      await collectionRepository.replaceFields(collection.id, data.fields);
    }
    return formatCollection(collection);
  },

  async update(id: string, userId: string, data: { name?: string; description?: string; icon?: string; themeColor?: string; coverImage?: string; fields?: Array<{ name: string; type: string; required: boolean; placeholder?: string; defaultValue?: any; validation?: any; displayOptions?: any; order: number }> }) {
    const existing = await collectionRepository.findById(id, userId);
    if (!existing) throw new NotFoundError('Collection not found');

    const collection = await collectionRepository.update(id, userId, data);
    if (data.fields) {
      await collectionRepository.replaceFields(id, data.fields);
      const updated = await collectionRepository.findById(id, userId);
      if (updated) return formatCollection(updated);
    }
    return formatCollection(collection);
  },

  async delete(id: string, userId: string) {
    const existing = await collectionRepository.findById(id, userId);
    if (!existing) throw new NotFoundError('Collection not found');
    await collectionRepository.delete(id, userId);
  },
};
