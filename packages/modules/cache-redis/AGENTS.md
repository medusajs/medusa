# @medusajs/cache-redis

Redis implementation of the legacy Cache Module (`Modules.CACHE`, container key `"cache"`). Used by `defineConfig` on Medusa Cloud when `REDIS_URL` is set. Deprecated since v2.11.0 in favor of the Caching Module with the Redis Caching provider (`@medusajs/medusa/caching-redis`).

## Using this package

```ts
module.exports = defineConfig({
  modules: [
    {
      resolve: "@medusajs/medusa/cache-redis",
      options: {
        redisUrl: process.env.CACHE_REDIS_URL,
      },
    },
  ],
})
```

- Options (`RedisCacheModuleOptions`, `src/types/index.ts`):
  - `redisUrl` (required)
  - `ttl`: seconds, default `30`
  - `redisOptions`: ioredis `RedisOptions`, spread over `{ lazyConnect: true }`
  - `namespace`: key prefix, default `"medusa"` (keys stored as `medusa:<key>`)
- Resolve: `container.resolve(Modules.CACHE)` (`ICacheService`): `get`, `set`, `invalidate`.
- No data models, events, links, or providers.
- Docs: https://docs.medusajs.com/resources/infrastructure-modules/cache/redis.md, https://docs.medusajs.com/resources/infrastructure-modules/caching/providers/redis.md

## Architecture

- `src/loaders/index.ts`: creates the ioredis connection and registers it as `cacheRedisConnection` in the module container.
- `src/services/redis-cache.ts`: values are `JSON.stringify`'d and stored with `SET ... EX <ttl>`; `invalidate` walks `SCAN MATCH <namespace>:<key> COUNT 100` and `UNLINK`s matches in a pipeline.
- Disconnects in `__hooks.onApplicationShutdown`.
- `src/initialize/index.ts`: standalone bootstrap via `MedusaModule.bootstrap`.

## Development

```bash
yarn build
yarn test    # src/services/__tests__/redis-cache.js (mocked client, no Redis needed)
```

## Gotchas

- Missing `redisUrl` throws at load time, but a failed connection is only logged (`logger.error`), so the app boots and cache calls fail later.
- `get` deletes the key (`UNLINK`) and returns `null` if the read or `JSON.parse` throws.
- `set(key, data, 0)` is a no-op.
- `invalidate` patterns use Redis glob syntax (`*`, `?`, `[...]`) and are prefixed with the namespace.
