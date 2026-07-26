'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/container';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Container>
        <div className="text-center">
          <h1 className="text-6xl font-bold text-primary mb-4">
            Oops!
          </h1>
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Something went wrong
          </h2>
          <p className="text-muted-foreground mb-8">
            {error.message || 'An unexpected error occurred'}
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={reset}>Try Again</Button>
            <Button variant="outline" onClick={() => window.location.href = '/'}>
              Go Home
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
