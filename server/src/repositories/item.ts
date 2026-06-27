import prisma from '../utils/prisma';
import { Prisma } from '@prisma/client';

interface ListParams {
  collectionId: string;
  page: number;
  limit: number;
  sort?: string;
  order: 'asc' | 'desc';
  search?: string;
}

export const itemRepository = {
  async findAll({ collectionId, page, limit, sort, order, search }: ListParams) {
    const skip = (page - 1) * limit;

    const where: Prisma.ItemWhereInput = { collectionId };

    if (search) {
      where.OR = [
        { fieldValues: { path: ['$'], string_contains: search } },
      ];
    }

    const orderBy: Prisma.ItemOrderByWithRelationInput = sort
      ? { fieldValues: order }
      : { createdAt: order };

    const [items, total] = await Promise.all([
      prisma.item.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          media: true,
          tags: { include: { tag: true } },
          notes: { where: { pinned: true }, take: 3 },
          _count: { select: { notes: true, media: true } },
        },
      }),
      prisma.item.count({ where }),
    ]);

    return { items, total, page, limit };
  },

  async findById(id: string) {
    return prisma.item.findUnique({
      where: { id },
      include: {
        media: true,
        tags: { include: { tag: true } },
        notes: { orderBy: { createdAt: 'desc' } },
        collection: { include: { fields: { orderBy: { order: 'asc' } } } },
        _count: { select: { notes: true, media: true } },
      },
    });
  },

  async create(data: { collectionId: string; fieldValues: Record<string, any> }) {
    return prisma.item.create({
      data: {
        collectionId: data.collectionId,
        fieldValues: data.fieldValues || {},
      },
      include: {
        media: true,
        tags: { include: { tag: true } },
        collection: { include: { fields: { orderBy: { order: 'asc' } } } },
      },
    });
  },

  async update(id: string, data: { fieldValues?: Record<string, any>; favorite?: boolean; archived?: boolean }) {
    const updateData: any = {};
    if (data.fieldValues !== undefined) updateData.fieldValues = data.fieldValues;
    if (data.favorite !== undefined) updateData.favorite = data.favorite;
    if (data.archived !== undefined) updateData.archived = data.archived;

    return prisma.item.update({
      where: { id },
      data: updateData,
      include: {
        media: true,
        tags: { include: { tag: true } },
        collection: { include: { fields: { orderBy: { order: 'asc' } } } },
      },
    });
  },

  async delete(id: string) {
    return prisma.item.delete({ where: { id } });
  },

  async count(collectionId: string) {
    return prisma.item.count({ where: { collectionId } });
  },
};
