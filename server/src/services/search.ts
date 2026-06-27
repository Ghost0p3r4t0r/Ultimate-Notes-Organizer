import prisma from '../utils/prisma';

interface SearchResult {
  id: string;
  type: 'collection' | 'item' | 'tag' | 'note';
  title: string;
  subtitle?: string;
  collectionId?: string;
  collectionName?: string;
  url: string;
}

export const searchService = {
  async globalSearch(query: string, userId: string, page: number, limit: number) {
    if (!query || query.length < 1) {
      return { results: [], total: 0 };
    }

    const searchTerm = `%${query}%`;

    const [collections, items, tags] = await Promise.all([
      prisma.collection.findMany({
        where: {
          userId,
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        select: { id: true, name: true, description: true },
        take: 5,
      }),
      prisma.item.findMany({
        where: {
          collection: { userId },
          OR: [
            { fieldValues: { path: ['$'], string_contains: query } },
          ],
        },
        include: { collection: { select: { name: true } } },
        take: 10,
      }),
      prisma.tag.findMany({
        where: { name: { contains: query, mode: 'insensitive' } },
        select: { id: true, name: true, color: true },
        take: 5,
      }),
    ]);

    const results: SearchResult[] = [
      ...collections.map((c) => ({
        id: c.id,
        type: 'collection' as const,
        title: c.name,
        subtitle: c.description || undefined,
        url: `/collections/${c.id}`,
      })),
      ...items.map((item) => {
        const firstValue = Object.values(item.fieldValues as Record<string, any>).find((v) => typeof v === 'string' && v.length > 0);
        return {
          id: item.id,
          type: 'item' as const,
          title: String(firstValue || 'Untitled'),
          subtitle: `in ${item.collection.name}`,
          collectionId: item.collectionId,
          collectionName: item.collection.name,
          url: `/items/${item.id}`,
        };
      }),
      ...tags.map((t) => ({
        id: t.id,
        type: 'tag' as const,
        title: t.name,
        subtitle: 'Tag',
        url: `/collections`,
      })),
    ];

    return {
      results: results.slice(0, limit),
      total: results.length,
    };
  },

  async filterItems(collectionId: string, userId: string, params: {
    page: number; limit: number; sort?: string; order: 'asc' | 'desc';
    search?: string; filters?: string;
  }) {
    const collection = await prisma.collection.findFirst({
      where: { id: collectionId, userId },
      select: { fields: { select: { name: true }, orderBy: { order: 'asc' } } },
    });
    if (!collection) throw new Error('Collection not found');

    const skip = (params.page - 1) * params.limit;

    let filterConditions: any[] = [];

    if (params.search) {
      filterConditions.push({
        fieldValues: { path: '$', string_contains: params.search },
      });
    }

    if (params.filters) {
      try {
        const filterGroup = JSON.parse(params.filters);
        const parsedFilters = buildPrismaFilter(filterGroup, collection.fields.map(f => f.name));
        if (parsedFilters) {
          filterConditions.push(parsedFilters);
        }
      } catch {}
    }

    const where: any = {
      collectionId,
      ...(filterConditions.length > 0 ? { AND: filterConditions } : {}),
    };

    const orderBy: any = params.sort
      ? { fieldValues: { path: [params.sort], order: params.order } }
      : { createdAt: params.order };

    const [items, total] = await Promise.all([
      prisma.item.findMany({
        where,
        orderBy,
        skip,
        take: params.limit,
        include: {
          media: { take: 1 },
          tags: { include: { tag: true } },
          _count: { select: { notes: true, media: true } },
        },
      }),
      prisma.item.count({ where }),
    ]);

    return { items, total, page: params.page, limit: params.limit };
  },
};

function buildPrismaFilter(group: any, fieldNames: string[]): any {
  if (!group || !group.conditions?.length && !group.groups?.length) return null;

  const conditions: any[] = [];

  for (const cond of group.conditions || []) {
    const prismaCond = buildCondition(cond);
    if (prismaCond) conditions.push(prismaCond);
  }

  for (const g of group.groups || []) {
    const subFilter = buildPrismaFilter(g, fieldNames);
    if (subFilter) conditions.push(subFilter);
  }

  if (conditions.length === 0) return null;
  if (conditions.length === 1) return conditions[0];
  return { [group.logic === 'OR' ? 'OR' : 'AND']: conditions };
}

function buildCondition(cond: any): any {
  const { field, operator, value } = cond;
  const path = [field];

  switch (operator) {
    case 'eq': return { fieldValues: { path, equals: value } };
    case 'neq': return { NOT: { fieldValues: { path, equals: value } } };
    case 'gt': return { fieldValues: { path, gt: Number(value) } };
    case 'gte': return { fieldValues: { path, gte: Number(value) } };
    case 'lt': return { fieldValues: { path, lt: Number(value) } };
    case 'lte': return { fieldValues: { path, lte: Number(value) } };
    case 'contains': return { fieldValues: { path, string_contains: String(value) } };
    case 'notContains': return { NOT: { fieldValues: { path, string_contains: String(value) } } };
    case 'startsWith': return { fieldValues: { path, string_starts_with: String(value) } };
    case 'endsWith': return { fieldValues: { path, string_ends_with: String(value) } };
    case 'in': return { fieldValues: { path, in: Array.isArray(value) ? value : [value] } };
    case 'notIn': return { NOT: { fieldValues: { path, in: Array.isArray(value) ? value : [value] } } };
    case 'isEmpty': return { fieldValues: { path, equals: null } };
    case 'isNotEmpty': return { NOT: { fieldValues: { path, equals: null } } };
    default: return null;
  }
}
