import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { GripVertical, Columns, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FieldDef {
  id: string;
  name: string;
  type: string;
  order: number;
}

interface ColumnManagerProps {
  fields: FieldDef[];
  visibleColumns: string[];
  onToggleColumn: (fieldId: string) => void;
  columnOrder: string[];
  onReorder: (fieldIds: string[]) => void;
}

export function ColumnManager({ fields, visibleColumns, onToggleColumn, columnOrder, onReorder }: ColumnManagerProps) {
  const [open, setOpen] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const orderedFields = columnOrder
    .map((id) => fields.find((f) => f.id === id))
    .filter((f): f is FieldDef => f !== undefined);

  const hiddenFields = fields.filter((f) => !visibleColumns.includes(f.id));

  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    const newOrder = [...columnOrder];
    const [moved] = newOrder.splice(dragIndex, 1);
    newOrder.splice(index, 0, moved);
    onReorder(newOrder);
    setDragIndex(index);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
  };

  return (
    <div className="relative">
      <Button variant="outline" size="sm" onClick={() => setOpen(!open)} className="gap-2">
        <Columns className="h-4 w-4" />
        Columns
        {hiddenFields.length > 0 && (
          <span className="ml-1 rounded-full bg-muted-foreground/20 px-1.5 py-0.5 text-xs">{hiddenFields.length} hidden</span>
        )}
      </Button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-1 w-72 rounded-lg border bg-popover p-3 shadow-lg">
            <p className="mb-2 text-xs font-medium text-muted-foreground">Visible Columns</p>
            <div className="space-y-1">
              {orderedFields.map((field, index) => (
                <div
                  key={field.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={cn(
                    'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors',
                    dragIndex === index ? 'opacity-50' : 'hover:bg-muted',
                    !visibleColumns.includes(field.id) && 'opacity-40'
                  )}
                >
                  <GripVertical className="h-3.5 w-3.5 cursor-grab text-muted-foreground" />
                  <Switch
                    checked={visibleColumns.includes(field.id)}
                    onCheckedChange={() => onToggleColumn(field.id)}
                    className="scale-75"
                  />
                  <Label className="flex-1 cursor-pointer text-sm">{field.name}</Label>
                  {!visibleColumns.includes(field.id) && <EyeOff className="h-3 w-3 text-muted-foreground" />}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
