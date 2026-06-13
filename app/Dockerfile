# syntax=docker/dockerfile:1

# -----------------------------------------------------------------------------
# Production image for this Medusa application.
#
# Multi-arch: based on the official `node` images (linux/amd64, linux/arm64,
# linux/arm/v7), so it builds natively on an ARM VPS and cross-builds for x86
# with buildx. Build context is this `app/` directory.
# -----------------------------------------------------------------------------

ARG NODE_VERSION=20

# --- base -------------------------------------------------------------------
FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat
ENV CI=true

# --- deps: full deps needed to build ---------------------------------------
FROM base AS deps
RUN apk add --no-cache python3 make g++
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
RUN \
  if [ -f yarn.lock ]; then corepack enable && yarn install --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable && pnpm install --frozen-lockfile; \
  else npm install; fi

# --- build: compile server + bundle admin dashboard ------------------------
FROM deps AS build
COPY . .
ENV NODE_ENV=production
RUN npm run build
# Install prod-only deps inside the build output for a lean runtime.
RUN cd .medusa/server && \
  if [ -f /app/yarn.lock ]; then corepack enable && yarn install --frozen-lockfile --production; \
  else npm install --omit=dev; fi

# --- runner: minimal production image --------------------------------------
FROM base AS runner
ENV NODE_ENV=production \
    PORT=9000
RUN addgroup -S medusa && adduser -S medusa -G medusa
COPY --from=build --chown=medusa:medusa /app/.medusa/server ./
COPY --chown=medusa:medusa docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
USER medusa
EXPOSE 9000
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=5 \
  CMD wget -qO- http://127.0.0.1:${PORT}/health || exit 1
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npm", "run", "start"]
