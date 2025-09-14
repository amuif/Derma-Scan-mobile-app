import React, { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: (failureCount, error: any) => {
        if (error.message?.includes('401') || error.message?.includes('403')) {
          return false;
        }
        return failureCount < 2;
      },
    },
  },
});

interface AuthProviderProps {
  children: ReactNode;
}

export function ReactQueryProvider({ children }: AuthProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

// Auth Provider (if you need to combine with other context)
export function AuthProvider({ children }: AuthProviderProps) {
  // This component can be used to provide additional auth context
  // if needed, alongside React Query
  return <>{children}</>;
}
