import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Upload, FileText, Loader2, CheckCircle, AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FieldDef {
  id: string;
  name: string;
  type: string;
}

interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collectionId: string;
  fields: FieldDef[];
  onImport: (file: File, columnMapping: Record<string, string>) => Promise<any>;
}

export function ImportDialog({ open, onOpenChange, collectionId, fields, onImport }: ImportDialogProps) {
  const [step, setStep] = useState<'upload' | 'mapping' | 'result'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ imported: number; errors: Array<{ row: number; message: string }> } | null>(null);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const inputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setStep('upload');
    setFile(null);
    setCsvHeaders([]);
    setMapping({});
    setResult(null);
    setLoading(false);
  };

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (selectedFile.name.endsWith('.csv')) {
        const firstLine = content.split('\n')[0];
        const headers = firstLine.split(',').map((h) => h.trim().replace(/"/g, ''));
        setCsvHeaders(headers);
        const autoMapping: Record<string, string> = {};
        headers.forEach((header) => {
          const match = fields.find(
            (f) => f.name.toLowerCase() === header.toLowerCase() || f.name.toLowerCase().includes(header.toLowerCase()) || header.toLowerCase().includes(f.name.toLowerCase())
          );
          if (match) autoMapping[header] = match.id;
        });
        setMapping(autoMapping);
        setStep('mapping');
      } else if (selectedFile.name.endsWith('.json')) {
        try {
          const jsonData = JSON.parse(content);
          if (Array.isArray(jsonData) && jsonData.length > 0) {
            const headers = Object.keys(jsonData[0]);
            setCsvHeaders(headers);
            const autoMapping: Record<string, string> = {};
            headers.forEach((header) => {
              const match = fields.find(
                (f) => f.name.toLowerCase() === header.toLowerCase()
              );
              if (match) autoMapping[header] = match.id;
            });
            setMapping(autoMapping);
            setStep('mapping');
          }
        } catch {}
      } else {
        setCsvHeaders([]);
        setStep('mapping');
      }
    };
    if (selectedFile.name.endsWith('.csv') || selectedFile.name.endsWith('.json')) {
      reader.readAsText(selectedFile);
    } else {
      setStep('mapping');
    }
  };

  const handleImport = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const res = await onImport(file, mapping);
      setResult(res);
      setStep('result');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) reset(); }}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Data</DialogTitle>
          <DialogDescription>
            Import items from CSV, Excel, or JSON file.
          </DialogDescription>
        </DialogHeader>

        {step === 'upload' && (
          <div className="space-y-4">
            <div
              className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => inputRef.current?.click()}
            >
              <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
              <p className="text-sm font-medium">Click to upload a file</p>
              <p className="text-xs text-muted-foreground mt-1">CSV, Excel (.xlsx), or JSON</p>
              <input
                ref={inputRef}
                type="file"
                accept=".csv,.xlsx,.xls,.json"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              />
            </div>
          </div>
        )}

        {step === 'mapping' && (
          <div className="space-y-4">
            {file && (
              <div className="flex items-center gap-2 rounded-md bg-muted p-2 text-sm">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="flex-1 truncate">{file.name}</span>
                <Badge variant="secondary">{(file.size / 1024).toFixed(1)} KB</Badge>
              </div>
            )}
            <Separator />
            <p className="text-sm font-medium">Map columns to fields</p>
            <div className="space-y-3 max-h-52 overflow-y-auto">
              {csvHeaders.map((header) => (
                <div key={header} className="flex items-center gap-2">
                  <span className="w-28 text-xs font-medium truncate">{header}</span>
                  <select
                    className="flex-1 h-8 rounded-md border border-input bg-transparent px-2 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={mapping[header] || ''}
                    onChange={(e) => setMapping((prev) => ({ ...prev, [header]: e.target.value }))}
                  >
                    <option value="">— Skip —</option>
                    {fields.map((f) => (
                      <option key={f.id} value={f.id}>{f.name} ({f.type})</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setStep('upload')}>Back</Button>
              <Button onClick={handleImport} disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Import {csvHeaders.filter((h) => mapping[h]).length > 0 ? `${csvHeaders.filter((h) => mapping[h]).length} columns` : ''}
              </Button>
            </DialogFooter>
          </div>
        )}

        {step === 'result' && result && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-lg p-4 bg-green-50 dark:bg-green-950/20">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div>
                <p className="font-medium text-green-800 dark:text-green-300">
                  Successfully imported {result.imported} items
                </p>
                {result.errors.length > 0 && (
                  <p className="text-sm text-amber-600">{result.errors.length} rows had errors</p>
                )}
              </div>
            </div>
            {result.errors.length > 0 && (
              <div className="space-y-1 max-h-32 overflow-y-auto">
                <p className="text-xs font-medium text-muted-foreground">Errors:</p>
                {result.errors.slice(0, 10).map((err, i) => (
                  <div key={i} className="flex items-start gap-2 rounded-md bg-destructive/5 p-2 text-xs">
                    <AlertCircle className="h-3 w-3 mt-0.5 shrink-0 text-destructive" />
                    <span>Row {err.row}: {err.message}</span>
                  </div>
                ))}
              </div>
            )}
            <DialogFooter>
              <Button onClick={() => { reset(); onOpenChange(false); }}>Done</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
