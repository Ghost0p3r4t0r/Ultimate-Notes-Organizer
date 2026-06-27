import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, ImageIcon, ZoomIn } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import type { Item } from '../types';

interface GalleryViewProps {
  items: Item[];
  onToggleFavorite: (item: Item) => void;
}

function findItemImage(item: Item): { url: string; thumb: string | null } | null {
  if (item.images && item.images.length > 0) {
    return { url: item.images[0].url, thumb: item.images[0].thumbnailUrl };
  }
  return null;
}

export function GalleryView({ items, onToggleFavorite }: GalleryViewProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const itemsWithImages = items.filter((item) => findItemImage(item));

  if (itemsWithImages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <ImageIcon className="mb-4 h-16 w-16 text-muted-foreground/30" />
        <h3 className="mb-2 text-lg font-medium">No images to display</h3>
        <p className="text-sm text-muted-foreground">Items with images will appear here.</p>
      </div>
    );
  }

  return (
    <>
      <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-3 space-y-3">
        {itemsWithImages.map((item) => {
          const img = findItemImage(item)!;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="break-inside-avoid"
            >
              <div className="group relative overflow-hidden rounded-lg bg-muted cursor-pointer"
                onClick={() => setPreviewUrl(img.url)}
              >
                <img
                  src={img.thumb || img.url}
                  alt=""
                  className="w-full object-cover transition-transform group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onToggleFavorite(item); }}
                    className={`rounded-full p-1.5 backdrop-blur-sm transition-colors ${
                      item.favorite ? 'bg-yellow-500 text-white' : 'bg-black/40 text-white hover:bg-black/60'
                    }`}
                  >
                    <Heart className="h-4 w-4" fill={item.favorite ? 'currentColor' : 'none'} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setPreviewUrl(img.url); }}
                    className="rounded-full bg-black/40 p-1.5 text-white backdrop-blur-sm hover:bg-black/60"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link to={`/items/${item.id}`} className="text-sm font-medium text-white hover:underline line-clamp-1">
                    {item.fieldValues && Object.values(item.fieldValues).find((v) => typeof v === 'string' && v.length > 0 && v.length < 100) || 'View item'}
                  </Link>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {previewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" onClick={() => setPreviewUrl(null)}>
          <button className="absolute top-4 right-4 text-white/80 hover:text-white text-lg" onClick={() => setPreviewUrl(null)}>✕</button>
          <img src={previewUrl} alt="" className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </>
  );
}
