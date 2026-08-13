# Waylo Medusa Fork Operations Plan

## Context

The `my-medusa-store` repository currently has local changes for running the
DTC starter in Docker:

- `Dockerfile`, `.dockerignore`, `docker-compose.yml`, `start.sh`, and
  `start-storefront.sh` add a local Docker Compose development environment.
- `apps/backend/medusa-config.ts` was adjusted for Docker networking,
  Redis, disabled local Postgres SSL, and Admin Vite HMR.
- `package.json` gained `docker:up` and `docker:down` scripts.
- `apps/storefront/.env.template` was deleted.

These files are starter-application infrastructure. They should not be copied
directly into this fork because this repository is the Medusa framework
monorepo, uses Yarn, and does not contain the `apps/backend` and
`apps/storefront` starter layout.

## What Belongs In This Fork

Use this fork for reusable platform changes that must be owned by Waylo:

- Order creation behavior that changes core API, workflows, validation, or
  module behavior.
- Admin UI changes under `packages/admin/dashboard`.
- Core workflows under `packages/core/core-flows`, especially order, cart,
  payment, and fulfillment flows.
- Module changes under `packages/modules/*` when Waylo needs different default
  commerce behavior.
- Framework, CLI, or package changes needed by all future Waylo instances.

Do not put per-store deployment files or starter app config directly in the
framework root unless they are intentionally maintained as Waylo templates.

## What Stays In Application Repositories

Keep these in deployable Medusa application repos, such as `my-medusa-store` or
future instance repositories:

- `medusa-config.ts` values for one environment or instance.
- Storefront-specific files and environment templates.
- Fly.io app names, secrets, volumes, and region choices.
- Per-instance Docker Compose files.
- Data seeding and one-off migration scripts for a specific customer or store.

## Recommended Structure

Short term:

1. Keep `gowaylo/medusa` as the Waylo-owned Medusa platform fork.
2. Keep each deployable store as an application repository that depends on the
   Waylo fork package versions.
3. Build and deploy two Medusa application processes per environment:
   `server` and `worker`.
4. Use managed Postgres and Redis for Fly.io rather than running them inside the
   app container.

Medium term:

1. Create a reusable Waylo Medusa application template repository.
2. Add Fly.io templates there, not in the framework fork.
3. Publish or consume Waylo Medusa packages from the fork through a controlled
   build/release path.
4. Keep all order and Admin product changes in this fork with tests close to
   the changed packages.

Long term:

1. Move the same application image to Kubernetes.
2. Model Medusa server and worker as separate Deployments.
3. Use External Secrets or a cloud secret manager for database, Redis, JWT, and
   cookie secrets.
4. Use managed Postgres and managed Redis first; only self-host data services
   if there is a clear operational reason.
5. Add migrations as an explicit Job or release step before rolling out server
   and worker workloads.

## Fly.io Guidance

For Fly.io, prefer one Docker image with separate process commands:

- `server`: runs migrations during release or pre-start, then starts Medusa in
  server mode.
- `worker`: starts Medusa in worker mode without exposing public HTTP traffic.

Keep secrets in Fly secrets:

- `DATABASE_URL`
- `REDIS_URL`
- `JWT_SECRET`
- `COOKIE_SECRET`
- `STORE_CORS`
- `ADMIN_CORS`
- `AUTH_CORS`
- provider credentials for payment, file, notification, and search modules

Avoid disabling Postgres SSL globally in production. The Docker Compose change
from `my-medusa-store` is useful for local containers, but production should
follow the database provider's SSL requirements.

## Kubernetes Guidance

Design the Fly deployment so it maps cleanly to Kubernetes later:

- Use the same image for `server` and `worker`.
- Configure behavior with environment variables, not different code branches.
- Keep migrations as a separate, repeatable command.
- Use readiness and liveness probes against the server process.
- Use horizontal scaling for stateless server and worker pods.
- Keep file storage external, such as S3-compatible storage.
- Keep image builds independent from runtime secrets.

## Migration Decision For Current Local Changes

Move none of the current `my-medusa-store` changed files directly into this
framework fork.

Instead:

- Keep the Docker Compose changes in `my-medusa-store` if that repo is still
  used for local development.
- Recreate Fly.io deployment files in the deployable application repository
  once the instance repo shape is chosen.
- Implement order creation and Admin UI changes directly in this fork, package
  by package, with tests before each push.
