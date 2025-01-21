# Base image
FROM node:20-alpine AS base

### Dependencies ###
FROM base AS deps
RUN apk add --no-cache libc6-compat git curl

# Setup pnpm environment
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prefer-frozen-lockfile

# Builder
FROM base AS builder

WORKDIR /app

COPY . ./
COPY --from=deps /app/node_modules ./node_modules
RUN pnpm build

### Production image runner ###
FROM base AS runner

# Copy curl from deps stage
COPY --from=deps /usr/bin/curl /usr/bin/curl

# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED 1

# Set correct permissions for nextjs user and don't run as root
RUN addgroup nodejs
RUN adduser -SDH nextjs
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy built app from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

# Exposed port (for orchestrators and dynamic reverse proxies)
EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD ["curl", "-f", "http://localhost:3000/health"]

# Run the next.js app
CMD ["node", "server.js"]
