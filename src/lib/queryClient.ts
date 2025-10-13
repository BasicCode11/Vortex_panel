import { QueryClient } from '@tanstack/react-query';

// Create a client - this manages all your queries
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // How long data stays fresh (5 minutes)
      staleTime: 5 * 60 * 1000,
      // How long unused data stays in cache (10 minutes)
      gcTime: 10 * 60 * 1000,
      // Retry failed requests 1 time
      retry: 1,
      // Don't refetch when window regains focus
      refetchOnWindowFocus: false,
      // Don't refetch on mount if data is fresh
      refetchOnMount: false,
    },
  },
});
