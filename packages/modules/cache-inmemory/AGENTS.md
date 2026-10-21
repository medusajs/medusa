# @medusajs/cache-inmemory

In-memory implementation of the legacy Cache Module (`Modules.CACHE`, container key `"cache"`). It is the default Cache Module registered by `defineConfig` for non-Cloud projects. Deprecated since v2.11.0 in favor of the Caching Module (`@medusajs/caching`).

## Using this package

- Registered by default as `@medusajs/medusa/cache-inmemory` (`MODULE_PACKAGE_NAMES[Modules.CACHE]`). Explicit config:

```ts
module.exports = defineConfig({
  modules: [
    {
      resolve: "@medusajs/medusa/cache-inmemory",
      options: { ttl: 30 },
    },
  ],
})
```

- Options (`InMemoryCacheModuleOptions`): `ttl` in seconds, default `30`.
- Resolve: `container.resolve(Modules.CACHE)` (`ICacheService`). Still used internally by the Auth Module (MFA challenges, OAuth state).
- Methods: `get(key)`, `set(key, data, ttl?)`, `invalidate(key)` (supports `*`), `clear()` (in-memory only, not on `ICacheService`).
- No data models, events, links, or providers.
- Docs: https://docs.medusajs.com/resources/infrastructure-modules/cache/in-memory.md, https://docs.medusajs.com/resources/infrastructure-modules/caching.md

## Architecture

- `src/services/inmemory-cache.ts`: a `Map` store plus a `setTimeout` per key (`unref()`'d) that evicts the key at expiry; `get` also checks `expire`.
- `src/initialize/index.ts`: `initialize(options)` bootstraps the module standalone via `MedusaModule.bootstrap`.
- The module definition is a plain `ModuleExports` object (`{ service }`), not `Module(...)`, and has no joiner config.

## Development

```bash
yarn build
yarn test    # src/services/__tests__/inmemory-cache.js
```

## Gotchas

- State is per process: not shared across server/worker instances and lost on restart. Use Redis-backed caching in multi-instance deployments.
- `set(key, data, 0)` is a no-op (nothing is cached).
- `invalidate` builds a regex with `key.replace("*", ".*")`: only the first `*` is expanded and the pattern is unanchored, so `"ps:*"` also matches keys that merely contain `ps:`.
