FROM oven/bun:1 AS base
WORKDIR /app

FROM base AS deps
COPY package.json bun.lock* ./
RUN bun install --no-save --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN bun run build

FROM base AS runner
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME="0.0.0.0"

# Ensure adduser/addgroup (or useradd/groupadd) is available, then create the group and user
RUN if command -v apt-get >/dev/null 2>&1; then \
      apt-get update && apt-get install -y --no-install-recommends adduser && rm -rf /var/lib/apt/lists/*; \
    elif command -v apk >/dev/null 2>&1; then \
      apk add --no-cache shadow && rm -rf /var/cache/apk/*; \
    fi && \
    if command -v addgroup >/dev/null 2>&1 && command -v adduser >/dev/null 2>&1; then \
      addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 --ingroup nodejs --disabled-password --home /nonexistent --shell /sbin/nologin nextjs; \
    else \
      groupadd -g 1001 nodejs || true && useradd -u 1001 -g nodejs -M -s /sbin/nologin nextjs || true; \
    fi

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
CMD ["bun", "./server.js"]
