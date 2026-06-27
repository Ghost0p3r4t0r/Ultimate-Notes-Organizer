import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Star, Eye, Heart, ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { Item } from '../types';

interface FieldDef {
  id: string;
  name: string;
  type: string;
  order: number;
}

interface CardViewProps {
  items: Item[];
  fields: FieldDef[];
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
  onToggleFavorite: (item: Item) => void;
}

function findImage(item: Item): string | null {
  if (item.images && item.images.length > 0) {
    return item.images[0].thumbnailUrl || item.images[0].url;
  }
  const imageField = item.fieldValues && Object.entries(item.fieldValues).find(([, v]) => typeof v === 'string' && (v as string).match(/\.(jpg|jpeg|png|gif|webp)/i));
  return imageField ? String(imageField[1]) : null;
}

function getTitle(item: Item, fields: FieldDef[]): string {
  const firstField = fields[0];
  if (firstField && item.fieldValues?.[firstField.id]) {
    return String(item.fieldValues[firstField.id]).slice(0, 60);
  }
  return 'Untitled';
}

function getSubtitle(item: Item, fields: FieldDef[]): string {
  const secondField = fields[1];
  if (secondField && item.fieldValues?.[secondField.id]) {
    return String(item.fieldValues[secondField.id]).slice(0, 80);
  }
  return '';
}

export function CardView({ items, fields, onEdit, onDelete, onToggleFavorite }: CardViewProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <ImageIcon className="mb-4 h-12 w-12 text-muted-foreground/50" />
        <h3 className="mb-2 text-lg font-medium">No items to display</h3>
      </div>
    );
  }

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
      {items.map((item) => {
        const imageUrl = findImage(item);
        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="break-inside-avoid"
          >
            <Card className="group overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5">
              <Link to={`/items/${item.id}`}>
                {imageUrl ? (
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={imageUrl}
                      alt=""
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-[4/3] items-center justify-center bg-muted">
                    <ImageIcon className="h-10 w-10 text-muted-foreground/30" />
                  </div>
                )}
              </Link>
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <Link to={`/items/${item.id}`} className="font-medium text-sm hover:underline line-clamp-1">
                      {getTitle(item, fields)}
                    </Link>
                    {getSubtitle(item, fields) && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{getSubtitle(item, fields)}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); onToggleFavorite(item); }}
                    className={`shrink-0 transition-colors ${item.favorite ? 'text-yellow-500' : 'text-muted-foreground/30 hover:text-yellow-400'}`}
                  >
                    <Heart className="h-4 w-4" fill={item.favorite ? 'currentColor' : 'none'} />
                  </button>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex gap-1">
                    {item.tags?.slice(0, 2).map((tag: any) => (
                      <Badge key={tag.id || tag.name} variant="secondary" className="text-[10px] px-1.5 py-0">
                        {tag.name}
                      </Badge>
                    ))}
                    {item.tags?.length > 2 && (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">+{item.tags.length - 2}</Badge>
                    )}
                  </div>
                  <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-6 w-6" asChild>
                      <Link to={`/items/${item.id}`}><Eye className="h-3 w-3" /></Link>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onEdit(item)}>
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => onDelete(item)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
