import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useItem, useUpdateItem } from '../../items/hooks';
import { uploadApi } from '../../upload/api';
import { ImageUploader } from '../../upload/components/ImageUploader';
import { ImageGallery } from '../../upload/components/ImageGallery';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Loader2, Calendar, Clock, Star, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

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

export function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: item, isLoading, refetch } = useItem(id!);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (id) {
      uploadApi.listByItem(id).then(setMedia).catch(() => {});
    }
  }, [id]);

  const handleUpload = async (files: File[]) => {
    setUploading(true);
    try {
      const uploaded = await uploadApi.uploadFiles(files, id);
      setMedia((prev) => [...uploaded, ...prev]);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (mediaId: string) => {
    await uploadApi.delete(mediaId);
    setMedia((prev) => prev.filter((m) => m.id !== mediaId));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <h3 className="mb-2 text-xl font-semibold">Item not found</h3>
        <Button asChild><Link to="/collections">Back to Collections</Link></Button>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to={`/collections/${item.collectionId}`}><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">
              {item.fieldValues[item.collection.fields[0]?.id] || item.fieldValues[item.collection.fields[0]?.name] || 'Untitled'}
            </h1>
            {item.favorite && <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />}
          </div>
          <p className="text-sm text-muted-foreground">
            in <Link to={`/collections/${item.collectionId}`} className="hover:underline text-primary">{item.collection.name}</Link>
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <Badge variant="secondary"><Calendar className="mr-1 h-3 w-3" />{new Date(item.createdAt).toLocaleDateString()}</Badge>
        <Badge variant="outline"><Clock className="mr-1 h-3 w-3" />Updated {new Date(item.updatedAt).toLocaleDateString()}</Badge>
        {media.length > 0 && (
          <Badge variant="outline"><ImageIcon className="mr-1 h-3 w-3" />{media.length} images</Badge>
        )}
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Images</h2>
        <ImageUploader onUpload={handleUpload} uploading={uploading} />
        <ImageGallery items={media} onDelete={handleDelete} />
      </div>

      <Separator />

      <div className="grid gap-4 md:grid-cols-2">
        {item.collection.fields
          .sort((a: any, b: any) => a.order - b.order)
          .map((field: any) => {
            const value = item.fieldValues[field.id];
            const displayValue = () => {
              if (value === null || value === undefined || value === '') return <span className="text-muted-foreground italic">—</span>;
              if (field.type === 'boolean' || field.type === 'checkbox') return value ? '✓ Yes' : '✗ No';
              if (field.type === 'rating') return '★'.repeat(value) || '—';
              if (field.type === 'currency') return `₹${Number(value).toLocaleString()}`;
              if (field.type === 'date') return new Date(value).toLocaleDateString();
              if (Array.isArray(value)) return value.join(', ');
              if (typeof value === 'object') return JSON.stringify(value);
              return String(value);
            };
            return (
              <Card key={field.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{field.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base">{displayValue()}</p>
                </CardContent>
              </Card>
            );
          })}
      </div>
    </motion.div>
  );
}
