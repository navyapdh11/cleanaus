import { initTRPC } from '@trpc/server';
import { CreateNextContextOptions } from '@trpc/server/adapters/next';
import SuperJSON from 'superjson';

// Context creation for Next.js API routes
export const createContext = async (opts: CreateNextContextOptions) => {
  const ip = opts.req.headers['x-forwarded-for'] || opts.req.socket.remoteAddress || 'unknown';
  
  return {
    ip: typeof ip === 'string' ? ip.split(',')[0] : Array.isArray(ip) ? ip[0] : 'unknown',
    headers: opts.req.headers,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

// tRPC initialization with context
const t = initTRPC.context<Context>().create({
  transformer: SuperJSON,
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const middleware = t.middleware;

// Rate limiting
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export const rateLimit = middleware(async ({ ctx, next, path }) => {
  const ip = ctx.ip;
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxRequests = 30;
  
  const current = rateLimitMap.get(ip) || { count: 0, resetAt: now + windowMs };
  
  if (now > current.resetAt) {
    current.count = 0;
    current.resetAt = now + windowMs;
  }
  
  current.count++;
  rateLimitMap.set(ip, current);
  
  if (current.count > maxRequests) {
    throw new Error(`Rate limit exceeded. Try again in ${Math.ceil((current.resetAt - now) / 1000)}s`);
  }
  
  return next();
});

// Timing middleware
export const timing = middleware(async ({ path, type, next }) => {
  const start = Date.now();
  const result = await next();
  const duration = Date.now() - start;
  
  if (!result.ok) {
    console.error(`[tRPC] ${path} (${type}) - ${duration}ms - ERROR`);
  }
  
  return result;
});

// Protected procedure with rate limiting and timing
export const protectedProcedure = t.procedure
  .use(timing)
  .use(rateLimit);
