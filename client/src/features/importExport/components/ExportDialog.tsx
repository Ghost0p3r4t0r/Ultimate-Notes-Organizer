import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Download, Loader2, FileText, FileSpreadsheet, Code } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FieldDef {
  id: string;
  name: string;
  type: string;
}

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fields: FieldDef[];
  totalItems: number;
  onExport: (format: 'csv' | 'json' | 'xlsx', fieldIds: string[]) => Promise<void>;
}

const FORMATS = [
  { value: 'csv', label: 'CSV', icon: FileText, description: 'Comma-separated values, open in Excel' },
  { value: 'xlsx', label: 'Excel', icon: FileSpreadsheet, description: 'Microsoft Excel format' },
  { value: 'json', label: 'JSON', icon: Code, description: 'Structured data format' },
];

export function ExportDialog({ open, onOpenChange, fields, totalItems, onExport }: ExportDialogProps) {
  const [format, setFormat] = useState<'csv' | 'json' | 'xlsx'>('csv');
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setSelectedFields(fields.map((f) => f.id));
      setFormat('csv');
    }
  }, [open, fields]);

  const toggleField = (fieldId: string) => {
    setSelectedFields((prev) =>
      prev.includes(fieldId) ? prev.filter((id) => id !== fieldId) : [...prev, fieldId]
    );
  };

  const handleExport = async () => {
    setLoading(true);
    try {
      await onExport(format, selectedFields);
    } finally {
      setLoading(false);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Export Data</DialogTitle>
          <DialogDescription>
            Export {totalItems} items from this collection.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">Format</Label>
            <div className="grid grid-cols-3 gap-2">
              {FORMATS.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setFormat(f.value as typeof format)}
                  className={cn(
                    'flex flex-col items-center gap-1.5 rounded-lg border p-3 text-sm transition-colors',
                    format === f.value ? 'border-primary bg-primary/5' : 'hover:bg-muted'
                  )}
                >
                  <f.icon className={cn('h-5 w-5', format === f.value ? 'text-primary' : 'text-muted-foreground')} />
                  <span className="font-medium">{f.label}</span>
                  <span className="text-[10px] text-muted-foreground text-center">{f.description}</span>
                </button>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <Label className="text-sm font-medium mb-2 block">Fields ({selectedFields.length}/{fields.length})</Label>
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
              {fields.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => toggleField(f.id)}
                  className={cn(
                    'rounded-md border px-2.5 py-1 text-xs transition-colors',
                    selectedFields.includes(f.id)
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'hover:bg-muted text-muted-foreground'
                  )}
                >
                  {f.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleExport} disabled={loading || selectedFields.length === 0}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            Export {format.toUpperCase()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
