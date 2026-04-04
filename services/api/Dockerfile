# API Service Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@8.15.0 --activate

# Copy package files
COPY package.json pnpm-workspace.yaml ./
COPY services/api/package.json ./services/api/

# Install dependencies
RUN pnpm install --frozen-lockfile --filter @cleanaus/api...

# Copy source
COPY services/api/ ./services/api/

# Build
RUN cd services/api && pnpm build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@8.15.0 --activate

# Copy package files and install production dependencies
COPY services/api/package.json ./
RUN pnpm install --prod --frozen-lockfile

# Copy built application
COPY --from=builder /app/services/api/dist ./dist

# Health check
RUN apk add --no-cache curl
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

EXPOSE 3001

ENV NODE_ENV=production

CMD ["node", "dist/main.js"]
