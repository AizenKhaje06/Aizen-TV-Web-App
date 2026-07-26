'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import { createQueryClient } from '@/config/query-client';
import { ErrorBoundary } from '@/components/common/error-boundary';
import { TVDetector } from '@/components/tv/tv-detector';
import { NavigationProvider } from '@/lib/navigation';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => createQueryClient());

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <NavigationProvider config={{ debug: process.env.NODE_ENV === 'development' }}>
          <TVDetector />
          {children}
          {process.env.NODE_ENV === 'development' && (
            <ReactQueryDevtools initialIsOpen={false} />
          )}
        </NavigationProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
