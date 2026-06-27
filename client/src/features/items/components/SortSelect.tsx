import { Button } from '@/components/ui/button';
import { ArrowUpDown, ArrowUp, ArrowDown, X } from 'lucide-react';
import { useState } from 'react';

interface FieldDef {
  id: string;
  name: string;
  type: string;
}

interface SortConfig {
  field: string;
  order: 'asc' | 'desc';
}

interface SortSelectProps {
  fields: FieldDef[];
  sort: SortConfig;
  onChange: (sort: SortConfig) => void;
}

export function SortSelect({ fields, sort, onChange }: SortSelectProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <Button variant="outline" size="sm" onClick={() => setOpen(!open)} className="gap-2">
        <ArrowUpDown className="h-4 w-4" />
        Sort{sort.field ? `: ${fields.find((f) => f.name === sort.field)?.name || sort.field}` : ''}
      </Button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-1 w-56 rounded-lg border bg-popover p-2 shadow-lg">
            <p className="px-2 py-1 text-xs font-medium text-muted-foreground">Sort by</p>
            <div className="space-y-0.5 mt-1">
              {fields.map((f) => (
                <button
                  key={f.id}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted transition-colors"
                  onClick={() => {
                    const newOrder: 'asc' | 'desc' = sort.field === f.name && sort.order === 'asc' ? 'desc' : 'asc';
                    onChange({ field: f.name, order: newOrder });
                    setOpen(false);
                  }}
                >
                  <span className="flex-1 text-left">{f.name}</span>
                  {sort.field === f.name && (
                    sort.order === 'asc' ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />
                  )}
                </button>
              ))}
            </div>
            {sort.field && (
              <>
                <div className="border-t my-1" />
                <button
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted transition-colors"
                  onClick={() => { onChange({ field: '', order: 'desc' }); setOpen(false); }}
                >
                  <X className="h-3.5 w-3.5" />
                  Clear sort
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
