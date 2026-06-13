# Deploying Medusa with Docker & Coolify

A production-ready, **multi-architecture** Docker setup for self-hosting a
Medusa v2 application — built and tested to run natively on an **ARM VPS**
(e.g. Ampere / Raspberry Pi / AWS Graviton) while remaining fully compatible
with `x86_64` (amd64).

> **Important:** This `docker/` folder belongs to a **Medusa application** —
> the project you created with `npx create-medusa-app` (the one that contains
> `medusa-config.ts` and a `package.json` with `build`/`start` scripts). It is
> **not** for building the Medusa framework monorepo itself. Copy this folder
> into your app to use it.

## What's in here

| File | Purpose |
| --- | --- |
| `Dockerfile` | Multi-stage, multi-arch production build. Compiles the server **and** bundles the admin dashboard. Runs as a non-root user. |
| `docker-entrypoint.sh` | Runs DB migrations (idempotent) before starting Medusa. |
| `.dockerignore` | Keeps the build context small. Copy to your app root. |
| `docker-compose.yml` | Local/all-in-one stack: app + Postgres + Redis. |
| `.env.example` | The environment variables Medusa needs in production. |
| `github-workflow-docker.yml.example` | Optional CI to publish a multi-arch image to `ghcr.io`. |

## 1. Add the files to your Medusa app

From the root of your Medusa application:

```bash
# copy the docker/ folder in
cp -r path/to/docker ./docker
# the .dockerignore must live at the app root
cp ./docker/.dockerignore ./.dockerignore
```

Your app's `package.json` should already have these scripts (the
create-medusa-app default):

```jsonc
{
  "scripts": {
    "build": "medusa build",
    "start": "medusa start"
  }
}
```

## 2. Why this is multi-arch

The image is based on the official `node:20-alpine` images, which Docker
publishes for `linux/amd64`, `linux/arm64` **and** `linux/arm/v7`. That means:

- On your **ARM VPS**, `docker build` produces a native arm64 image — no
  emulation, full speed.
- On an x86 build host / CI, you get an amd64 image.
- `libc6-compat` is installed so prebuilt native modules (like `sharp`) load
  correctly on Alpine's musl libc across architectures.

### Build for one architecture (your VPS)

```bash
# Run this on the VPS (or any arm64 host)
docker build -f docker/Dockerfile -t my-medusa:latest .
```

### Build a single image that runs on many architectures

Use Buildx to cross-build and push a multi-arch manifest (great for the
"maybe they'll accept my PR" plan — one tag, every arch):

```bash
docker buildx create --use --name medusa-builder   # once
docker buildx build \
  -f docker/Dockerfile \
  --platform linux/amd64,linux/arm64 \
  -t ghcr.io/<you>/medusa:latest \
  --push .
```

## 3. Deploy on Coolify (recommended: managed Postgres + Redis)

This is the cleanest setup: Postgres and Redis are separate Coolify resources,
the app connects to them over env vars, and backups are managed per-resource.

1. **Create a PostgreSQL resource** in Coolify. Copy its internal connection
   string — you'll use it as `DATABASE_URL`.
2. **Create a Redis resource** in Coolify. Copy its internal URL for `REDIS_URL`.
3. **Create a new Application** → source = your Git repo.
   - **Build Pack:** *Dockerfile*
   - **Dockerfile location:** `docker/Dockerfile`
   - **Base directory / build context:** the repo root (`.`)
   - **Port:** `9000`
4. **Environment variables** (Application → Environment Variables): set the
   values from `.env.example`. At minimum:

   ```env
   NODE_ENV=production
   DATABASE_URL=postgres://...     # from the Coolify Postgres resource
   REDIS_URL=redis://...           # from the Coolify Redis resource
   JWT_SECRET=<openssl rand -hex 32>
   COOKIE_SECRET=<openssl rand -hex 32>
   ADMIN_CORS=https://admin.your-domain.com
   STORE_CORS=https://store.your-domain.com
   AUTH_CORS=https://admin.your-domain.com,https://store.your-domain.com
   ```

   Mark `JWT_SECRET` and `COOKIE_SECRET` as **secrets**.
5. **Healthcheck:** the image already exposes `GET /health`; point Coolify's
   healthcheck at port `9000` path `/health` if you want it surfaced in the UI.
6. **Deploy.** On boot the container runs `medusa db:migrate` automatically,
   then starts the server. The admin dashboard is served at
   `https://<your-domain>/app`.

> **Migrations:** they run on every start (safe — they're idempotent). To run
> them as a separate step instead, set `MEDUSA_RUN_MIGRATIONS=false` and run
> `medusa db:migrate` via a one-off command.

### Create your first admin user

After the first deploy, open a terminal on the running container (Coolify →
your app → Terminal) and run:

```bash
npx medusa user --email you@example.com --password yourpassword
```

## 4. Alternative: all-in-one Compose stack

If you'd rather deploy one self-contained stack (app + Postgres + Redis
together), Coolify supports **Docker Compose** deployments — point it at
`docker/docker-compose.yml`. This is also what you run locally:

```bash
# from your app root
docker compose -f docker/docker-compose.yml up --build
```

Set `JWT_SECRET`, `COOKIE_SECRET` and the `*_CORS` values as env vars rather
than relying on the insecure defaults. Data is persisted in the
`medusa-postgres` and `medusa-redis` volumes.

## 5. The admin dashboard

The admin UI is compiled into the image during `medusa build` and served by the
backend at `/app`. If you host the backend behind a custom domain and the admin
needs to know its public URL, set `MEDUSA_ADMIN_BACKEND_URL` at **build time**
(it's baked into the admin bundle).

## Troubleshooting

- **Admin can't reach the API / CORS errors:** double-check `ADMIN_CORS`,
  `STORE_CORS`, `AUTH_CORS` match the exact origins (scheme + host + port).
- **Migrations fail on boot:** confirm `DATABASE_URL` is reachable from the app
  container and the DB user can create tables.
- **Native module errors on ARM:** they should be resolved by `libc6-compat`;
  if a specific dependency still fails, it likely lacks an arm64 prebuilt
  binary — the `deps` stage already includes `python3 make g++` so it can
  compile from source.
