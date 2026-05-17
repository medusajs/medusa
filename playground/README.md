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

## China E-commerce Modules

This playground includes China e-commerce adaptations with 7 new modules and extended Product/Variant/Inventory models.

### New Modules

| Module | Description |
|--------|-------------|
| **Brand** | Brand management with org association |
| **Organization** | Multi-brand/department hierarchy |
| **Shop** | Multi-platform shop management (Taobao, Douyin, JD, etc.) |
| **Material** | Basic material + sales material + combo items |
| **Platform Mapping** | Platform SKU mapping + sync task queue |
| **Channel Price** | Multi-channel pricing (retail/wholesale/supply) |
| **Store Inventory** | O2O store inventory management |

### Extended Models

| Model | New Fields |
|-------|-----------|
| **Product** | `spu_code`, `brand_id`, `brief`, `unit`, `product_type`, `sn_managed`, `published_at`, `unpublished_at`, `sort_order`, `visibility` |
| **ProductVariant** | `sku_code`, `unit`, `cost_price`, `market_price`, `alert_stock`, `purchase_limit`, `spec_info` |
| **InventoryItem** | `alert_stock`, `stock_controlled` |

### Seed China E-commerce Data

```bash
yarn medusa exec scripts/seed-china.ts
```

This creates sample organizations, brands, shops, materials, platform SKUs, channel prices, and store inventory.

### Admin API Routes

All new modules expose CRUD admin API routes:

| Route | Module |
|-------|--------|
| `POST /admin/brands` | Brand |
| `POST /admin/organizations` | Organization |
| `POST /admin/shops` | Shop |
| `POST /admin/basic-materials` | Material |
| `POST /admin/sales-materials` | Material |
| `POST /admin/platform-skus` | Platform Mapping |
| `POST /admin/platform-sync-tasks` | Platform Mapping |
| `POST /admin/channel-prices` | Channel Price |
| `POST /admin/store-inventories` | Store Inventory |

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
