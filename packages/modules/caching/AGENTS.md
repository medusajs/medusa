# @medusajs/caching

Caching Module (`Modules.CACHING`, container key `"caching"`). Provider-based, tag-aware cache that replaces the deprecated Cache Module (`cache-inmemory` / `cache-redis`). Powers `query.graph` / `query.index` / `useQueryGraphStep` caching and auto-invalidates entries from module events. Requires the `caching` feature flag (`MEDUSA_FF_CACHING=true`).

## Using this package

- Not registered by default for self-hosted projects (on Cloud, `defineConfig` adds it with `caching-redis` when `CACHE_REDIS_URL` is set).

```ts
module.exports = defineConfig({
  modules: [
    {
      resolve: "@medusajs/medusa/caching",
      options: {
        ttl: 3600,
        providers: [
          {
            resolve: "@medusajs/medusa/caching-redis",
            id: "caching-redis",
            is_default: true,
            options: { redisUrl: process.env.CACHE_REDIS_URL },
          },
        ],
      },
    },
  ],
})
```

- Options (`CachingModuleOptions`, `src/types/index.ts`):
  - `ttl`: default TTL in seconds, default `3600`.
  - `providers: { resolve, id, is_default?, options? }[]`: a single provider is always the default.
  - `in_memory`: private; `{ enable, ttl, maxKeys, checkPeriod, useClones, maxSize }` enables the built-in `cache-memory` provider (node-cache, `maxSize` default 300MB).
- Service (`ICachingModuleService`, `src/services/cache-module.ts`):

```ts
const caching = container.resolve(Modules.CACHING)

const key = await caching.computeKey(input)
const cached = await caching.get({ key }) // or { tags }, optional providers: string[]
await caching.set({ key, data, tags: [`Brand:${brand.id}`], ttl: 600 })
await caching.clear({ tags: [`Brand:${brand.id}`] })
```

  - `get({ key?, tags?, providers? })`: tries providers in order, returns first non-null; provider errors are logged and skipped.
  - `set({ key, data, ttl?, tags?, computeAutomaticTags?, providers?, options: { autoInvalidate? } })`.
  - `clear({ key?, tags?, options?, providers? })`, `computeKey(input)`, `computeTags(input, options?)`.
- Query caching: pass `cache` options to `query.graph` / `query.index` / `useQueryGraphStep` instead of calling the service.
- Custom providers implement `ICachingProviderService` and need a static `identifier`.
- No data models, no emitted events, no module links. It consumes events (see Architecture).
- Docs: https://docs.medusajs.com/resources/infrastructure-modules/caching.md, https://docs.medusajs.com/resources/infrastructure-modules/caching/concepts.md, https://docs.medusajs.com/resources/infrastructure-modules/caching/providers.md, https://docs.medusajs.com/resources/infrastructure-modules/caching/migrate-cache.md

## Architecture

- Loaders: `src/loaders/hash.ts` registers `hasher` (xxhash-wasm `h64ToString`); `src/loaders/providers.ts` registers the strategy, optional in-memory provider, and configured providers as aliases `lp_<id>`, then picks `default_provider`.
- `src/utils/strategy.ts` (`DefaultCacheStrategy`): `computeKey` = xxhash of `fast-json-stable-stringify(input)`. `computeTags` uses `CacheInvalidationParser` (`src/utils/parser.ts`) over the merged GraphQL schema of all loaded modules to find entities in the data.
- On `onApplicationStart`, the strategy subscribes to `"*"` on the Event Bus (and `addInterceptor` when available). Each event `<...>.<entity>.<operation>` is turned into tags and cleared with `autoInvalidate: true`.
- Concurrent identical `get`/`set`/`clear` calls are de-duplicated via `ongoingRequests`.
- Static `traceGet` / `traceSet` / `traceClear` hooks are used for instrumentation.
- Module definition dependencies: `Modules.EVENT_BUS`, `logger`.

## Development

```bash
yarn build
yarn test                  # src/**/__tests__ (memory provider, parser)
yarn test:integration      # integration-tests/__tests__/*.spec.ts
yarn test:integration -t "<test name>"
```

- `integration-tests/__tests__/redis/invalidation.spec.ts` needs a Redis at `localhost:6379`.
- Event bus is mocked via `integration-tests/__fixtures__/event-bus-mock.ts`.

## Gotchas

- Load fails with "No providers have been configured and the built in memory cache has not been enabled." if there are no providers and `in_memory.enable` is not set.
- With multiple providers and none marked `is_default`, there is no default unless `in_memory` is enabled (then `cache-memory` is used with a warning).
- Passing explicit `tags` to `set` disables automatic tag computation unless `computeAutomaticTags: true`.
- `get`/`clear` throw `INVALID_ARGUMENT` without `key` or `tags`; `set` throws without `key`.
- A per-provider TTL can be passed as `providers: [{ id, ttl }]` to `set`; precedence is provider ttl, then call `ttl`, then module `ttl`.
