'use client';

import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ApiErrorProps {
  error?: Error | null;
  message?: string;
  onRetry?: () => void;
  showHomeButton?: boolean;
}

export function ApiError({
  error,
  message = 'Failed to load content',
  onRetry,
  showHomeButton = true,
}: ApiErrorProps) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-red-500/10 p-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
        </div>
        
        <h2 className="mb-3 text-2xl font-bold text-white">
          {message}
        </h2>
        
        {error && (
          <p className="mb-6 text-sm text-gray-400">
            {error.message || 'An unexpected error occurred'}
          </p>
        )}
        
        <div className="flex gap-3 justify-center">
          {onRetry && (
            <Button onClick={onRetry} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          )}
          
          {showHomeButton && (
            <Button
              variant="outline"
              onClick={() => (window.location.href = '/')}
              className="gap-2"
            >
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
