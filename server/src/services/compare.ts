import prisma from '../utils/prisma';
import { NotFoundError } from '../utils/errors';

interface CompareField {
  fieldId: string;
  fieldName: string;
  fieldType: string;
  values: Array<{
    itemId: string;
    value: any;
    displayValue: string;
  }>;
  bestIndex?: number;
  allEqual: boolean;
  hasMissing: boolean;
  hasDifferences: boolean;
}

interface CompareResult {
  collection: { id: string; name: string };
  items: Array<{
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    images: Array<{ url: string; thumbnailUrl: string | null }>;
  }>;
  fields: CompareField[];
  totalItems: number;
  totalFields: number;
}

function getDisplayValue(value: any, type: string): string {
  if (value === null || value === undefined || value === '') return '\u2014';
  switch (type) {
    case 'boolean':
    case 'checkbox':
      return value ? '\u2713 Yes' : '\u2717 No';
    case 'rating':
      return '\u2605'.repeat(Math.min(Number(value), 5));
    case 'currency':
      return `\u20B9${Number(value).toLocaleString()}`;
    case 'date':
      return new Date(value).toLocaleDateString();
    case 'tags':
    case 'multiSelect':
      return Array.isArray(value) ? value.join(', ') : String(value);
    default:
      return String(value);
  }
}

function isNumericType(type: string): boolean {
  return ['number', 'currency', 'rating'].includes(type);
}

function isBetter(a: number, b: number, type: string): boolean {
  switch (type) {
    case 'rating':
      return a > b;
    case 'currency':
      return a < b;
    default:
      return a > b;
  }
}

export const compareService = {
  async compare(userId: string, itemIds: string[]) {
    if (itemIds.length < 2) {
      throw new Error('At least 2 items are required for comparison');
    }
    if (itemIds.length > 10) {
      throw new Error('Maximum 10 items can be compared at once');
    }

    const items = await prisma.item.findMany({
      where: { id: { in: itemIds }, collection: { userId } },
      include: {
        collection: true,
        media: { take: 1 },
      },
    });

    if (items.length === 0) throw new NotFoundError('Items not found');
    if (items.length !== itemIds.length) {
      throw new NotFoundError('Some items were not found');
    }

    const collectionId = items[0].collectionId;
    if (!items.every((i) => i.collectionId === collectionId)) {
      throw new Error('All items must belong to the same collection');
    }

    const collection = await prisma.collection.findUnique({
      where: { id: collectionId },
      include: { fields: { orderBy: { order: 'asc' } } },
    });
    if (!collection) throw new NotFoundError('Collection not found');

    const fields: CompareField[] = collection.fields.map((field) => {
      const values = items.map((item) => {
        const rawValue = (item.fieldValues as Record<string, any>)[field.id];
        return {
          itemId: item.id,
          value: rawValue,
          displayValue: getDisplayValue(rawValue, field.type),
        };
      });

      const numericValues = values.map((v) => Number(v.value));
      const hasMissing = values.some((v) => v.value === null || v.value === undefined || v.value === '');
      const uniqueValues = new Set(values.map((v) => v.displayValue));
      const allEqual = uniqueValues.size <= 1;
      const hasDifferences = uniqueValues.size > 1;

      let bestIndex: number | undefined;
      if (isNumericType(field.type) && !hasMissing) {
        const validNums = numericValues.filter((n) => !isNaN(n));
        if (validNums.length > 0) {
          const best = validNums.reduce((a, b) => isBetter(a, b, field.type) ? a : b);
          bestIndex = numericValues.indexOf(best);
        }
      }

      return {
        fieldId: field.id,
        fieldName: field.name,
        fieldType: field.type,
        values,
        bestIndex,
        allEqual,
        hasMissing,
        hasDifferences,
      };
    });

    const result: CompareResult = {
      collection: { id: collection.id, name: collection.name },
      items: items.map((item) => {
        const firstVal = Object.values(item.fieldValues as Record<string, any>).find(
          (v) => typeof v === 'string' && v.length > 0
        );
        return {
          id: item.id,
          title: String(firstVal || 'Untitled'),
          createdAt: item.createdAt.toISOString(),
          updatedAt: item.updatedAt.toISOString(),
          images: item.media.map((m) => ({ url: m.url, thumbnailUrl: m.thumbnailUrl })),
        };
      }),
      fields,
      totalItems: items.length,
      totalFields: fields.length,
    };

    return result;
  },
};
