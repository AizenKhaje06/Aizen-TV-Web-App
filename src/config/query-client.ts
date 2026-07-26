import { QueryClient, DefaultOptions } from '@tanstack/react-query';

const queryConfig: DefaultOptions = {
  queries: {
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes (optimized for offline)
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors (client errors)
      if (error instanceof Error && 'status' in error) {
        const status = (error as any).status;
        if (status >= 400 && status < 500) return false;
      }
      // Retry up to 3 times for other errors
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    // Network mode for better offline handling
    networkMode: 'offlineFirst',
  },
  mutations: {
    retry: 1,
    networkMode: 'offlineFirst',
  },
};

export const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: queryConfig,
  });
};
