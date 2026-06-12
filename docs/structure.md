# structure.md

**Last updated:** 2026-06-11

## Architectural Pattern

Medusa follows a **modular monolith** pattern organized as a Yarn workspaces monorepo. The architecture has three distinct horizontal layers:

1. **Core / Framework** — runtime infrastructure (HTTP, DI container, ORM, workflow engine)
2. **Domain Modules** — 30+ self-contained commerce modules (product, order, cart, etc.)
3. **Entrypoints** — the main `@medusajs/medusa` package wires modules together and exposes HTTP API routes; the admin dashboard is a separate SPA

Cross-module data access goes through a **RemoteQuery / RemoteJoiner** graph layer rather than direct imports between modules, which enforces loose coupling. This resembles a **hexagonal / ports-and-adapters** style within each module: each module exposes a typed service interface and an optional provider abstraction.

---

## Directory Layout

```
/ (repo root)
├── packages/
│   ├── medusa/                  # Main entrypoint package — HTTP API routes, loaders, config
│   │   └── src/
│   │       ├── api/             # Express route handlers (admin/, store/, auth/ sub-trees)
│   │       ├── loaders/         # Module & plugin loaders called at startup
│   │       ├── subscribers/     # Event subscribers wired to the event bus
│   │       ├── jobs/            # Scheduled/cron job definitions
│   │       └── commands/        # CLI commands (migrate, seed, etc.)
│   │
│   ├── core/
│   │   ├── framework/           # Core runtime: HTTP router, auth middleware, config, DB, logger
│   │   ├── types/               # Shared TypeScript types, DTOs, module service interfaces
│   │   ├── utils/               # Utilities: MedusaError, DML helpers, decorators, event-bus base
│   │   ├── workflows-sdk/       # createWorkflow, createStep, StepResponse, WorkflowResponse
│   │   ├── core-flows/          # Pre-built workflows (deletePromotionsWorkflow, etc.)
│   │   ├── modules-sdk/         # Module loader, RemoteQuery, MedusaModule registry
│   │   ├── orchestration/       # Distributed transaction / saga orchestrator (WorkflowManager)
│   │   └── js-sdk/              # HTTP client SDK for consuming the API from JS
│   │
│   ├── modules/                 # 30+ domain modules
│   │   ├── product/             # Product catalog
│   │   ├── order/               # Order management
│   │   ├── cart/                # Cart & checkout
│   │   ├── payment/             # Payment processing abstraction
│   │   ├── fulfillment/         # Fulfillment & shipping
│   │   ├── inventory/           # Inventory levels
│   │   ├── pricing/             # Price sets & calculations
│   │   ├── promotion/           # Promotions & campaigns
│   │   ├── customer/            # Customer accounts
│   │   ├── auth/                # Authentication identities & providers
│   │   ├── api-key/             # API key management
│   │   ├── region/              # Region & currency configuration
│   │   ├── sales-channel/       # Sales channels
│   │   ├── stock-location/      # Physical stock locations
│   │   ├── notification/        # Notification dispatch
│   │   ├── tax/                 # Tax calculations
│   │   ├── currency/            # Currency definitions
│   │   ├── store/               # Store settings
│   │   ├── user/                # Admin user accounts
│   │   ├── rbac/                # Role-based access control
│   │   ├── settings/            # System settings
│   │   ├── file/                # File storage abstraction
│   │   ├── index/               # Search index module
│   │   ├── locking/             # Distributed locking
│   │   ├── caching/             # Cache abstraction
│   │   ├── analytics/           # Analytics events
│   │   ├── translation/         # Content translation
│   │   ├── link-modules/        # Cross-module pivot link tables
│   │   ├── cache-inmemory/      # In-memory cache provider
│   │   ├── cache-redis/         # Redis cache provider
│   │   ├── event-bus-local/     # In-process EventEmitter event bus
│   │   ├── event-bus-redis/     # Redis/BullMQ event bus
│   │   ├── workflow-engine-inmemory/ # In-memory workflow engine
│   │   ├── workflow-engine-redis/    # Redis-backed workflow engine
│   │   └── providers/           # 15+ provider implementations (payment, auth, notification, file, etc.)
│   │
│   ├── admin/
│   │   ├── dashboard/           # React 18 admin SPA (Vite)
│   │   ├── admin-sdk/           # SDK for building admin extensions
│   │   ├── admin-bundler/       # Bundling utilities for admin extensions
│   │   ├── admin-shared/        # Shared types between dashboard and SDK
│   │   └── admin-vite-plugin/   # Vite plugin for injecting admin extensions
│   │
│   ├── cli/
│   │   ├── medusa-cli/          # `medusa` CLI (start, develop, build, migrate, etc.)
│   │   ├── create-medusa-app/   # Project scaffolding CLI
│   │   ├── medusa-dev-cli/      # Developer tooling CLI
│   │   ├── http-types-generator/# Generates HTTP type definitions from OAS
│   │   └── oas/                 # OpenAPI spec tooling
│   │
│   ├── design-system/
│   │   ├── ui/                  # @medusajs/ui component library (React + Tailwind)
│   │   ├── icons/               # Icon set
│   │   ├── toolbox/             # Design token tooling
│   │   └── ui-preset/           # Tailwind CSS preset
│   │
│   ├── deps/                    # Re-exported peer dependencies (MikroORM, Awilix, Zod) to lock versions
│   ├── medusa-test-utils/       # Test runner utilities (MedusaTestRunner, DB setup helpers)
│   ├── medusa-telemetry/        # Telemetry/analytics reporting
│   └── plugins/
│       ├── draft-order/         # Draft order plugin
│       └── loyalty/             # Loyalty points plugin
│
├── integration-tests/
│   ├── api/                     # Full API integration tests
│   ├── http/                    # HTTP-layer integration tests
│   ├── modules/                 # Module-level integration tests
│   └── environment-helpers/     # Test server bootstrap helpers
│
├── www/                         # Documentation sites (Next.js)
│   └── apps/
│       ├── resources/           # Developer docs
│       ├── api-reference/       # API reference site
│       └── ...
│
├── .github/workflows/           # GitHub Actions CI/CD
├── jest.config.js               # Root Jest aggregator
├── _tsconfig.base.json          # Shared TypeScript compiler options
└── .prettierrc                  # Prettier formatting rules
```

