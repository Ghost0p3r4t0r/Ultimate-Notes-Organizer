import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Folder, MoreHorizontal, Pencil, Trash2, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Collection } from '../types';
import { Link } from 'react-router-dom';

interface CollectionCardProps {
  collection: Collection;
  onEdit: (collection: Collection) => void;
  onDelete: (collection: Collection) => void;
}

export function CollectionCard({ collection, onEdit, onDelete }: CollectionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="group relative overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5">
        <div
          className="absolute inset-0 opacity-5"
          style={{ backgroundColor: collection.themeColor || '#3b82f6' }}
        />
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg"
                style={{ backgroundColor: collection.themeColor || '#3b82f6', color: '#fff' }}
              >
                <Folder className="h-5 w-5" />
              </div>
              <div>
                <Link to={`/collections/${collection.id}`} className="font-semibold hover:underline">
                  {collection.name}
                </Link>
                {collection.description && (
                  <p className="text-xs text-muted-foreground line-clamp-1">{collection.description}</p>
                )}
              </div>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(collection)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => onDelete(collection)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs">
              {collection.itemCount} {collection.itemCount === 1 ? 'item' : 'items'}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {collection.fields.length} fields
            </Badge>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
