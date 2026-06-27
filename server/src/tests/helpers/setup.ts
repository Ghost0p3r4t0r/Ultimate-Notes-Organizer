import { PrismaClient } from '@prisma/client';
import { signAccessToken } from '../../utils/jwt';

const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

beforeEach(async () => {
  const tablenames = await prisma.$queryRaw<Array<{ tablename: string }>>`
    SELECT tablename FROM pg_tables WHERE schemaname='public'
  `;
  for (const { tablename } of tablenames) {
    if (tablename !== '_prisma_migrations') {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE "public"."${tablename}" CASCADE;`);
    }
  }
});

export { prisma };

export function createAuthToken(userId: string): string {
  return signAccessToken(userId);
}

export function buildAuthHeader(token: string): { Authorization: string } {
  return { Authorization: `Bearer ${token}` };
}
