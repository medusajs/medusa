# @medusajs/modules-sdk

The module runtime: resolves module declarations from `medusa-config.ts`, loads each module into its own container, registers providers, initializes link modules from `defineLink` definitions, runs module migrations, and builds the `link` and `query` objects. Consumed through `@medusajs/framework/modules-sdk` and, indirectly, `MedusaAppLoader` in `@medusajs/framework`.

## Using this package

App and plugin code rarely imports this package. What you interact with is its output:

- The `Module()` / `ModuleProvider()` helpers and `defineLink` live in `@medusajs/framework/utils` (package `@medusajs/utils`), not here.
- `Link` is what `container.resolve(ContainerRegistrationKeys.LINK)` returns:

```ts
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

const link = container.resolve(ContainerRegistrationKeys.LINK)

await link.create({
  [Modules.PRODUCT]: { product_id: "prod_123" },
  blog: { post_id: "post_123" },
})
await link.dismiss({
  [Modules.PRODUCT]: { product_id: "prod_123" },
  blog: { post_id: "post_123" },
})
```

- `Link` methods: `create`, `dismiss`, `delete`, `restore`, `list`. Pass a `data` key alongside the two module keys to set link `extraColumns`.
- `MedusaModule` (static registry): `getLoadedModules()`, `isInstalled(key)`, `getModuleInstance(key)`, `getAllJoinerConfigs()`, `bootstrap(...)`; used by tests and tooling that load a single module outside the app.
- `ModulesDefinition` / `MODULE_DEFINITIONS` (`src/definitions.ts`): built-in module keys, `isRequired`, `isQueryable`, and their container `dependencies`.
- Docs: https://docs.medusajs.com/learn/fundamentals/modules.md, https://docs.medusajs.com/learn/fundamentals/modules/container.md, https://docs.medusajs.com/learn/fundamentals/modules/isolation.md, https://docs.medusajs.com/learn/fundamentals/modules/loaders.md, https://docs.medusajs.com/learn/fundamentals/module-links/link.md

## Architecture

- `src/medusa-app.ts`: `MedusaApp()` loads all modules (`loadModules`), then link modules (`initializeLinks`, which dynamically imports `@medusajs/medusa/link-modules`), merges every module's GraphQL schema, and returns `{ modules, link, query, runMigrations, revertMigrations, generateMigrations, linkMigrationExecutionPlanner, onApplicationStart, ... }`. `MedusaAppMigrateUp/Down/Generate` are the migration-only entry points.
- `src/medusa-module.ts`: `MedusaModule` keeps loaded instances, resolutions, joiner configs, custom links (`setCustomLink`, called by `defineLink`), and search index definitions.
- `src/loaders/register-modules.ts`: turns a declaration into a `ModuleResolution`; keys missing from `ModulesDefinition` get a "Custom" resolution.
- `src/loaders/utils/load-internal.ts`: creates a local container per module, auto-discovers `services/`, `models/`, `repositories/` next to the module entry, registers providers, and runs module loaders.
- `src/link.ts`: `Link` (creating/dismissing records in link-module tables).
- `src/remote-query/` and `src/joiner/` only re-export `createQuery`, `Query`, `RemoteJoiner` from `@medusajs/query`.

## Development

```bash
yarn build
yarn test                                   # jest --bail --forceExit
yarn test src/loaders/__tests__/register-modules.ts
```

- Tests are under `src/__tests__/` and `src/loaders/__tests__/` (files without `.spec`; jest's default `__tests__` match picks them up). Fixture modules live in `src/loaders/__fixtures__/` and `src/loaders/__mocks__/`.
- End-to-end module loading is covered by `integration-tests/modules/` at the repo root (`yarn test:integration:modules`).

## Gotchas

- `MedusaModule` is stored on `global.MedusaModule ??=`, so duplicated copies of this package in `node_modules` share one registry. State persists across bootstraps in the same process; `medusa-test-utils` calls `clearInstances()` between runs, and custom harnesses should too.
- Each module gets an isolated container: only the definition's `dependencies` plus `manager`, `configModule`, `logger`, `__pg_connection__`, `event_bus`, and `caching` are proxied from the app container. Resolving another module's service from inside a module fails; use links/Query or workflows instead.
- `scope: "external"` declarations throw `External Modules are not supported yet.`
- Provider services need a static `identifier`; two providers with the same `identifier` and `id` throw `has already been registered`.
- A module loader that throws is logged and turned into an error (`Loaders for module <label> failed`), and the module key is registered as `undefined`.
- If `@medusajs/medusa/link-modules` fails to initialize, `initializeLinks` only `console.warn`s and `link` is `undefined`; check the warning before debugging `link.create` errors.
- `isList: false` on a link side is enforced at write time: linking a record a second time where only one link is allowed throws `Cannot create multiple links between ...` (also checked within the same batch). More than two module keys per entry throws `Only two modules can be linked.`
- Plugin modules and providers are resolved from the project directory (`resolveFromProject`), not from where this package is hoisted; keep that when touching resolution code.
