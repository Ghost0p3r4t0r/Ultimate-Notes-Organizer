import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Star, Eye, ChevronRight, Archive } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { Item } from '../types';

interface FieldDef {
  id: string;
  name: string;
  type: string;
  order: number;
}

interface ListViewProps {
  items: Item[];
  fields: FieldDef[];
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
  onToggleFavorite: (item: Item) => void;
}

function renderValue(value: any, type: string): string {
  if (value === null || value === undefined || value === '') return '';
  if (type === 'boolean' || type === 'checkbox') return value ? '✓' : '✗';
  if (type === 'rating') return '★'.repeat(Math.min(value, 5));
  if (type === 'currency') return `₹${Number(value).toLocaleString()}`;
  if (type === 'date') return new Date(value).toLocaleDateString();
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value).slice(0, 50);
}

function getPrimaryValue(item: Item, fields: FieldDef[]): string {
  const f = fields[0];
  if (f && item.fieldValues?.[f.id]) return renderValue(item.fieldValues[f.id], f.type);
  return 'Untitled';
}

function getSecondaryValues(item: Item, fields: FieldDef[]): { name: string; value: string }[] {
  return fields.slice(1, 4).map((f) => ({
    name: f.name,
    value: renderValue(item.fieldValues?.[f.id], f.type),
  })).filter((v) => v.value);
}

export function ListView({ items, fields, onEdit, onDelete, onToggleFavorite }: ListViewProps) {
  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Archive className="mb-4 h-12 w-12 text-muted-foreground/50" />
          <h3 className="mb-2 text-lg font-medium">No items yet</h3>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item) => {
        const secondary = getSecondaryValues(item, fields);
        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="group transition-all hover:shadow-md">
              <CardContent className="flex items-center gap-3 p-3">
                <button
                  type="button"
                  onClick={() => onToggleFavorite(item)}
                  className={`shrink-0 transition-colors ${item.favorite ? 'text-yellow-500' : 'text-muted-foreground/30 hover:text-yellow-400'}`}
                >
                  <Star className="h-4 w-4" fill={item.favorite ? 'currentColor' : 'none'} />
                </button>
                <Link to={`/items/${item.id}`} className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{getPrimaryValue(item, fields)}</p>
                  {secondary.length > 0 && (
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
                      {secondary.map((s) => (
                        <span key={s.name} className="text-xs text-muted-foreground truncate">
                          <span className="text-muted-foreground/60">{s.name}:</span> {s.value}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
                <div className="flex items-center gap-1 shrink-0">
                  {item.tags?.slice(0, 1).map((tag: any) => (
                    <Badge key={tag.id || tag.name} variant="secondary" className="text-[10px] px-1.5 py-0 hidden sm:inline-flex">
                      {tag.name}
                    </Badge>
                  ))}
                  <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
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
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground/50 shrink-0" />
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
