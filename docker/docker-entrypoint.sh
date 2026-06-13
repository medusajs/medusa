#!/bin/sh
set -e

# -----------------------------------------------------------------------------
# Entrypoint for the Medusa production container.
#
# Runs database migrations before starting the server. Migrations are
# idempotent, so it is safe to run on every boot. Disable by setting
# MEDUSA_RUN_MIGRATIONS=false (e.g. if you run migrations as a separate job).
# -----------------------------------------------------------------------------

if [ "${MEDUSA_RUN_MIGRATIONS:-true}" = "true" ]; then
  echo "[entrypoint] Running database migrations..."
  npx medusa db:migrate
else
  echo "[entrypoint] Skipping migrations (MEDUSA_RUN_MIGRATIONS=false)"
fi

# Optionally seed the database on first boot (off by default).
if [ "${MEDUSA_RUN_SEED:-false}" = "true" ]; then
  echo "[entrypoint] Seeding database..."
  npm run seed || echo "[entrypoint] Seed step failed or not defined, continuing."
fi

echo "[entrypoint] Starting Medusa..."
exec "$@"
