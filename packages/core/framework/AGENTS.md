# @medusajs/framework

The umbrella package every Medusa application, plugin, and module imports from. It re-exports the core packages (`types`, `utils`, `workflows-sdk`, `orchestration`, `modules-sdk`) under subpaths and owns the runtime loaders (config, HTTP, subscribers, jobs, links, workflows, database) that `@medusajs/medusa` runs at boot.

## Using this package

Import from the subpaths below, not from the underlying packages (`@medusajs/utils`, `@medusajs/types`, ...):

| Subpath | What you get |
| --- | --- |
| `@medusajs/framework/utils` | `defineConfig`, `Modules`, `ContainerRegistrationKeys`, `model`, `MedusaService`, `Module`, `ModuleProvider`, `defineLink`, `MedusaError`, `QueryContext` (re-export of `@medusajs/utils`) |
| `@medusajs/framework/types` | All TS types: `MedusaContainer`, `I<Name>ModuleService`, `HttpTypes`, `ConfigModule` (re-export of `@medusajs/types`) |
| `@medusajs/framework/workflows-sdk` | `createWorkflow`, `createStep`, `StepResponse`, `WorkflowResponse`, `transform`, `when` |
| `@medusajs/framework/http` | `MedusaRequest`, `AuthenticatedMedusaRequest`, `MedusaResponse`, `defineMiddlewares`, `authenticate`, `validateAndTransformBody`, `validateAndTransformQuery` |
| `@medusajs/framework/subscribers` | `SubscriberArgs`, `SubscriberConfig` |
| `@medusajs/framework/zod`, `/awilix`, `/pg`, `/mikro-orm/*`, `/opentelemetry/*` | Pinned third-party deps (via `@medusajs/deps`); use these instead of installing your own copy |
| `@medusajs/framework/config`, `/database`, `/links`, `/jobs`, `/workflows`, `/migrations` | Loaders used by `@medusajs/medusa`; rarely needed in app code |

`medusa-config.ts`:

```ts
import { defineConfig, loadEnv } from "@medusajs/framework/utils"

loadEnv(process.env.NODE_ENV || "development", process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET,
      cookieSecret: process.env.COOKIE_SECRET,
    },
  },
  modules: [{ resolve: "./src/modules/blog" }],
})
```

`src/api/middlewares.ts` (file name is fixed: `middlewares`):

```ts
import {
  authenticate,
  defineMiddlewares,
  validateAndTransformBody,
} from "@medusajs/framework/http"
import { PostCreateSchema } from "./admin/posts/validators"

export default defineMiddlewares({
  routes: [
    {
      matcher: "/custom/posts",
      methods: ["POST"],
      middlewares: [
        authenticate("user", ["session", "bearer", "api-key"]),
        validateAndTransformBody(PostCreateSchema),
      ],
    },
  ],
})
```

- Route files must be named `route.ts`/`route.js`; dynamic segments use `[param]` directories. Export `AUTHENTICATE = false` or `CORS = false` from a route file to opt out of the defaults (both default to `true`).
- Subscribers export a default handler plus `config: SubscriberConfig` with `event`; a subscriber missing `config` or `config.event` is skipped with a warning, not an error.
- Scheduled jobs export `config` with `name` and `schedule`; missing either throws at load.
- Docs: https://docs.medusajs.com/learn/fundamentals/framework.md, https://docs.medusajs.com/learn/configurations/medusa-config.md, https://docs.medusajs.com/learn/fundamentals/api-routes/middlewares.md, https://docs.medusajs.com/learn/fundamentals/api-routes/validation.md, https://docs.medusajs.com/learn/fundamentals/medusa-container.md

## Architecture

- `src/<subpath>/index.ts` maps 1:1 to the `exports` map in `package.json`; subpaths like `utils`, `types`, `workflows-sdk`, `orchestration`, `modules-sdk` are thin `export *` wrappers.
- `src/types/container.ts` augments `ModuleImplementations` so `container.resolve(Modules.PRODUCT)` / `ContainerRegistrationKeys.QUERY` are typed. The `utils`, `http`, `config`, `workflows-sdk`, `database` index files `import "../types/container"` to pull that augmentation in.
- `src/container.ts` exports the singleton `container`; `config/loader.ts` registers `configModule` on it at import time.
- `medusa-app-loader.ts` (`MedusaAppLoader`) bootstraps modules and links via `@medusajs/modules-sdk`.
- Boot order (driven by `packages/medusa/src/loaders/index.ts`): feature flags -> `configLoader` -> policies -> `pgConnectionLoader` -> `LinkLoader` -> `MedusaAppLoader().load()` -> `WorkflowLoader` -> `SubscriberLoader` -> `JobLoader` (only when background processors run) -> `expressLoader`/API routes.
- `http/`: `routes-loader.ts` (file-based routing), `middleware-file-loader.ts`, `router.ts` (`ApiLoader`), `middlewares/` (auth, publishable key, error handler), `utils/` (query/body validation, field restriction).

## Development

```bash
yarn build                                  # rimraf dist && tsc --build
yarn test                                   # jest over src/
yarn test src/http/__tests__/validate-query.spec.ts
```

- Unit tests live in `src/**/__tests__/`; `__fixtures__/` holds sample routes/subscribers/jobs used by the loader tests.
- Dependency upgrades for re-exported third-party libs go through `@medusajs/deps`, not this package's `package.json`.

## Gotchas

- `defineConfig` (in `@medusajs/utils`) always injects the default core modules; user `modules` are appended and keyed by module name, so an entry with the same key (e.g. `resolve: "@medusajs/medusa/cache-redis"`) replaces the default rather than duplicating it. Defaults cannot be removed, only swapped or `disable`d.
- Module keys must match `/^[a-zA-Z_][0-9a-zA-Z_]*$/` (`validateModuleName`); `my-module` fails at boot.
- In production, a missing `http.jwtSecret` / `http.cookieSecret` throws (`ConfigManager.rejectErrors`); in development it only warns and falls back to `"supersecret"`. Setting `jwtPublicKey` without an `algorithm` in `jwtOptions`/`jwtVerifyOptions` is also rejected.
- Build validators with `z` from `@medusajs/framework/zod`: the HTTP validators are typed against and run with the Zod v4 copy in `@medusajs/deps/zod`, not whatever zod version a project installs.
- `@medusajs/framework/caching` is listed in `exports` but has no `src/caching` source and no build output; do not import it.
- `validateAndTransformQuery` consumes and resets `req.allowed`, so custom allowed fields must be set by a middleware that runs before it on the same route.
