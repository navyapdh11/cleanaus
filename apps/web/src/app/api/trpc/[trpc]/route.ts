import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { seoRouter } from '@/lib/trpc/routers/seo';

// Next.js App Router tRPC API handler
const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: seoRouter,
    createContext: () => ({
      ip: req.headers.get('x-forwarded-for') || '127.0.0.1',
      headers: Object.fromEntries(req.headers.entries()),
    }),
  });

export { handler as GET, handler as POST };
