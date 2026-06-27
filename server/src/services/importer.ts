import { parse } from 'csv-parse/sync';
import * as XLSX from 'xlsx';
import prisma from '../utils/prisma';

interface ImportOptions {
  collectionId: string;
  columnMapping: Record<string, string>;
  fileBuffer: Buffer;
  mimeType: string;
}

interface ImportResult {
  imported: number;
  errors: Array<{ row: number; message: string }>;
}

function parseFile(buffer: Buffer, mimeType: string): Record<string, string>[] {
  if (mimeType === 'text/csv' || mimeType === 'application/vnd.ms-excel') {
    const content = buffer.toString('utf-8');
    return parse(content, { columns: true, skip_empty_lines: true, trim: true });
  }

  if (mimeType === 'application/json') {
    const content = buffer.toString('utf-8');
    return JSON.parse(content);
  }

  if (mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) throw new Error('No sheets found in Excel file');
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json<Record<string, string>>(sheet, { defval: '' });
    return jsonData;
  }

  throw new Error(`Unsupported file type: ${mimeType}`);
}

export const importerService = {
  async import(options: ImportOptions): Promise<ImportResult> {
    const { collectionId, columnMapping, fileBuffer, mimeType } = options;

    const collection = await prisma.collection.findUnique({
      where: { id: collectionId },
      include: { fields: true },
    });
    if (!collection) throw new Error('Collection not found');

    const records = parseFile(fileBuffer, mimeType);
    const result: ImportResult = { imported: 0, errors: [] };

    for (let i = 0; i < records.length; i++) {
      const row = records[i];
      const fieldValues: Record<string, any> = {};

      try {
        for (const [csvColumn, fieldId] of Object.entries(columnMapping)) {
          const field = collection.fields.find((f) => f.id === fieldId);
          if (!field) continue;

          let value: any = row[csvColumn];
          if (value === undefined || value === null || value === '') {
            fieldValues[fieldId] = null;
            continue;
          }

          switch (field.type) {
            case 'number':
            case 'currency':
              fieldValues[fieldId] = parseFloat(String(value).replace(/[₹,]/g, '')) || 0;
              break;
            case 'boolean':
            case 'checkbox':
              fieldValues[fieldId] = ['true', 'yes', '1', '✓', 'x'].includes(String(value).toLowerCase());
              break;
            case 'rating':
              fieldValues[fieldId] = parseInt(String(value), 10) || 0;
              break;
            case 'tags':
            case 'multiSelect':
              fieldValues[fieldId] = String(value).split(',').map((s: string) => s.trim()).filter(Boolean);
              break;
            default:
              fieldValues[fieldId] = String(value);
          }
        }

        await prisma.item.create({
          data: { collectionId, fieldValues },
        });

        result.imported++;
      } catch (err: any) {
        result.errors.push({ row: i + 1, message: err.message || 'Unknown error' });
      }
    }

    return result;
  },
};
