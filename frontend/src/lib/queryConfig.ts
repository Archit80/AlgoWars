import { QueryClient, DefaultOptions } from '@tanstack/react-query';

// Optimized default query options for better performance
const queryConfig: DefaultOptions = {
  queries: {
    // Stale time - data is considered fresh for this duration
    staleTime: 5 * 60 * 1000, // 5 minutes
    // Cache time - how long data stays in cache after component unmounts
    gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime in v4)
    // Retry configuration
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors (client errors)
      if (error && typeof error === 'object' && 'status' in error) {
        const status = (error as any).status;
        if (status >= 400 && status < 500) return false;
      }
      return failureCount < 3;
    },
    // Refetch configuration
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: true,
    refetchOnReconnect: true,
  },
  mutations: {
    retry: 1, // Only retry mutations once
  },
};

// Create optimized query client factory
export function createOptimizedQueryClient() {
  return new QueryClient({
    defaultOptions: queryConfig,
  });
}

// Pre-configured query client for immediate use
export const optimizedQueryClient = createOptimizedQueryClient();
