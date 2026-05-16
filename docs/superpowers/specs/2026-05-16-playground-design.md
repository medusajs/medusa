# Playground / Dev Mode Design Spec

## Overview

Add a self-contained `playground/` directory to the Medusa monorepo that provides:

1. **Quick-start demo environment** — Run `yarn setup && yarn dev` to spin up a fully working Medusa instance with demo data and Admin Dashboard.
2. **Development validation sandbox** — Modify core packages (`packages/*`) and immediately verify changes through the playground without touching existing code.

**Constraint**: Zero modifications to existing packages. The playground lives entirely inside its own directory and uses yarn workspace references to consume local packages.

---

## Architecture

```
playground/
├── docker-compose.yml          # PostgreSQL 16 + Redis 7 services
├── medusa-config.ts            # Full module configuration (all core modules + admin)
├── package.json                # Workspace refs to monorepo packages + CLI scripts
├── tsconfig.json               # Extends monorepo base config
├── .env.template               # Environment variable template
├── .env                        # Local environment (gitignored)
├── src/
│   ├── scripts/
│   │   └── seed.ts             # Demo data seed script (medusa exec entry)
│   └── admin/
│       └── ...                 # Optional admin customizations
└── data/
    ├── categories.json         # Product category definitions
    ├── products.json           # Products with variants/options
    ├── customers.json          # Customer records
    └── orders.json             # Order records (optional, can be generated)
```

### Workspace Integration

`playground/package.json` uses yarn workspace protocol to reference monorepo packages:

```json
{
  "dependencies": {
    "@medusajs/medusa": "workspace:*",
    "@medusajs/framework": "workspace:*",
    "@medusajs/core-flows": "workspace:*",
    "@medusajs/admin-bundler": "workspace:*"
  }
}
```

Root `package.json` workspaces array includes `"playground"` so yarn resolves local packages correctly.

---

## Startup Flow

### First-time Setup

```bash
cd playground
yarn setup
```

`setup` script executes sequentially:

1. `docker compose up -d` — Start PostgreSQL + Redis
2. `medusa db setup` — Create database and user
3. `medusa db migrate` — Run all module migrations
4. `medusa db sync-links` — Synchronize link module tables
5. `medusa exec ./src/scripts/seed.ts` — Insert demo data

### Daily Development

```bash
yarn dev   # medusa develop — starts backend + admin with file watching
```

When core packages are modified:

1. Run `yarn build` (or `yarn watch`) in the modified package
2. Playground auto-picks up changes on next dev server restart (or HMR if backend HMR is enabled)

---

## Demo Data Seed Strategy

### Data Scope (Medium Richness)

| Entity            | Count  | Source                |
|-------------------|--------|-----------------------|
| Store             | 1      | createDefaultsWorkflow |
| Region            | 1      | createDefaultsWorkflow |
| Sales Channel     | 1      | createDefaultsWorkflow |
| Currencies        | 5      | createDefaultsWorkflow |
| Product Categories| 5-8    | data/categories.json  |
| Products          | 15-20  | data/products.json    |
| Customers         | 10     | data/customers.json   |
| Orders            | 10-15  | Generated at seed time |

### Seed Script (`src/scripts/seed.ts`)

```typescript
export default async function seed({ container }) {
  // 1. Skeleton (store, region, currency, sales channel)
  await createDefaultsWorkflow(container).run()

  // 2. Categories
  const productModule = container.resolve(Modules.PRODUCT)
  const categories = await productModule.createProductCategories(categoriesData)

  // 3. Products with variants/options
  const products = await productModule.createProducts(productsData)

  // 4. Customers
  const customerModule = container.resolve(Modules.CUSTOMER)
  await customerModule.createCustomers(customersData)

  // 5. Orders (generated from products/customers)
  // ...
}
```

Static data lives in `data/*.json`. Dynamic relationships (orders) are computed at seed time.

---

## Environment Configuration

### `.env.template`

```bash
DATABASE_URL=postgres://postgres:password@localhost:5432/medusa_playground
REDIS_URL=redis://localhost:6379

JWT_SECRET=playground-jwt-secret
COOKIE_SECRET=playground-cookie-secret

ADMIN_CORS=http://localhost:9000
LOG_LEVEL=info
```

### `docker-compose.yml`

- **postgres**: `postgres:16`, port `5432`, named volume `pgdata`
- **redis**: `redis:7-alpine`, port `6379`

---

## Module Configuration (`medusa-config.ts`)

Enables all core modules with sensible defaults:

- **File**: `file-local` provider with `upload_dir` under `playground/.medusa/uploads`
- **Notification**: `notification-local` with `feed` channel
- **Fulfillment**: `fulfillment-manual`
- **Auth**: `auth-emailpass`
- **Workflow Engine**: `workflow-engine-inmemory` (Redis optional)
- **Cache**: `cache-inmemory` (Redis optional)
- **Event Bus**: `event-bus-local` (Redis optional)

All other modules use their default auto-resolved configurations.

---

## CLI Scripts (package.json)

| Script        | Command                                           | Purpose                  |
|---------------|---------------------------------------------------|--------------------------|
| `setup`       | `docker compose up -d && sleep 3 && yarn db:setup && yarn db:migrate && yarn db:sync-links && yarn seed` | First-time bootstrap     |
| `dev`         | `medusa develop`                                  | Start dev server + admin |
| `start`       | `medusa start`                                    | Start production server  |
| `db:setup`    | `medusa db setup`                                 | Create DB/user           |
| `db:migrate`  | `medusa db migrate`                               | Run migrations           |
| `db:sync-links` | `medusa db sync-links`                          | Sync link tables         |
| `seed`        | `medusa exec ./src/scripts/seed.ts`               | Insert demo data         |
| `clean`       | `docker compose down -v && docker compose up -d`  | Reset database           |

---

## Isolation Guarantee

| Rule                                | Implementation                                      |
|-------------------------------------|-----------------------------------------------------|
| No source code changes in packages  | All files under `playground/` only                  |
| No CLI command additions            | Reuse existing `medusa develop`, `medusa db setup`, etc. |
| No test interference                | Separate DB name (`medusa_playground`)              |
| No build artifacts in repo          | `.gitignore` excludes `.medusa/`, `node_modules/`, `.env` |
| Optional workspace registration     | Root workspaces add `"playground"` (config only)    |

---

## Future Enhancements (Out of Scope)

- `yarn playground:clean` — One-command DB reset + re-seed
- SQLite fallback mode (no Docker required)
- Feature flag toggles via `MEDUSA_FF_*` env vars
- Pre-built Docker image for playground
- Integration with `medusa dev-cli` for package linking
