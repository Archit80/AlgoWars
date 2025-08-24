// Optimized React Query configuration for better performance
import { QueryClient } from '@tanstack/react-query';

export const createOptimizedQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      // Reduce network requests
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime)
      
      // Faster retry strategy
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        return failureCount < 2; // Only retry twice
      },
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 5000),
      
      // Background refetching optimizations
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: 'always',
      
      // Network mode for better offline handling
      networkMode: 'online',
    },
    mutations: {
      // Faster mutation retry
      retry: 1,
      networkMode: 'online',
    },
  },
});

// Pre-configured query options for common patterns
export const queryOptions = {
  // For real-time data (leaderboard, match status)
  realtime: {
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 30 * 1000, // Refetch every 30s
  },
  
  // For static data (questions, user profiles)
  static: {
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
  },
  
  // For user-specific data
  user: {
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: true,
  },
};
