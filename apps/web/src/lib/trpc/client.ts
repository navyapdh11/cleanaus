import { createTRPCReact } from '@trpc/react-query';
import type { SEORouter } from './routers/seo';

export const trpc = createTRPCReact<SEORouter>();
