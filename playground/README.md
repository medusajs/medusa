# Medusa Playground

A self-contained demo environment and development validation sandbox for the Medusa monorepo.

## Prerequisites

- [Node.js](https://nodejs.org/) >= 20
- [Docker](https://www.docker.com/) with Docker Compose
- [Yarn](https://yarnpkg.com/) 3.x (the monorepo uses Yarn Berry)

## Quick Start

### 1. Build the monorepo

Playground references local packages via Yarn workspaces. You must build them first.

```bash
# From the repository root
cd /Users/huhui/Projects/medusa
yarn build
```

> **Tip:** On subsequent runs, only rebuild packages you modified.

### 2. Configure environment

```bash
cd playground
cp .env.template .env
```

The default `.env` works out of the box with the included `docker-compose.yml`.

### 3. Start infrastructure and seed data

```bash
yarn setup
```

This command:
1. Starts PostgreSQL and Redis via Docker Compose
2. Creates the database (`medusa db setup`)
3. Runs all module migrations (`medusa db migrate`)
4. Syncs link-module tables (`medusa db sync-links`)
5. Seeds demo products, categories, and customers (`medusa exec seed.ts`)

### 4. Run the dev server

```bash
yarn dev
```

- **Backend API:** `http://localhost:9000`
- **Admin Dashboard:** `http://localhost:9000/app`

The server watches for file changes and auto-reloads.

## Available Scripts

| Script | Description |
|--------|-------------|
| `yarn dev` | Start the Medusa backend + Admin Dashboard in dev mode |
| `yarn start` | Start the production server |
| `yarn setup` | One-shot: Docker up + DB setup + migrate + sync-links + seed |
| `yarn seed` | Run the demo data seed script |
| `yarn db:setup` | Create database and application user |
| `yarn db:migrate` | Run all module migrations |
| `yarn db:sync-links` | Sync link-module tables |
| `yarn clean` | Reset Docker volumes (wipes all data) |

## Demo Data

The seed script creates:

| Entity | Count |
|--------|-------|
| Product Categories | 5 |
| Products | 5 (with variants) |
| Product Variants | 14 |
| Customers | 5 |

## Development Workflow

When you modify code in `packages/` (e.g., a core module):

```bash
# 1. Rebuild the modified package
cd /Users/huhui/Projects/medusa/packages/<modified-package>
yarn build

# 2. The playground dev server will auto-reload on next restart
# (or immediately if backend HMR is enabled)
```

## Architecture

- **`medusa-config.ts`** — Full module configuration. All core modules are enabled with in-memory/local providers for zero external dependencies (besides PostgreSQL).
- **`docker-compose.yml`** — PostgreSQL 16 + Redis 7 services.
- **`src/scripts/seed.ts`** — Seed script that uses `@medusajs/core-flows` and module services to populate demo data.
- **`data/`** — Static JSON files for categories, products, and customers.

## Troubleshooting

### `medusa` command not found

Make sure the monorepo is built (`yarn build` from root). The `medusa` script in `package.json` points to the built CLI at `../../node_modules/@medusajs/cli/cli.js`.

### Port conflicts

```bash
lsof -i :5432    # PostgreSQL
lsof -i :6379    # Redis
lsof -i :9000    # Medusa backend
```

### Reset everything

```bash
yarn clean
yarn setup
```

This destroys the Docker volumes and re-creates the database from scratch.
