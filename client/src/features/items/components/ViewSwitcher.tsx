import { LayoutGrid, LayoutList, Columns, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ViewMode = 'table' | 'card' | 'gallery' | 'list';

interface ViewSwitcherProps {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
}

const views: { value: ViewMode; icon: typeof LayoutGrid; label: string }[] = [
  { value: 'table', icon: Columns, label: 'Table' },
  { value: 'card', icon: LayoutGrid, label: 'Card' },
  { value: 'gallery', icon: ImageIcon, label: 'Gallery' },
  { value: 'list', icon: LayoutList, label: 'List' },
];

export function ViewSwitcher({ value, onChange }: ViewSwitcherProps) {
  return (
    <div className="flex items-center gap-1 rounded-lg border p-1">
      {views.map((view) => (
        <button
          key={view.value}
          type="button"
          onClick={() => onChange(view.value)}
          className={cn(
            'flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors',
            value === view.value
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          )}
        >
          <view.icon className="h-3.5 w-3.5" />
          <span>{view.label}</span>
        </button>
      ))}
    </div>
  );
}
