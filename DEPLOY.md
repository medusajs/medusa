# Deploy Medusa — just give Coolify the repo URL

This repository ships a **complete, deployable Medusa application** (in
[`app/`](./app)) plus a root [`docker-compose.yml`](./docker-compose.yml) that
builds and runs **everything needed** — the Medusa server, the admin dashboard,
PostgreSQL, and Redis — from the repo alone. No scaffolding, no manual steps.

Images are **multi-arch**: they build natively on an **ARM VPS** (arm64) and
also run on x86_64.

## Deploy on Coolify (one URL)

1. **New Resource → Application → Public/Private Repository**, and paste this
   repo's URL.
2. **Build Pack: `Docker Compose`**.
   - Docker Compose location: `docker-compose.yml` (repo root).
3. **Environment variables** — set at least these (Coolify can generate random
   values for the secrets):

   ```env
   JWT_SECRET=<random 32+ chars>
   COOKIE_SECRET=<random 32+ chars>
   POSTGRES_PASSWORD=<random>
   ADMIN_CORS=https://<your-domain>
   AUTH_CORS=https://<your-domain>
   STORE_CORS=https://<your-storefront-domain>
   # Optional: auto-create the first admin user on first boot
   MEDUSA_ADMIN_EMAIL=you@example.com
   MEDUSA_ADMIN_PASSWORD=<a strong password>
   ```

4. **Deploy.** Coolify builds the app image, starts Postgres + Redis, runs
   database migrations automatically, and (if you set the admin vars) creates
   your admin user. The dashboard is at `https://<your-domain>/app`.

That's it — the same flow as any other Dockerized app you deploy.

> **Domain/port:** the app listens on **9000**. Point your Coolify domain at
> the `medusa` service on port 9000.

### No admin credentials set?

Create one anytime from the running container (Coolify → app → Terminal):

```bash
npx medusa user --email you@example.com --password yourpassword
```

## Run it locally (same stack)

```bash
docker compose up --build
# admin → http://localhost:9000/app
```

## Prefer Coolify-managed Postgres/Redis instead of the bundled ones?

You don't have to use the all-in-one stack. You can deploy just the app:

1. Create **PostgreSQL** and **Redis** resources in Coolify.
2. New **Application** → Build Pack = **Dockerfile**, with:
   - Dockerfile location: `app/Dockerfile`
   - Base directory / build context: `app`
   - Port: `9000`
3. Set `DATABASE_URL` and `REDIS_URL` to those resources' internal URLs, plus
   the `JWT_SECRET` / `COOKIE_SECRET` / `*_CORS` vars (see
   [`app/.env.template`](./app/.env.template)).

## Multi-architecture builds

The base `node:20-alpine` images are published for amd64, arm64 and arm/v7, so
`docker build` on your ARM VPS produces a native image. To build one image that
runs everywhere and push it to a registry:

```bash
docker buildx build \
  -f app/Dockerfile \
  --platform linux/amd64,linux/arm64 \
  -t <registry>/medusa:latest \
  --push ./app
```

## What's in `app/`

A standard Medusa v2 application (pinned to `2.15.5`): `medusa-config.ts`,
`package.json` with the usual `build`/`start`/`predeploy` scripts, a `src/`
folder for your customizations, and a self-contained production `Dockerfile`
with an entrypoint that runs migrations (and optional seed/admin-user creation)
before starting the server.

> This is independent of the Medusa **framework monorepo** that also lives in
> this repo (`packages/`). The deployable app uses the published `@medusajs/*`
> packages from npm, so it builds without the monorepo workspace.
