#!/bin/sh
set -e

# Run idempotent DB migrations before boot (disable with MEDUSA_RUN_MIGRATIONS=false).
if [ "${MEDUSA_RUN_MIGRATIONS:-true}" = "true" ]; then
  echo "[entrypoint] Running database migrations..."
  npx medusa db:migrate
else
  echo "[entrypoint] Skipping migrations (MEDUSA_RUN_MIGRATIONS=false)"
fi

# Optional one-off seed (off by default).
if [ "${MEDUSA_RUN_SEED:-false}" = "true" ]; then
  echo "[entrypoint] Seeding database..."
  npm run seed || echo "[entrypoint] Seed step failed or skipped, continuing."
fi

# Optionally create an admin user on first boot if credentials are provided.
if [ -n "${MEDUSA_ADMIN_EMAIL}" ] && [ -n "${MEDUSA_ADMIN_PASSWORD}" ]; then
  echo "[entrypoint] Ensuring admin user ${MEDUSA_ADMIN_EMAIL} exists..."
  npx medusa user --email "${MEDUSA_ADMIN_EMAIL}" --password "${MEDUSA_ADMIN_PASSWORD}" \
    || echo "[entrypoint] Admin user already exists or could not be created, continuing."
fi

echo "[entrypoint] Starting Medusa..."
exec "$@"
