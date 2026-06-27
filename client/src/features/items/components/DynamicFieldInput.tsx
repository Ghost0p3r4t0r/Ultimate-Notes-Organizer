import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface FieldDefinition {
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

interface DynamicFieldInputProps {
  field: FieldDefinition;
  value: any;
  onChange: (value: any) => void;
  error?: string;
}

export function DynamicFieldInput({ field, value, onChange, error }: DynamicFieldInputProps) {
  const renderInput = () => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
      case 'url':
      case 'color':
        return (
          <Input
            type={field.type === 'color' ? 'color' : field.type === 'email' ? 'email' : field.type === 'phone' ? 'tel' : 'text'}
            id={field.id}
            placeholder={field.placeholder || `Enter ${field.name.toLowerCase()}`}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={field.type === 'color' ? 'h-10 w-20 p-1' : ''}
          />
        );

      case 'longText':
      case 'richText':
      case 'markdown':
        return (
          <textarea
            id={field.id}
            placeholder={field.placeholder || `Enter ${field.name.toLowerCase()}`}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            rows={4}
            className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          />
        );

      case 'number':
      case 'currency':
        return (
          <Input
            type="number"
            id={field.id}
            placeholder={field.placeholder || '0'}
            value={value ?? ''}
            onChange={(e) => onChange(field.type === 'currency' ? parseFloat(e.target.value) || 0 : parseFloat(e.target.value) || 0)}
          />
        );

      case 'date':
        return (
          <Input
            type="date"
            id={field.id}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
          />
        );

      case 'time':
        return (
          <Input
            type="time"
            id={field.id}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
          />
        );

      case 'checkbox':
      case 'boolean':
        return (
          <div className="flex items-center gap-2">
            <Switch
              id={field.id}
              checked={!!value}
              onCheckedChange={onChange}
            />
            <Label htmlFor={field.id}>{field.name}</Label>
          </div>
        );

      case 'rating':
        return (
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => onChange(star)}
                className={`h-8 w-8 rounded-full text-lg transition-colors ${
                  (value || 0) >= star ? 'text-yellow-500' : 'text-muted-foreground/30'
                } hover:text-yellow-400`}
              >
                ★
              </button>
            ))}
          </div>
        );

      case 'dropdown': {
        const options = (field.displayOptions?.options as string[]) || [];
        return (
          <select
            id={field.id}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">Select...</option>
            {options.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        );
      }

      case 'multiSelect': {
        const options = (field.displayOptions?.options as string[]) || [];
        const selectedValues: string[] = Array.isArray(value) ? value : [];
        return (
          <div className="flex flex-wrap gap-2">
            {options.map((opt) => {
              const isSelected = selectedValues.includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    const next = isSelected
                      ? selectedValues.filter((v) => v !== opt)
                      : [...selectedValues, opt];
                    onChange(next);
                  }}
                  className={`rounded-md border px-3 py-1 text-sm transition-colors ${
                    isSelected
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-input hover:border-primary/50'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        );
      }

      case 'tags':
        return (
          <Input
            id={field.id}
            placeholder="tag1, tag2, tag3"
            value={Array.isArray(value) ? value.join(', ') : ''}
            onChange={(e) => onChange(e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean))}
          />
        );

      default:
        return (
          <Input
            id={field.id}
            placeholder={field.placeholder || `Enter ${field.name.toLowerCase()}`}
            value={typeof value === 'string' ? value : JSON.stringify(value || '')}
            onChange={(e) => onChange(e.target.value)}
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={field.id}>
        {field.name}
        {field.required && <span className="ml-1 text-destructive">*</span>}
      </Label>
      {renderInput()}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
