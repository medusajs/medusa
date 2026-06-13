# syntax=docker/dockerfile:1

# -----------------------------------------------------------------------------
# Production Dockerfile for a Medusa v2 application.
#
# This image is multi-arch friendly: the `node` base images publish
# linux/amd64, linux/arm64 and linux/arm/v7 variants, so it builds natively on
# an ARM VPS and can be cross-built for other architectures with buildx
# (see docker/README.md).
#
# Place this file (together with .dockerignore and docker-entrypoint.sh) at the
# ROOT of your Medusa application — the directory that holds medusa-config.ts
# and your package.json with the `build`/`start` scripts.
# -----------------------------------------------------------------------------

ARG NODE_VERSION=20

# -----------------------------------------------------------------------------
# base — shared runtime layer used by every stage
# -----------------------------------------------------------------------------
FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /app
# libc6-compat lets prebuilt native modules (e.g. sharp) load on Alpine/musl.
RUN apk add --no-cache libc6-compat
ENV CI=true

# -----------------------------------------------------------------------------
# deps — install full dependencies (incl. dev) needed to build the app
# -----------------------------------------------------------------------------
FROM base AS deps
# Toolchain for any dependency that has to compile native bindings.
RUN apk add --no-cache python3 make g++
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
RUN \
  if [ -f yarn.lock ]; then \
    corepack enable && yarn install --frozen-lockfile; \
  elif [ -f package-lock.json ]; then \
    npm ci; \
  elif [ -f pnpm-lock.yaml ]; then \
    corepack enable && pnpm install --frozen-lockfile; \
  else \
    echo "No lockfile found, falling back to npm install" && npm install; \
  fi

# -----------------------------------------------------------------------------
# build — compile the server and bundle the admin dashboard
# `medusa build` emits a self-contained app into .medusa/server, including the
# admin UI under .medusa/server/public/admin.
# -----------------------------------------------------------------------------
FROM deps AS build
COPY . .
ENV NODE_ENV=production
RUN npm run build
# Install only production dependencies *inside* the built output so the runner
# stage stays small and never carries dev/build tooling.
RUN cd .medusa/server && \
  if [ -f /app/yarn.lock ]; then \
    corepack enable && yarn install --frozen-lockfile --production; \
  else \
    npm install --omit=dev; \
  fi

# -----------------------------------------------------------------------------
# runner — minimal production image
# -----------------------------------------------------------------------------
FROM base AS runner
ENV NODE_ENV=production \
    PORT=9000

# Run as an unprivileged user.
RUN addgroup -S medusa && adduser -S medusa -G medusa

# The built server is the deployable unit; copy it in as the app root.
COPY --from=build --chown=medusa:medusa /app/.medusa/server ./
COPY --chown=medusa:medusa docker/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

USER medusa

EXPOSE 9000

# Lightweight healthcheck against Medusa's health endpoint.
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=5 \
  CMD wget -qO- http://127.0.0.1:${PORT}/health || exit 1

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npm", "run", "start"]
