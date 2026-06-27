import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { DynamicFieldInput } from './DynamicFieldInput';
import { ScrollArea } from '@/components/ui/scroll-area';

interface FieldDef {
  id: string;
  name: string;
  type: string;
  required: boolean;
  placeholder?: string;
  defaultValue?: any;
  validation?: any;
  displayOptions?: any;
  order: number;
}

interface ItemFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fields: FieldDef[];
  onSubmit: (fieldValues: Record<string, any>) => void;
  initialValues?: Record<string, any>;
  loading?: boolean;
}

export function ItemForm({ open, onOpenChange, fields, onSubmit, initialValues, loading }: ItemFormProps) {
  const [values, setValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      const defaults: Record<string, any> = {};
      fields.forEach((f) => {
        defaults[f.id] = initialValues?.[f.id] ?? f.defaultValue ?? (f.type === 'checkbox' || f.type === 'boolean' ? false : '');
      });
      setValues(defaults);
      setErrors({});
    }
  }, [open, fields, initialValues]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    fields.forEach((f) => {
      if (f.required) {
        const val = values[f.id];
        if (val === undefined || val === null || val === '') {
          newErrors[f.id] = `${f.name} is required`;
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const fieldValues: Record<string, any> = {};
      fields.forEach((f) => {
        fieldValues[f.id] = values[f.id];
      });
      onSubmit(fieldValues);
    }
  };

  const sortedFields = [...fields].sort((a, b) => a.order - b.order);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>{initialValues ? 'Edit Item' : 'Add Item'}</DialogTitle>
          <DialogDescription>
            Fill in the fields below to {initialValues ? 'update this' : 'create a new'} item.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-4">
              {sortedFields.map((field) => (
                <DynamicFieldInput
                  key={field.id}
                  field={field}
                  value={values[field.id]}
                  onChange={(val) => setValues((prev) => ({ ...prev, [field.id]: val }))}
                  error={errors[field.id]}
                />
              ))}
            </div>
          </ScrollArea>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : initialValues ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
