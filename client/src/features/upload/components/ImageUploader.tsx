import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  onUpload: (files: File[]) => Promise<void>;
  uploading?: boolean;
  maxFiles?: number;
  accept?: string;
}

export function ImageUploader({ onUpload, uploading, maxFiles = 20, accept = 'image/*' }: ImageUploaderProps) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((fileList: FileList) => {
    const files = Array.from(fileList).slice(0, maxFiles);
    if (files.length > 0) {
      onUpload(files);
    }
  }, [onUpload, maxFiles]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    const files: File[] = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) files.push(file);
      }
    }
    if (files.length > 0) {
      onUpload(files);
    }
  }, [onUpload]);

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onPaste={handlePaste}
      tabIndex={0}
      className={cn(
        'relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors cursor-pointer',
        dragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-muted-foreground/50',
        uploading && 'pointer-events-none opacity-60'
      )}
      onClick={() => inputRef.current?.click()}
    >
      {uploading ? (
        <Loader2 className="mb-2 h-8 w-8 animate-spin text-muted-foreground" />
      ) : (
        <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
      )}
      <p className="mb-1 text-sm font-medium">
        {uploading ? 'Uploading...' : 'Drop files here, click to browse, or paste'}
      </p>
      <p className="text-xs text-muted-foreground">
        Supports images, PDFs, videos up to 10MB
      </p>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        className="hidden"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />
    </div>
  );
}
