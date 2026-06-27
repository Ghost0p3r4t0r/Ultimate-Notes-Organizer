import prisma from '../utils/prisma';

export const userRepository = {
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  async findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },

  async create(data: { email: string; password: string; name: string }) {
    return prisma.user.create({ data });
  },

  async update(id: string, data: { name?: string; avatar?: string }) {
    return prisma.user.update({ where: { id }, data });
  },
};
