# tech.md

**Last updated:** 2026-06-11

## Summary

Medusa is an open-source modular commerce platform built as a TypeScript monorepo. The backend is a Node.js/Express HTTP server augmented with a custom workflow orchestration engine, MikroORM over PostgreSQL, and an Awilix IoC container. The frontend is a React 18 single-page admin dashboard bundled with Vite. Thirty-plus commerce modules (product, order, cart, payment, etc.) follow a uniform service pattern and communicate cross-module through a RemoteQuery/RemoteJoiner graph layer. Redis is the optional backbone for the event bus and workflow engine; in-memory implementations are provided for local development.

---

## Languages

| Language   | File count | Notes                                           |
|------------|------------|-------------------------------------------------|
| TypeScript | 7247       | Primary backend and frontend language           |
| TSX        | 3093       | React admin dashboard components                |
| JavaScript | 677        | Config files, scripts, legacy CLI helpers       |
| YAML       | 1582       | GitHub Actions CI/CD workflows, config files    |

**TypeScript compile target:** ES2021  
**TypeScript module system:** Node16  
Source: `_tsconfig.base.json`

---

## Frameworks

| Layer      | Framework / Library     | Version      | Where used                                                       |
|------------|-------------------------|--------------|------------------------------------------------------------------|
| Backend HTTP | Express                | ^4.21.0      | `packages/core/framework/` — all API routing                    |
| Backend ORM  | MikroORM               | 6.6.14       | `packages/deps/` — all module entity persistence                |
| Frontend UI  | React                  | ^18.3.1      | `packages/admin/dashboard/`                                     |
| Frontend bundler | Vite               | (via devDeps)| `packages/admin/dashboard/vite.config.mts`                      |
| Frontend router | react-router-dom   | ^6.30.4      | `packages/admin/dashboard/`                                     |

**Main package version:** `@medusajs/medusa` 2.15.5  
**Framework package version:** `@medusajs/framework` 2.15.5  
Source: `packages/medusa/package.json`, `packages/core/framework/package.json`, `packages/deps/package.json`

---

## Runtime Dependencies

| Library                   | Version    | Purpose                                     | Where used (representative file)                                                                      |
|---------------------------|------------|---------------------------------------------|-------------------------------------------------------------------------------------------------------|
| `express`                 | ^4.21.0    | HTTP server                                 | `packages/core/framework/src/http/types.ts`                                                           |
| `express-session`         | ^1.17.3    | Session management                          | `packages/core/framework/` (authenticate middleware)                                                  |
| `@mikro-orm/core`         | 6.6.14     | ORM — entity mapping, repositories          | `packages/core/utils/src/dal/mikro-orm/`                                                              |
| `@mikro-orm/postgresql`   | 6.6.14     | PostgreSQL dialect for MikroORM             | `packages/deps/`                                                                                      |
| `@mikro-orm/knex`         | 6.6.14     | Query builder used by MikroORM              | `packages/deps/`                                                                                      |
| `@mikro-orm/migrations`   | 6.6.14     | Database migration runner                   | `packages/core/framework/` (mikro-orm/migrations export)                                             |
| `awilix`                  | ^8.0.1     | IoC / dependency injection container        | `packages/core/framework/src/types/container.ts` (`MedusaContainer`)                                 |
| `zod`                     | 4.2.0      | Request body / query validation             | `packages/core/framework/src/http/utils/define-middlewares.ts`                                        |
| `jsonwebtoken`            | ^9.0.2     | JWT signing & verification                  | `packages/core/framework/src/http/middlewares/authenticate-middleware.ts`                             |
| `ioredis`                 | ^5.4.1     | Redis client                                | `packages/modules/event-bus-redis/src/services/event-bus-redis.ts`                                   |
| `bullmq`                  | 5.13.0     | Redis-backed queue for event bus            | `packages/modules/event-bus-redis/src/services/event-bus-redis.ts`                                   |
| `react`                   | ^18.3.1    | Admin UI framework                          | `packages/admin/dashboard/`                                                                           |
| `react-router-dom`        | ^6.30.4    | Client-side routing in admin dashboard      | `packages/admin/dashboard/`                                                                           |
| `react-hook-form`         | 7.49.1     | Form state management in admin dashboard    | `packages/admin/dashboard/`                                                                           |
| `react-i18next`           | 13.5.0     | Internationalization in admin dashboard     | `packages/admin/dashboard/`                                                                           |

