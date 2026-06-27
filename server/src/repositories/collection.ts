import prisma from '../utils/prisma';

export const collectionRepository = {
  async findAll(userId: string) {
    return prisma.collection.findMany({
      where: { userId },
      include: { fields: { orderBy: { order: 'asc' } }, _count: { select: { items: true } } },
      orderBy: { updatedAt: 'desc' },
    });
  },

  async findById(id: string, userId: string) {
    return prisma.collection.findFirst({
      where: { id, userId },
      include: { fields: { orderBy: { order: 'asc' } }, _count: { select: { items: true } } },
    });
  },

  async create(data: { name: string; description?: string; icon?: string; themeColor?: string; coverImage?: string; userId: string }) {
    return prisma.collection.create({ data });
  },

  async update(id: string, userId: string, data: { name?: string; description?: string; icon?: string; themeColor?: string; coverImage?: string }) {
    return prisma.collection.updateMany({ where: { id, userId }, data });
  },

  async delete(id: string, userId: string) {
    return prisma.collection.deleteMany({ where: { id, userId } });
  },

  async replaceFields(collectionId: string, fields: Array<{ name: string; type: string; required: boolean; placeholder?: string; defaultValue?: any; validation?: any; displayOptions?: any; order: number }>) {
    await prisma.collectionField.deleteMany({ where: { collectionId } });
    if (fields.length > 0) {
      return prisma.collectionField.createMany({ data: fields.map((f) => ({ ...f, collectionId })) });
    }
    return { count: 0 };
  },
};
