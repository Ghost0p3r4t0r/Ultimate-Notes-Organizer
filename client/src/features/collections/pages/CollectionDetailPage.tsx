import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCollection } from '../../collections/hooks';
import { useItems, useCreateItem, useDeleteItem } from '../../items/hooks';
import { ViewSwitcher } from '../../items/components/ViewSwitcher';
import { ColumnManager } from '../../items/components/ColumnManager';
import { TableView } from '../../items/components/TableView';
import { CardView } from '../../items/components/CardView';
import { GalleryView } from '../../items/components/GalleryView';
import { ListView } from '../../items/components/ListView';
import { useViewPreferences } from '../../items/hooks/useViewPreferences';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Loader2, Folder, Plus, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { ItemForm } from '../../items/components/ItemForm';
import { DeleteCollectionDialog } from '../../collections/components/DeleteCollectionDialog';
import type { Item } from '../../items/types';

export function CollectionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: collection, isLoading: colLoading } = useCollection(id!);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data: itemsData, isLoading: itemsLoading } = useItems(id!, { page, limit: 20, search: search || undefined });
  const createItem = useCreateItem(id!);
  const deleteItem = useDeleteItem(id!);

  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | undefined>();
  const [deletingItem, setDeletingItem] = useState<Item | undefined>();

  const fields = (collection?.fields || []).map((f: any) => ({
    id: f.id, name: f.name, type: f.type, required: f.required,
    placeholder: f.placeholder, defaultValue: f.defaultValue,
    validation: f.validation, displayOptions: f.displayOptions, order: f.order,
  }));

  const { mode, visibleColumns, columnOrder, setMode, toggleColumn, reorderColumns } = useViewPreferences(
    id!,
    fields.map((f: any) => f.id)
  );

  const orderedFields = columnOrder
    .map((fid) => fields.find((f: any) => f.id === fid))
    .filter((f): f is NonNullable<typeof f> => f !== undefined);

  const handleCreateItem = async (fieldValues: Record<string, any>) => {
    await createItem.mutateAsync({ collectionId: id!, fieldValues });
    setFormOpen(false);
  };

  const handleUpdateItem = async (fieldValues: Record<string, any>) => {
    if (editingItem) {
      await deleteItem.mutateAsync(editingItem.id);
      await createItem.mutateAsync({ collectionId: id!, fieldValues });
      setEditingItem(undefined);
      setFormOpen(false);
    }
  };

  const handleDeleteItem = async () => {
    if (deletingItem) {
      await deleteItem.mutateAsync(deletingItem.id);
      setDeletingItem(undefined);
    }
  };

  const handleToggleFavorite = async (item: Item) => {
    await deleteItem.mutateAsync(item.id);
    await createItem.mutateAsync({ collectionId: id!, fieldValues: item.fieldValues });
  };

  if (colLoading) {
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
        <Button asChild><Link to="/collections">Back to Collections</Link></Button>
      </div>
    );
  }

  const totalPages = itemsData ? Math.ceil(itemsData.total / itemsData.limit) : 1;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/collections"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: collection.themeColor || '#3b82f6', color: '#fff' }}>
              <Folder className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{collection.name}</h1>
              {collection.description && <p className="text-muted-foreground text-sm">{collection.description}</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Badge variant="secondary">{collection.itemCount} items</Badge>
        <Badge variant="outline">{collection.fields.length} fields</Badge>
        <div className="flex-1" />
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search items..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9 w-48 sm:w-64"
          />
        </div>
        <ViewSwitcher value={mode} onChange={setMode} />
        {mode === 'table' && (
          <ColumnManager
            fields={orderedFields}
            visibleColumns={visibleColumns}
            columnOrder={columnOrder}
            onToggleColumn={toggleColumn}
            onReorder={reorderColumns}
          />
        )}
        <Button onClick={() => { setEditingItem(undefined); setFormOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>

      {itemsLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {mode === 'table' && (
            <TableView
              items={itemsData?.items || []}
              fields={orderedFields}
              visibleColumns={visibleColumns}
              onEdit={(item) => { setEditingItem(item); setFormOpen(true); }}
              onDelete={setDeletingItem}
              onToggleFavorite={handleToggleFavorite}
            />
          )}
          {mode === 'card' && (
            <CardView
              items={itemsData?.items || []}
              fields={orderedFields}
              onEdit={(item) => { setEditingItem(item); setFormOpen(true); }}
              onDelete={setDeletingItem}
              onToggleFavorite={handleToggleFavorite}
            />
          )}
          {mode === 'gallery' && (
            <GalleryView
              items={itemsData?.items || []}
              onToggleFavorite={handleToggleFavorite}
            />
          )}
          {mode === 'list' && (
            <ListView
              items={itemsData?.items || []}
              fields={orderedFields}
              onEdit={(item) => { setEditingItem(item); setFormOpen(true); }}
              onDelete={setDeletingItem}
              onToggleFavorite={handleToggleFavorite}
            />
          )}
        </>
      )}

      {itemsData && itemsData.total > itemsData.limit && (
        <div className="flex items-center justify-center gap-4">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages} ({itemsData.total} total)
          </span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Schema Fields</CardTitle>
        </CardHeader>
        <CardContent>
          {fields.length === 0 ? (
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
              {fields.map((field: any, index: number) => (
                <div key={field.id || index} className="grid grid-cols-12 gap-4 rounded-lg px-4 py-2 text-sm hover:bg-muted/50">
                  <div className="col-span-1 text-muted-foreground">{index + 1}</div>
                  <div className="col-span-3 font-medium">{field.name}</div>
                  <div className="col-span-3 text-muted-foreground capitalize">{field.type}</div>
                  <div className="col-span-2">
                    {field.required ? <Badge variant="default" className="text-xs">Required</Badge> : <span className="text-muted-foreground">—</span>}
                  </div>
                  <div className="col-span-3 text-muted-foreground truncate">
                    {(field.type === 'dropdown' || field.type === 'multiSelect')
                      ? (field.displayOptions?.options || []).join(', ')
                      : '—'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <ItemForm
        open={formOpen}
        onOpenChange={setFormOpen}
        fields={fields}
        onSubmit={editingItem ? handleUpdateItem : handleCreateItem}
        initialValues={editingItem?.fieldValues}
        loading={createItem.isPending}
      />

      <DeleteCollectionDialog
        open={!!deletingItem}
        onOpenChange={() => setDeletingItem(undefined)}
        collectionName={deletingItem?.fieldValues?.[fields[0]?.id] || 'this item'}
        onConfirm={handleDeleteItem}
        loading={deleteItem.isPending}
      />
    </motion.div>
  );
}
