import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileQuestion } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <FileQuestion className="mb-4 h-16 w-16 text-muted-foreground/50" />
      <h1 className="mb-2 text-4xl font-bold">404</h1>
      <p className="mb-6 text-muted-foreground">The page you're looking for doesn't exist</p>
      <Button asChild>
        <Link to="/">Go Home</Link>
      </Button>
    </div>
  );
}
