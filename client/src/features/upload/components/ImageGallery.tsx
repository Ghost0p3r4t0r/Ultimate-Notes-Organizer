import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, ZoomIn, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MediaItem {
  id: string;
  url: string;
  thumbnailUrl: string | null;
  filename: string;
  mimeType: string;
  size: number;
  width: number | null;
  height: number | null;
  createdAt: string;
}

interface ImageGalleryProps {
  items: MediaItem[];
  onDelete?: (id: string) => void;
  readOnly?: boolean;
}

export function ImageGallery({ items, onDelete, readOnly }: ImageGalleryProps) {
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  if (items.length === 0) return null;

  const previewItem = previewIndex !== null ? items[previewIndex] : null;

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {items.map((item, index) => (
          <div key={item.id} className="group relative aspect-square overflow-hidden rounded-lg border bg-muted">
            <img
              src={item.thumbnailUrl || item.url}
              alt={item.filename}
              className="h-full w-full object-cover cursor-pointer transition-transform group-hover:scale-105"
              onClick={() => setPreviewIndex(index)}
            />
            {!readOnly && onDelete && (
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-7 w-7"
                  onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10 cursor-pointer"
              onClick={() => setPreviewIndex(index)}
            >
              <ZoomIn className="h-6 w-6 text-white drop-shadow-lg" />
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {previewItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
            onClick={() => setPreviewIndex(null)}
          >
            <button
              className="absolute top-4 right-4 text-white/80 hover:text-white"
              onClick={() => setPreviewIndex(null)}
            >
              <X className="h-6 w-6" />
            </button>

            {items.length > 1 && (
              <>
                <button
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewIndex(((previewIndex ?? 0) - 1 + items.length) % items.length);
                  }}
                >
                  <ChevronLeft className="h-8 w-8" />
                </button>
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewIndex(((previewIndex ?? 0) + 1) % items.length);
                  }}
                >
                  <ChevronRight className="h-8 w-8" />
                </button>
              </>
            )}

            <motion.div
              key={previewItem.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="max-h-[90vh] max-w-[90vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={previewItem.url}
                alt={previewItem.filename}
                className="max-h-[85vh] max-w-[85vw] rounded-lg object-contain"
              />
              <p className="mt-2 text-center text-sm text-white/70">{previewItem.filename}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
