import { stringify } from 'csv-stringify/sync';
import * as XLSX from 'xlsx';
import prisma from '../utils/prisma';

interface ExportOptions {
  collectionId: string;
  format: 'csv' | 'json' | 'xlsx';
  fieldIds: string[];
  userId: string;
}

export const exporterService = {
  async export(options: ExportOptions): Promise<{ data: Buffer; filename: string; mimeType: string }> {
    const { collectionId, format, fieldIds, userId } = options;

    const collection = await prisma.collection.findFirst({
      where: { id: collectionId, userId },
      include: { fields: { orderBy: { order: 'asc' } } },
    });
    if (!collection) throw new Error('Collection not found');

    const selectedFields = collection.fields.filter((f) => fieldIds.includes(f.id));
    const displayFields = selectedFields.length > 0 ? selectedFields : collection.fields;

    const items = await prisma.item.findMany({
      where: { collectionId },
      orderBy: { createdAt: 'desc' },
    });

    const headers = ['ID', ...displayFields.map((f) => f.name), 'Created', 'Updated'];
    const rows = items.map((item) => {
      const values = item.fieldValues as Record<string, any>;
      return [
        item.id,
        ...displayFields.map((f) => {
          const val = values[f.id];
          if (val === null || val === undefined) return '';
          if (Array.isArray(val)) return val.join(', ');
          return String(val);
        }),
        item.createdAt.toISOString().split('T')[0],
        item.updatedAt.toISOString().split('T')[0],
      ];
    });

    const filename = `${collection.name.replace(/\s+/g, '_')}_export`;

    switch (format) {
      case 'csv': {
        const csvContent = stringify([headers, ...rows]);
        return { data: Buffer.from(csvContent), filename: `${filename}.csv`, mimeType: 'text/csv' };
      }

      case 'json': {
        const jsonItems = items.map((item) => {
          const values = item.fieldValues as Record<string, any>;
          const obj: Record<string, any> = { id: item.id };
          displayFields.forEach((f) => { obj[f.name] = values[f.id] ?? null; });
          obj.createdAt = item.createdAt.toISOString();
          obj.updatedAt = item.updatedAt.toISOString();
          return obj;
        });
        return { data: Buffer.from(JSON.stringify(jsonItems, null, 2)), filename: `${filename}.json`, mimeType: 'application/json' };
      }

      case 'xlsx': {
        const data = [headers, ...rows];
        const workbook = XLSX.utils.book_new();
        const sheet = XLSX.utils.aoa_to_sheet(data);
        XLSX.utils.book_append_sheet(workbook, sheet, 'Items');
        const xlsxBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
        return { data: xlsxBuffer, filename: `${filename}.xlsx`, mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' };
      }

      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  },
};
