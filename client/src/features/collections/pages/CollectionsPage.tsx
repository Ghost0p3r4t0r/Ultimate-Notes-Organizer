import { useState } from 'react';
import { useCollections, useCreateCollection, useDeleteCollection, useUpdateCollection } from '../hooks';
import { CollectionCard } from '../components/CollectionCard';
import { CollectionForm } from '../components/CollectionForm';
import { DeleteCollectionDialog } from '../components/DeleteCollectionDialog';
import { Button } from '@/components/ui/button';
import { Plus, Folder, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Collection, FieldDefinition } from '../types';

export function CollectionsPage() {
  const { data: collections, isLoading } = useCollections();
  const createMutation = useCreateCollection();
  const updateMutation = useUpdateCollection('');
  const deleteMutation = useDeleteCollection();

  const [formOpen, setFormOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | undefined>();
  const [deletingCollection, setDeletingCollection] = useState<Collection | undefined>();

  const handleCreate = async (data: { name: string; description?: string; themeColor?: string; fields: FieldDefinition[] }) => {
    await createMutation.mutateAsync(data);
    setFormOpen(false);
  };

  const handleUpdate = async (data: { name: string; description?: string; themeColor?: string; fields: FieldDefinition[] }) => {
    if (editingCollection) {
      await updateMutation.mutateAsync(data);
      setEditingCollection(undefined);
      setFormOpen(false);
    }
  };

  const handleDelete = async () => {
    if (deletingCollection) {
      await deleteMutation.mutateAsync(deletingCollection.id);
      setDeletingCollection(undefined);
    }
  };

  const openEdit = (collection: Collection) => {
    setEditingCollection(collection);
    setFormOpen(true);
  };

  const openCreate = () => {
    setEditingCollection(undefined);
    setFormOpen(true);
  };

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
          <h1 className="text-2xl font-bold tracking-tight">Collections</h1>
          <p className="text-muted-foreground">Manage your data collections</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          New Collection
        </Button>
      </div>

      {!collections || collections.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Folder className="mb-4 h-16 w-16 text-muted-foreground/30" />
          <h3 className="mb-2 text-xl font-semibold">No collections yet</h3>
          <p className="mb-6 text-muted-foreground max-w-md">
            Create your first collection to start organizing your data. Collections can hold items with custom fields, images, and more.
          </p>
          <Button onClick={openCreate} size="lg">
            <Plus className="mr-2 h-4 w-4" />
            Create Collection
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              onEdit={openEdit}
              onDelete={setDeletingCollection}
            />
          ))}
        </div>
      )}

      <CollectionForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={editingCollection ? handleUpdate : handleCreate}
        initialData={editingCollection}
        loading={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteCollectionDialog
        open={!!deletingCollection}
        onOpenChange={() => setDeletingCollection(undefined)}
        collectionName={deletingCollection?.name || ''}
        onConfirm={handleDelete}
        loading={deleteMutation.isPending}
      />
    </motion.div>
  );
}
