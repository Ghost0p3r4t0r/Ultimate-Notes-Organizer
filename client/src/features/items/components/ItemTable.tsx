import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Pencil, Trash2, Star, Eye, Archive } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { Item } from '../types';

interface FieldDef {
  id: string;
  name: string;
  type: string;
  order: number;
}

interface ItemTableProps {
  items: Item[];
  fields: FieldDef[];
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
  onToggleFavorite: (item: Item) => void;
}

function renderValue(value: any, type: string): string {
  if (value === null || value === undefined || value === '') return '—';
  if (type === 'boolean' || type === 'checkbox') return value ? '✓' : '✗';
  if (type === 'rating') return '★'.repeat(value) || '—';
  if (type === 'currency') return `₹${Number(value).toLocaleString()}`;
  if (type === 'tags' && Array.isArray(value)) return value.join(', ');
  if (type === 'multiSelect' && Array.isArray(value)) return value.join(', ');
  if (type === 'date') return new Date(value).toLocaleDateString();
  if (typeof value === 'object') return JSON.stringify(value).slice(0, 50);
  return String(value).slice(0, 60);
}

export function ItemTable({ items, fields, onEdit, onDelete, onToggleFavorite }: ItemTableProps) {
  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Archive className="mb-4 h-12 w-12 text-muted-foreground/50" />
          <h3 className="mb-2 text-lg font-medium">No items yet</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Add your first item to this collection.
          </p>
        </CardContent>
      </Card>
    );
  }

  const displayFields = fields.slice(0, 6);
  const hasMore = fields.length > 6;

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="w-10 px-3 py-3 text-left text-xs font-medium text-muted-foreground">
              <Star className="h-3.5 w-3.5" />
            </th>
            {displayFields.map((f) => (
              <th key={f.id} className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {f.name}
              </th>
            ))}
            {hasMore && (
              <th className="px-3 py-3 text-left text-xs font-medium text-muted-foreground">
                ...
              </th>
            )}
            <th className="w-24 px-3 py-3 text-right text-xs font-medium text-muted-foreground">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {items.map((item) => (
            <motion.tr
              key={item.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="group hover:bg-muted/30 transition-colors"
            >
              <td className="px-3 py-3">
                <button
                  type="button"
                  onClick={() => onToggleFavorite(item)}
                  className={`transition-colors ${item.favorite ? 'text-yellow-500' : 'text-muted-foreground/30 hover:text-yellow-400'}`}
                >
                  <Star className="h-3.5 w-3.5" fill={item.favorite ? 'currentColor' : 'none'} />
                </button>
              </td>
              {displayFields.map((f) => (
                <td key={f.id} className="max-w-[200px] truncate px-3 py-3 text-sm">
                  <Link to={`/items/${item.id}`} className="hover:underline">
                    {renderValue(item.fieldValues?.[f.id], f.type)}
                  </Link>
                </td>
              ))}
              {hasMore && (
                <td className="px-3 py-3 text-sm text-muted-foreground">
                  <Badge variant="outline" className="text-xs">+{fields.length - 6}</Badge>
                </td>
              )}
              <td className="px-3 py-3">
                <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                    <Link to={`/items/${item.id}`}><Eye className="h-3.5 w-3.5" /></Link>
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(item)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => onDelete(item)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
