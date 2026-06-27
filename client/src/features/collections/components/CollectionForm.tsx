import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { FieldBuilder } from './FieldBuilder';
import type { Collection, FieldDefinition } from '../types';

interface CollectionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { name: string; description?: string; themeColor?: string; fields: FieldDefinition[] }) => void;
  initialData?: Collection;
  loading?: boolean;
}

export function CollectionForm({ open, onOpenChange, onSubmit, initialData, loading }: CollectionFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [themeColor, setThemeColor] = useState(initialData?.themeColor || '#3b82f6');
  const [fields, setFields] = useState<FieldDefinition[]>(initialData?.fields || []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, description, themeColor, fields });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Collection' : 'Create Collection'}</DialogTitle>
          <DialogDescription>
            {initialData ? 'Update your collection settings and fields.' : 'Define a new collection with custom fields.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Collection Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Properties, Cars, Books" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What is this collection for?" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Theme Color</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  id="color"
                  value={themeColor}
                  onChange={(e) => setThemeColor(e.target.value)}
                  className="h-9 w-9 rounded-md border border-input cursor-pointer"
                />
                <span className="text-sm text-muted-foreground">{themeColor}</span>
              </div>
            </div>
          </div>
          <FieldBuilder fields={fields} onChange={setFields} />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading || !name.trim()}>
              {loading ? 'Saving...' : initialData ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
