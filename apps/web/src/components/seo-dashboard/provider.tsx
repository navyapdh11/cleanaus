'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink, loggerLink } from '@trpc/client';
import { useState } from 'react';
import { trpc } from '@/lib/trpc/client';
import SuperJSON from 'superjson';

// NOTE: This component provides both tRPC and QueryClient contexts.
// The root Providers component may also provide a QueryClient, but having
// a separate one here is intentional to keep the SEO dashboard isolated.
export function SEOProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        loggerLink({
          enabled: () => process.env.NODE_ENV === 'development',
        }),
        httpBatchLink({
          url: '/api/trpc',
          transformer: SuperJSON,
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
