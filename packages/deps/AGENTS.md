# @medusajs/deps

Single place where Medusa pins its shared third-party runtime dependencies (MikroORM, OpenTelemetry, Awilix, `pg`, Zod) and re-exports them through subpath entry points, so every Medusa package resolves the same copy.

## Using this package

- Application and plugin code should not import `@medusajs/deps` directly. Use the `@medusajs/framework` re-exports, which map 1:1 to this package:

```ts
import { z } from "@medusajs/framework/zod"
import { MikroORM } from "@medusajs/framework/mikro-orm/core"
import { asValue } from "@medusajs/framework/awilix"
```

- Using these paths (instead of installing `zod`, `@mikro-orm/*`, or `awilix` yourself) avoids duplicate copies whose classes/schemas fail `instanceof` checks against the ones Medusa uses internally.
- Validation docs that use `@medusajs/framework/zod`: https://docs.medusajs.com/learn/fundamentals/api-routes/validation.md

## Architecture

- `src/<name>.ts` is a one-line `export * from "<upstream>"`. There is no `src/index.ts`; consumers must use a subpath.
- Subpath map (in `package.json` `exports`):
  - `./mikro-orm/{cli,core,knex,migrations,postgresql}` -> `src/mikro-orm-*.ts`
  - `./opentelemetry/{api,instrumentation-pg,resources,sdk-node,sdk-trace-node}` -> `src/opentelemetry-*.ts`
  - `./awilix`, `./pg`, `./zod`
- `packages/core/framework/src/deps/*.ts` re-exports each of these (`export * from "@medusajs/deps/zod"`), and `packages/core/framework/package.json` exposes them as `@medusajs/framework/<same subpath>`.

## Development

- Build: `yarn build` (no tests, no watch script).
- Adding a re-exported dependency touches four places:
  1. `dependencies` in this `package.json`
  2. `src/<name>.ts` with `export * from "<upstream>"`
  3. this package's `exports` map
  4. `packages/core/framework/src/deps/<name>.ts` plus the matching entry in `packages/core/framework/package.json` `exports`
- Bumping a version here changes it for every Medusa package at once; check `packages/core/framework`, `packages/core/utils`, and module integration tests.

## Gotchas

- MikroORM packages and `zod` are pinned to exact versions (`6.6.14`, `4.2.0`); keep all `@mikro-orm/*` entries on the same version. The root `package.json` and some admin packages (`packages/admin/dashboard`, `packages/admin/admin-sdk`) also pin `zod` and must move in lockstep.
- `main` / the `.` export point to `dist/index.js`, which is never built. Importing the bare `@medusajs/deps` fails.
- OpenTelemetry SDK upgrades can change runtime behavior for users (see the 2.18.0 `CHANGELOG.md` entry on strict `OTEL_RESOURCE_ATTRIBUTES` parsing); call these out in the changeset.