---

## Module Responsibilities

| Top-level package            | Owns                                                        | Depends on                          | Depended on by                        |
|------------------------------|-------------------------------------------------------------|-------------------------------------|---------------------------------------|
| `@medusajs/medusa`           | HTTP route handlers, loaders, subscribers, CLI commands     | `@medusajs/framework`, all modules  | Nothing (entrypoint)                  |
| `@medusajs/framework`        | HTTP, auth, config, DB, logger, workflow runtime            | `@medusajs/deps`, `@medusajs/utils` | All modules, medusa                   |
| `@medusajs/utils`            | MedusaError, DML entity builder, decorators, common utils   | None (leaf)                         | framework, all modules                |
| `@medusajs/types`            | TypeScript interfaces, DTO types, module service contracts  | None (leaf)                         | All packages                          |
| `@medusajs/workflows-sdk`    | createWorkflow, createStep, StepResponse, WorkflowResponse  | `@medusajs/orchestration`           | `@medusajs/core-flows`, all consumers |
| `@medusajs/core-flows`       | Pre-built workflow and step implementations                 | `@medusajs/workflows-sdk`, modules  | `@medusajs/medusa`, plugins           |
| `@medusajs/modules-sdk`      | Module loader, RemoteQuery, MedusaModule registry           | `@medusajs/framework`               | `@medusajs/medusa`                    |
| `@medusajs/orchestration`    | Distributed transaction engine (saga/compensation)          | None                                | `@medusajs/workflows-sdk`             |
| Domain modules (30+)         | Business logic for each commerce domain                     | `@medusajs/framework`, `@medusajs/utils` | `@medusajs/medusa` (via loaders)  |
| `@medusajs/dashboard`        | Admin React SPA                                             | `@medusajs/ui`, `@medusajs/js-sdk`  | Nothing                               |

---

## Entry Points

| File                                                    | Role                                                                                |
|---------------------------------------------------------|-------------------------------------------------------------------------------------|
| `packages/medusa/src/` (bootstrapped by CLI)            | Main server entrypoint; the `medusa-cli` calls loaders which wire Express + modules |
| `packages/cli/medusa-cli/src/create-cli.ts`             | CLI entry; `getCommandHandler` dispatches to server start, migrate, etc.            |
| `packages/admin/dashboard/src/dashboard-app/dashboard-app.tsx` | Admin SPA root — `DashboardApp` class assembles routes, widgets, i18n       |
| `packages/core/framework/src/http/routes-finder.ts`     | `RoutesFinder` class — runtime HTTP route registry used by the Express router       |
| `packages/core/modules-sdk/src/remote-query/remote-query.ts` | `RemoteQuery` class — cross-module data graph entry point                   |

