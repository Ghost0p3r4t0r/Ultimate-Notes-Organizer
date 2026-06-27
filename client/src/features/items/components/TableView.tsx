import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Pencil, Trash2, Star, Eye, Archive, GripVertical } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { Item } from '../types';

interface FieldDef {
  id: string;
  name: string;
  type: string;
  order: number;
}

interface TableViewProps {
  items: Item[];
  fields: FieldDef[];
  visibleColumns: string[];
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
  onToggleFavorite: (item: Item) => void;
  selectedItems?: Set<string>;
  onSelectionChange?: (itemId: string, checked: boolean) => void;
}

function renderValue(value: any, type: string): string {
  if (value === null || value === undefined || value === '') return '—';
  if (type === 'boolean' || type === 'checkbox') return value ? '✓' : '✗';
  if (type === 'rating') return '★'.repeat(Math.min(value, 5)) || '—';
  if (type === 'currency') return `₹${Number(value).toLocaleString()}`;
  if (type === 'tags' && Array.isArray(value)) return value.join(', ');
  if (type === 'multiSelect' && Array.isArray(value)) return value.join(', ');
  if (type === 'date') return new Date(value).toLocaleDateString();
  if (typeof value === 'object') return JSON.stringify(value).slice(0, 50);
  return String(value).slice(0, 80);
}

export function TableView({ items, fields, visibleColumns, onEdit, onDelete, onToggleFavorite, selectedItems, onSelectionChange }: TableViewProps) {
  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Archive className="mb-4 h-12 w-12 text-muted-foreground/50" />
          <h3 className="mb-2 text-lg font-medium">No items yet</h3>
          <p className="mb-4 text-sm text-muted-foreground">Add your first item to this collection.</p>
        </CardContent>
      </Card>
    );
  }

  const displayFields = fields.filter((f) => visibleColumns.includes(f.id));

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="w-10 px-3 py-3 text-left text-xs font-medium text-muted-foreground">
              <Star className="h-3.5 w-3.5" />
            </th>
            {onSelectionChange && (
              <th className="w-10 px-3 py-3 text-left text-xs font-medium text-muted-foreground">
                <Checkbox
                  checked={selectedItems && selectedItems.size === items.length && items.length > 0}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      items.forEach((item) => onSelectionChange(item.id, true));
                    } else {
                      selectedItems?.forEach((id) => onSelectionChange(id, false));
                    }
                  }}
                />
              </th>
            )}
            {displayFields.map((f) => (
              <th key={f.id} className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                {f.name}
              </th>
            ))}
            <th className="w-24 px-3 py-3 text-right text-xs font-medium text-muted-foreground">Actions</th>
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
              {onSelectionChange && (
                <td className="px-3 py-3">
                  <Checkbox
                    checked={selectedItems?.has(item.id)}
                    onCheckedChange={(checked) => onSelectionChange(item.id, checked)}
                  />
                </td>
              )}
              {displayFields.map((f) => (
                <td key={f.id} className="max-w-[220px] truncate px-3 py-3 text-sm">
                  <Link to={`/items/${item.id}`} className="hover:underline block truncate">
                    {renderValue(item.fieldValues?.[f.id], f.type)}
                  </Link>
                </td>
              ))}
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
