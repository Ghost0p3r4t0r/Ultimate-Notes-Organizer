import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Plus, X, Filter } from 'lucide-react';

interface FilterCondition {
  field: string;
  operator: string;
  value: any;
}

interface FilterGroup {
  logic: 'AND' | 'OR';
  conditions: FilterCondition[];
  groups: FilterGroup[];
}

const OPERATORS = [
  { value: 'eq', label: 'Equals' },
  { value: 'neq', label: 'Not equals' },
  { value: 'gt', label: 'Greater than' },
  { value: 'gte', label: 'Greater or equal' },
  { value: 'lt', label: 'Less than' },
  { value: 'lte', label: 'Less or equal' },
  { value: 'contains', label: 'Contains' },
  { value: 'notContains', label: 'Not contains' },
  { value: 'startsWith', label: 'Starts with' },
  { value: 'endsWith', label: 'Ends with' },
  { value: 'in', label: 'In list' },
  { value: 'notIn', label: 'Not in list' },
  { value: 'isEmpty', label: 'Is empty' },
  { value: 'isNotEmpty', label: 'Is not empty' },
];

interface FieldDef {
  id: string;
  name: string;
  type: string;
}

interface FilterBuilderProps {
  fields: FieldDef[];
  filters: FilterGroup | null;
  onChange: (filters: FilterGroup | null) => void;
}

function ConditionRow({ condition, index, fields, onChange, onDelete }: {
  condition: FilterCondition;
  index: number;
  fields: FieldDef[];
  onChange: (condition: FilterCondition) => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg border p-2">
      <select
        className="flex h-8 w-36 rounded-md border border-input bg-transparent px-2 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        value={condition.field}
        onChange={(e) => onChange({ ...condition, field: e.target.value })}
      >
        <option value="">Select field</option>
        {fields.map((f) => (
          <option key={f.id} value={f.name}>{f.name}</option>
        ))}
      </select>
      <select
        className="flex h-8 w-28 rounded-md border border-input bg-transparent px-2 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        value={condition.operator}
        onChange={(e) => onChange({ ...condition, operator: e.target.value })}
      >
        {OPERATORS.filter((op) => {
          const field = fields.find((f) => f.name === condition.field);
          if (!field) return true;
          if (['isEmpty', 'isNotEmpty'].includes(op.value)) return true;
          return true;
        }).map((op) => (
          <option key={op.value} value={op.value}>{op.label}</option>
        ))}
      </select>
      {!['isEmpty', 'isNotEmpty'].includes(condition.operator) && (
        <Input
          className="h-8 flex-1 text-xs"
          placeholder="Value"
          value={condition.value ?? ''}
          onChange={(e) => onChange({ ...condition, value: e.target.value })}
        />
      )}
      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-destructive" onClick={onDelete}>
        <X className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

export function FilterBuilder({ fields, filters, onChange }: FilterBuilderProps) {
  const [open, setOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterGroup>(() => filters || { logic: 'AND', conditions: [{ field: '', operator: 'contains', value: '' }], groups: [] });

  const handleOpen = () => {
    setLocalFilters(filters || { logic: 'AND', conditions: [{ field: '', operator: 'contains', value: '' }], groups: [] });
    setOpen(true);
  };

  const addCondition = () => {
    setLocalFilters((prev) => ({
      ...prev,
      conditions: [...prev.conditions, { field: '', operator: 'contains', value: '' }],
    }));
  };

  const updateCondition = (index: number, condition: FilterCondition) => {
    setLocalFilters((prev) => ({
      ...prev,
      conditions: prev.conditions.map((c, i) => (i === index ? condition : c)),
    }));
  };

  const removeCondition = (index: number) => {
    setLocalFilters((prev) => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index),
    }));
  };

  const toggleLogic = () => {
    setLocalFilters((prev) => ({
      ...prev,
      logic: prev.logic === 'AND' ? 'OR' : 'AND',
    }));
  };

  const applyFilters = () => {
    const validConditions = localFilters.conditions.filter((c) => c.field && c.value);
    if (validConditions.length === 0) {
      onChange(null);
    } else {
      onChange({ ...localFilters, conditions: validConditions });
    }
    setOpen(false);
  };

  const clearFilters = () => {
    onChange(null);
    setOpen(false);
  };

  const activeCount = filters?.conditions?.length || 0;

  return (
    <>
      <div className="flex items-center gap-2">
        <Button variant={activeCount > 0 ? 'default' : 'outline'} size="sm" onClick={handleOpen} className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
          {activeCount > 0 && <Badge variant="secondary" className="ml-1 text-xs">{activeCount}</Badge>}
        </Button>
        {activeCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs text-muted-foreground">
            <X className="h-3 w-3 mr-1" /> Clear
          </Button>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Filters</DialogTitle>
            <DialogDescription>Filter items by field values</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Match</span>
              <button
                type="button"
                onClick={toggleLogic}
                className="rounded-md border px-3 py-1 text-xs font-medium hover:bg-muted transition-colors"
              >
                {localFilters.logic === 'AND' ? 'All conditions (AND)' : 'Any condition (OR)'}
              </button>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {localFilters.conditions.map((cond, index) => (
                <ConditionRow
                  key={index}
                  condition={cond}
                  index={index}
                  fields={fields}
                  onChange={(c) => updateCondition(index, c)}
                  onDelete={() => removeCondition(index)}
                />
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={addCondition} className="w-full">
              <Plus className="h-4 w-4 mr-1" /> Add condition
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={clearFilters}>Clear all</Button>
            <Button onClick={applyFilters}>Apply filters</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
