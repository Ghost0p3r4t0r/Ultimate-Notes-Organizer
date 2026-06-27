import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, GripVertical, ChevronDown } from 'lucide-react';
import type { FieldDefinition, FieldType } from '../types';
import { FIELD_TYPE_OPTIONS } from '../types';

interface FieldBuilderProps {
  fields: FieldDefinition[];
  onChange: (fields: FieldDefinition[]) => void;
}

export function FieldBuilder({ fields, onChange }: FieldBuilderProps) {
  const addField = () => {
    const newField: FieldDefinition = {
      id: crypto.randomUUID(),
      name: '',
      type: 'text',
      required: false,
      order: fields.length,
    };
    onChange([...fields, newField]);
  };

  const removeField = (index: number) => {
    onChange(fields.filter((_, i) => i !== index).map((f, i) => ({ ...f, order: i })));
  };

  const updateField = (index: number, updates: Partial<FieldDefinition>) => {
    onChange(fields.map((f, i) => (i === index ? { ...f, ...updates } : f)));
  };

  const moveField = (from: number, to: number) => {
    const updated = [...fields];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    onChange(updated.map((f, i) => ({ ...f, order: i })));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">Fields</Label>
        <Button type="button" variant="outline" size="sm" onClick={addField}>
          <Plus className="mr-1 h-4 w-4" />
          Add Field
        </Button>
      </div>
      {fields.length === 0 && (
        <p className="text-sm text-muted-foreground py-4 text-center border rounded-md">
          No fields yet. Click "Add Field" to define your schema.
        </p>
      )}
      <div className="space-y-2">
        {fields.map((field, index) => (
          <div key={field.id || index} className="flex items-start gap-2 rounded-lg border p-3">
            <button
              type="button"
              className="mt-2 cursor-grab text-muted-foreground hover:text-foreground"
              onMouseDown={(e) => {
                const target = e.currentTarget.parentElement;
                if (!target) return;
                const rect = target.getBoundingClientRect();
                const clone = target.cloneNode(true) as HTMLElement;
                clone.style.position = 'fixed';
                clone.style.left = `${rect.left}px`;
                clone.style.top = `${rect.top}px`;
                clone.style.width = `${rect.width}px`;
                clone.style.pointerEvents = 'none';
                clone.style.opacity = '0.8';
                clone.style.zIndex = '1000';
                document.body.appendChild(clone);

                const handleMouseMove = (e: MouseEvent) => {
                  clone.style.top = `${e.clientY - rect.height / 2}px`;
                };
                const handleMouseUp = () => {
                  document.body.removeChild(clone);
                  document.removeEventListener('mousemove', handleMouseMove);
                  document.removeEventListener('mouseup', handleMouseUp);
                };
                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
              }}
            >
              <GripVertical className="h-4 w-4" />
            </button>
            <div className="flex-1 space-y-2">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="Field name"
                    value={field.name}
                    onChange={(e) => updateField(index, { name: e.target.value })}
                  />
                </div>
                <select
                  className="flex h-9 w-40 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={field.type}
                  onChange={(e) => updateField(index, { type: e.target.value as FieldType })}
                >
                  {FIELD_TYPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <div className="flex items-center gap-2">
                  <Label className="text-xs">Required</Label>
                  <Switch
                    checked={field.required}
                    onCheckedChange={(checked) => updateField(index, { required: checked })}
                  />
                </div>
                <Button type="button" variant="ghost" size="icon" className="h-9 w-9 text-destructive" onClick={() => removeField(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              {(field.type === 'dropdown' || field.type === 'multiSelect') && (
                <Input
                  placeholder="Options (comma separated)"
                  value={((field.displayOptions as any)?.options || []) as any}
                  onChange={(e) => updateField(index, {
                    displayOptions: { ...(field.displayOptions || {}), options: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }
                  })}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
