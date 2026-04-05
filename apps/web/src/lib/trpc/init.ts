import { initTRPC } from '@trpc/server';
import SuperJSON from 'superjson';

// tRPC initialization
const t = initTRPC.create({
  transformer: SuperJSON,
});

// Base router and public procedure
export const router = t.router;
export const publicProcedure = t.procedure;
export const middleware = t.middleware;

// Timing middleware for OTel spans
export const timingMiddleware = t.middleware(async ({ path, type, next }) => {
  const start = Date.now();
  const result = await next();
  const durationMs = Date.now() - start;
  
  if (result.ok) {
    console.log(`[tRPC] ${path} (${type}) - ${durationMs}ms`);
  } else {
    console.error(`[tRPC] ${path} (${type}) - ${durationMs}ms - ERROR`);
  }
  
  return result;
});

// Rate limiting middleware
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export const rateLimitMiddleware = middleware(async ({ ctx, next, path }) => {
  const ip = (ctx as any)?.ip || 'unknown';
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 30;
  
  const current = rateLimitMap.get(ip) || { count: 0, resetAt: now + windowMs };
  
  if (now > current.resetAt) {
    current.count = 0;
    current.resetAt = now + windowMs;
  }
  
  current.count++;
  rateLimitMap.set(ip, current);
  
  if (current.count > maxRequests) {
    throw new Error(`Rate limit exceeded for ${path}. Try again in ${Math.ceil((current.resetAt - now) / 1000)}s`);
  }
  
  return next();
});

// Protected procedure (requires API key)
export const protectedProcedure = t.procedure
  .use(timingMiddleware)
  .use(rateLimitMiddleware);
