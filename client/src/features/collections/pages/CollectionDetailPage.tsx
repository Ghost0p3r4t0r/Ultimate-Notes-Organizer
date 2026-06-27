import { useParams, Link } from 'react-router-dom';
import { useCollection } from '../hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Loader2, Folder, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export function CollectionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: collection, isLoading } = useCollection(id!);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Folder className="mb-4 h-16 w-16 text-muted-foreground/30" />
        <h3 className="mb-2 text-xl font-semibold">Collection not found</h3>
        <Button asChild>
          <Link to="/collections">Back to Collections</Link>
        </Button>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/collections">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg"
              style={{ backgroundColor: collection.themeColor || '#3b82f6', color: '#fff' }}
            >
              <Folder className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{collection.name}</h1>
              {collection.description && (
                <p className="text-muted-foreground">{collection.description}</p>
              )}
            </div>
          </div>
        </div>
        <div className="flex-1" />
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>

      <div className="flex gap-4">
        <Badge variant="secondary">{collection.itemCount} items</Badge>
        <Badge variant="outline">{collection.fields.length} fields</Badge>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Schema Fields</CardTitle>
        </CardHeader>
        <CardContent>
          {collection.fields.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No fields defined yet.</p>
          ) : (
            <div className="space-y-2">
              <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm font-medium text-muted-foreground">
                <div className="col-span-1">#</div>
                <div className="col-span-3">Field Name</div>
                <div className="col-span-3">Type</div>
                <div className="col-span-2">Required</div>
                <div className="col-span-3">Options</div>
              </div>
              <Separator />
              {collection.fields.map((field, index) => (
                <div key={field.id || index} className="grid grid-cols-12 gap-4 rounded-lg px-4 py-2 text-sm hover:bg-muted/50">
                  <div className="col-span-1 text-muted-foreground">{index + 1}</div>
                  <div className="col-span-3 font-medium">{field.name}</div>
                  <div className="col-span-3 text-muted-foreground capitalize">{field.type}</div>
                  <div className="col-span-2">{field.required ? <Badge variant="default" className="text-xs">Required</Badge> : <span className="text-muted-foreground">—</span>}</div>
                  <div className="col-span-3 text-muted-foreground truncate">
                    {field.type === 'dropdown' || field.type === 'multiSelect'
                      ? ((field.displayOptions as any)?.options || []).join(', ')
                      : '—'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