---

## Dev Dependencies

| Tool                  | Version    | Purpose                                          |
|-----------------------|------------|--------------------------------------------------|
| Jest                  | 29.7.0     | Backend / core unit & integration test runner    |
| Vitest                | 3.0.5      | Admin dashboard test runner                      |
| `@swc/jest`           | ^0.2.36    | SWC-based Jest transformer (fast TypeScript)     |
| ESLint                | (via devDeps) | Linting — see `.eslintrc.js`                  |
| Prettier              | (via devDeps) | Code formatting — see `.prettierrc`            |
| TypeScript            | (via devDeps) | Type checking; tsconfig in `_tsconfig.base.json` |
| Vite                  | (via devDeps) | Admin dashboard bundler                        |
| `@vitejs/plugin-react`| (via devDeps) | JSX transform for Vite                         |
| `prettier-plugin-tailwindcss` | (via devDeps) | Tailwind class sorting in dashboard/design-system |
| Storybook             | ^8.3.5     | UI component development for design system       |
| `@faker-js/faker`     | ^9.2.0     | Fake data generation in tests                    |

Source: root `package.json` devDependencies

---

## Build & Tooling

- **Package manager:** Yarn 3.2.1 with `node-modules` linker (workspaces configured in root `package.json`)
- **Bundler (backend packages):** Custom build scripts using `tsup` / `tsc`; `@rollup/plugin-node-resolve` used in some packages
- **Bundler (admin dashboard):** Vite — see `packages/admin/dashboard/vite.config.mts`
- **Type checker:** TypeScript compiler (`tsc`) and `tsgo` (used in dashboard: `yarn typecheck`)
- **Linter:** ESLint — root `.eslintrc.js`; `packages/eslint-plugin/` provides a custom Medusa ESLint plugin
- **Formatter:** Prettier — root `.prettierrc`
- **Test runner (backend):** Jest 29.7.0 — root `jest.config.js` aggregates all per-package `jest.config.js` files
- **Test runner (frontend):** Vitest 3.0.5 — `packages/admin/dashboard/package.json`
- **ORM CLI:** `medusa-mikro-orm` binary shipped in `@medusajs/framework` (`packages/core/framework/package.json`)

---

## Runtime Environment

- **Node.js:** >= 20 (specified in `packages/medusa/package.json` `engines`)
- **CI/CD:** GitHub Actions — `.github/workflows/` (release on `develop` push via `release.yml`; ubuntu-latest runners, Node 20)
- **Orchestration/Docker:** Not found in codebase. CI uses ubuntu-latest VMs only.

---

## External Services

| Service      | Implementation                                | Where used                                                                  |
|--------------|-----------------------------------------------|-----------------------------------------------------------------------------|
| PostgreSQL   | MikroORM `@mikro-orm/postgresql`              | All module entity persistence                                               |
| Redis        | `ioredis` ^5.4.1                              | `packages/modules/cache-redis/`, `packages/modules/event-bus-redis/`       |
| Redis Queue  | `bullmq` 5.13.0                               | `packages/modules/event-bus-redis/src/services/event-bus-redis.ts`         |
| Redis Workflow Engine | `ioredis`                            | `packages/modules/workflow-engine-redis/`                                   |
| In-memory cache | Custom in-memory implementation           | `packages/modules/cache-inmemory/`                                          |
| In-memory event bus | `EventEmitter`                        | `packages/modules/event-bus-local/`                                         |
| In-memory workflow engine | Custom                          | `packages/modules/workflow-engine-inmemory/`                               |
