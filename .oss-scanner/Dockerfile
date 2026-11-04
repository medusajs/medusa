# Build environment for Anthropic's OSS Scanner (https://github.com/anthropics/oss-scanner).
# The scanner builds this file with the repository root as the build context, then runs the audit with no network
# access, so everything the build and the tests need is installed here. Mirrors .github/workflows/action.yml:
# Node 22, `yarn install --immutable`, `yarn build`, and a local Postgres + Redis for the integration tests.
FROM node:22-bookworm
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y --no-install-recommends \
      ca-certificates git python3 build-essential postgresql redis-server \
    && rm -rf /var/lib/apt/lists/*

# Integration tests connect with these credentials (see packages/medusa-test-utils/src/database.ts).
ENV DB_HOST=localhost \
    DB_USERNAME=postgres \
    DB_PASSWORD=postgres \
    REDIS_URL=redis://localhost:6379 \
    NODE_OPTIONS=--max-old-space-size=8192 \
    TURBO_TELEMETRY_DISABLED=1

# `start-services` boots Postgres and Redis in the background. Run it before any integration test or before
# starting a Medusa server.
RUN printf '%s\n' \
      '#!/bin/sh' \
      'set -e' \
      'service postgresql start' \
      'redis-server --daemonize yes' \
      'until pg_isready -h localhost -q; do sleep 1; done' \
      > /usr/local/bin/start-services \
    && chmod +x /usr/local/bin/start-services \
    && service postgresql start \
    && su postgres -c "psql -c \"ALTER USER postgres PASSWORD 'postgres';\"" \
    && service postgresql stop

# scanner contract: the checkout lives inside the image, at /src
COPY . /src
WORKDIR /src

# Yarn 3 is vendored in .yarn/releases (yarnPath in .yarnrc.yml); the global yarn delegates to it.
RUN yarn install --immutable --inline-builds

# Build every workspace package (and the plugin bundles), as CI does. A failing build fails the image.
RUN yarn build

# Run the cheap unit tests of the HTTP layer so you know the image works, but do not let a failing test abort the
# build. Integration tests need `start-services` first, e.g.:
#   start-services && cd integration-tests/http && npx jest __tests__/product
RUN (yarn workspace @medusajs/framework test || echo "WARNING: @medusajs/framework unit tests reported failures")
