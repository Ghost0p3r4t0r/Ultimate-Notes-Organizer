import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { favoritesApi } from '../api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Heart, Folder, ImageIcon, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

export function FavoritesPage() {
  const { data: items, isLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: favoritesApi.list,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-red-500" fill="currentColor" />
            <h1 className="text-2xl font-bold tracking-tight">Favorites</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            {items?.length || 0} favorited {items?.length === 1 ? 'item' : 'items'}
          </p>
        </div>
      </div>

      {!items || items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Heart className="mb-4 h-16 w-16 text-muted-foreground/30" />
          <h3 className="mb-2 text-xl font-semibold">No favorites yet</h3>
          <p className="mb-6 text-sm text-muted-foreground max-w-md">
            Click the heart icon on any item to add it to your favorites.
          </p>
          <Button asChild>
            <Link to="/collections">Browse Collections</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => {
            const title = Object.values(item.fieldValues).find((v) => typeof v === 'string' && v.length > 0 && v.length < 100) || 'Untitled';
            const image = item.images?.[0];
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Link to={`/items/${item.id}`}>
                  <Card className="group overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5">
                    {image ? (
                      <div className="aspect-[4/3] overflow-hidden">
                        <img
                          src={image.thumbnailUrl || image.url}
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
                    <CardContent className="p-3">
                      <p className="font-medium text-sm truncate">{String(title).slice(0, 50)}</p>
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant="secondary" className="text-[10px]">
                          {item.collectionName}
                        </Badge>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {item.mediaCount > 0 && (
                            <span className="flex items-center gap-0.5">
                              <ImageIcon className="h-3 w-3" /> {item.mediaCount}
                            </span>
                          )}
                          {item.noteCount > 0 && (
                            <span className="flex items-center gap-0.5">
                              <MessageSquare className="h-3 w-3" /> {item.noteCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