---

## Import Conventions

- **Path aliases** (configured per-package in `tsconfig.json`): `@models`, `@types`, `@services`, `@repositories`, `@utils` resolve to local source directories within each module package.
- **Barrel exports:** Each package exposes a root `src/index.ts` that re-exports public surface area via `export * from`.
- **Cross-package imports:** Packages import each other by npm package name (e.g., `@medusajs/framework/utils`, `@medusajs/framework/http`) using the `exports` map defined in each `package.json`.
- **Re-exported peers:** `packages/deps/` re-exports MikroORM, Awilix, and Zod at pinned versions so all packages use the same instance.
- **No direct cross-module imports:** Commerce modules do not import each other directly. Cross-module data access goes through `RemoteQuery` / `useQueryGraphStep`.

Source: `packages/core/framework/package.json`, `packages/deps/package.json`, `packages/core/core-flows/src/common/steps/use-query-graph.ts`

---

## File Naming Conventions

| Layer / Area              | Pattern                                 | Examples                                                              |
|---------------------------|-----------------------------------------|-----------------------------------------------------------------------|
| All source files          | kebab-case                              | `define-middlewares.ts`, `api-key-module-service.ts`                  |
| API route files           | `route.ts` (one per directory)          | `packages/medusa/src/api/admin/api-keys/[id]/route.ts`               |
| API query config files    | `query-config.ts`                       | `packages/medusa/src/api/admin/customers/query-config.ts`            |
| API validators            | `validators.ts`                         | (per route directory)                                                 |
| Module service            | `<module>-module-service.ts`            | `api-key-module-service.ts`, `auth-module.ts`                        |
| Module service (internal) | `medusa-internal-service.ts`            | `packages/core/utils/src/modules-sdk/medusa-internal-service.ts`     |
| DML entity models         | `<entity-name>.ts` in `models/`         | `packages/modules/fulfillment/src/models/geo-zone.ts`                |
| Workflow steps            | `<verb>-<noun>.ts` in `steps/`          | `packages/core/core-flows/src/promotion/steps/delete-promotions.ts`  |
| Workflow definitions      | `<verb>-<noun>.ts` in `workflows/`      | `packages/core/core-flows/src/promotion/workflows/delete-promotions.ts` |
| Test files                | `*.spec.ts` or `*.test.ts`              | `packages/core/utils/src/common/__tests__/deep-copy.spec.ts`         |
| React components (TSX)    | PascalCase directories with `index.tsx` | `packages/admin/dashboard/src/components/filtering/query/query.tsx`  |

---

## Dependency Flow

```
┌──────────────────────────────────────────────────────────┐
│  Entrypoints (@medusajs/medusa, @medusajs/dashboard)     │
│  API routes / React SPA                                  │
└────────────────────┬─────────────────────────────────────┘
                     │ imports
┌────────────────────▼─────────────────────────────────────┐
│  Core Flows (@medusajs/core-flows)                       │
│  Pre-built workflow & step implementations               │
└────────────────────┬─────────────────────────────────────┘
                     │ imports
┌────────────────────▼─────────────────────────────────────┐
│  Domain Modules (packages/modules/*)                     │
│  product, order, cart, payment, ...                      │
└────────────────────┬─────────────────────────────────────┘
                     │ imports
┌────────────────────▼─────────────────────────────────────┐
│  Framework & SDK (@medusajs/framework, @medusajs/utils)  │
│  HTTP, auth, config, ORM, DML, decorators, MedusaError   │
└────────────────────┬─────────────────────────────────────┘
                     │ imports
┌────────────────────▼─────────────────────────────────────┐
│  Pinned Deps (@medusajs/deps)                            │
│  MikroORM 6.6.14, Awilix 8, Zod 4                       │
└──────────────────────────────────────────────────────────┘

Cross-module data access:
  Module A ──► RemoteQuery / useQueryGraphStep ──► Module B
  (never direct imports between domain modules)
```
