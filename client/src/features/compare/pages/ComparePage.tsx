import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { compareApi, type CompareResponse } from '../api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2, Scale, Equal, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

function getFieldIcon(type: string): string {
  switch (type) {
    case 'number':
    case 'currency':
      return '#';
    case 'rating':
      return '★';
    case 'boolean':
    case 'checkbox':
      return '✓';
    case 'date':
      return '📅';
    default:
      return 'Aa';
  }
}

export function ComparePage() {
  const [searchParams] = useSearchParams();
  const idsParam = searchParams.get('ids') || '';
  const itemIds = idsParam.split(',').filter(Boolean);

  const [data, setData] = useState<CompareResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (itemIds.length < 2) {
      setError('Select at least 2 items to compare');
      setLoading(false);
      return;
    }
    setLoading(true);
    compareApi.compare(itemIds)
      .then(setData)
      .catch((err) => setError(err?.response?.data?.message || 'Failed to load comparison'))
      .finally(() => setLoading(false));
  }, [idsParam]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Scale className="mb-4 h-16 w-16 text-muted-foreground/30" />
        <h3 className="mb-2 text-xl font-semibold">Comparison error</h3>
        <p className="mb-6 text-muted-foreground">{error}</p>
        <Button asChild><Link to="/collections">Back to Collections</Link></Button>
      </div>
    );
  }

  if (!data) return null;

  const isNumeric = (type: string) => ['number', 'currency', 'rating'].includes(type);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to={`/collections/${data.collection.id}`}><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <div>
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">Compare</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            {data.collection.name} &middot; {data.totalItems} items &middot; {data.totalFields} fields
          </p>
        </div>
      </div>

      <Separator />

      <div className="hidden md:block overflow-x-auto rounded-lg border">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="sticky left-0 z-10 bg-muted/50 px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase w-48 min-w-[160px]">
                Field
              </th>
              {data.items.map((item) => (
                <th key={item.id} className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase min-w-[180px]">
                  <Link to={`/items/${item.id}`} className="hover:text-primary hover:underline">
                    <div className="flex items-center gap-2">
                      {item.images[0] && (
                        <img src={item.images[0].thumbnailUrl || item.images[0].url} alt="" className="h-8 w-8 rounded object-cover" />
                      )}
                      <span className="truncate max-w-[140px]">{item.title}</span>
                    </div>
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {data.fields.map((field) => {
              const numeric = isNumeric(field.fieldType);
              return (
                <tr key={field.fieldId} className={cn(
                  'transition-colors',
                  field.allEqual ? 'bg-green-50/30 dark:bg-green-950/10' : '',
                  field.hasDifferences && !field.allEqual ? 'hover:bg-muted/30' : ''
                )}>
                  <td className="sticky left-0 z-10 bg-background px-4 py-3 text-sm font-medium border-r">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded bg-muted text-[10px] font-mono">
                        {getFieldIcon(field.fieldType)}
                      </span>
                      <span>{field.fieldName}</span>
                      {field.allEqual && (
                        <Equal className="h-3.5 w-3.5 text-green-500" />
                      )}
                    </div>
                  </td>
                  {field.values.map((val, idx) => (
                    <td key={val.itemId} className={cn(
                      'px-4 py-3 text-sm',
                      field.bestIndex === idx && numeric ? 'bg-green-100 dark:bg-green-950/30' : '',
                      val.displayValue === '—' ? 'text-muted-foreground italic bg-muted/20' : '',
                    )}>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          field.bestIndex === idx && numeric ? 'font-semibold text-green-700 dark:text-green-400' : ''
                        )}>
                          {val.displayValue}
                        </span>
                        {field.bestIndex === idx && numeric && (
                          <Badge variant="default" className="text-[10px] h-5 bg-green-600 hover:bg-green-600">Best</Badge>
                        )}
                        {val.displayValue === '—' && (
                          <X className="h-3.5 w-3.5 text-destructive" />
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-4">
        {data.fields.map((field) => {
          const numeric = isNumeric(field.fieldType);
          return (
            <Card key={field.fieldId}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-muted text-[10px] font-mono">
                    {getFieldIcon(field.fieldType)}
                  </span>
                  {field.fieldName}
                  {field.allEqual && <Equal className="h-3.5 w-3.5 text-green-500" />}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {field.values.map((val, idx) => {
                  const item = data.items.find((i) => i.id === val.itemId);
                  return (
                    <div key={val.itemId} className={cn(
                      'flex items-center justify-between rounded-md px-3 py-2 text-sm',
                      field.bestIndex === idx && numeric ? 'bg-green-100 dark:bg-green-950/30' : 'bg-muted/30'
                    )}>
                      <Link to={`/items/${val.itemId}`} className="text-xs text-muted-foreground hover:underline truncate mr-2">
                        {item?.title || 'Item'}
                      </Link>
                      <span className={cn(
                        'font-medium',
                        field.bestIndex === idx && numeric ? 'text-green-700 dark:text-green-400' : ''
                      )}>
                        {val.displayValue}
                        {field.bestIndex === idx && numeric && ' ★'}
                      </span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Separator />

      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded bg-green-100 dark:bg-green-950/30 border border-green-300" />
          Best value
        </div>
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded bg-muted/40 border" />
          <X className="h-3 w-3 text-destructive" />
          Missing value
        </div>
        <div className="flex items-center gap-1">
          <Equal className="h-3 w-3 text-green-500" />
          All equal
        </div>
      </div>
    </motion.div>
  );
}
