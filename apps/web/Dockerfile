# Web Service Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@8.15.0 --activate

COPY package.json pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/

RUN pnpm install --frozen-lockfile --filter @cleanaus/web...

COPY apps/web/ ./apps/web/

RUN cd apps/web && pnpm build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@8.15.0 --activate

COPY apps/web/package.json ./
RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/apps/web/.next ./.next
COPY --from=builder /app/apps/web/public ./public
COPY --from=builder /app/apps/web/next.config.js ./

EXPOSE 3000

ENV NODE_ENV=production

CMD ["pnpm", "start"]
