# @medusajs/caching-redis

Caching Module provider backed by Redis (`ioredis`), with tag-based invalidation and gzip compression of large entries.

## Using this package

The Caching Module is behind the `caching` feature flag: set `MEDUSA_FF_CACHING=true`, then register it:

```ts
module.exports = defineConfig({
  modules: [
    {
      resolve: "@medusajs/medusa/caching",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/caching-redis",
            id: "caching-redis",
            // makes this the default caching provider
            is_default: true,
            options: {
              redisUrl: process.env.CACHE_REDIS_URL,
              redisOptions: {
                // ioredis options
              },
            },
          },
        ],
      },
    },
  ],
})
```

- Options (`RedisCacheModuleOptions` in `src/types/index.ts`): `redisUrl` (required), `redisOptions`, `ttl` (default `3600`), `prefix` (default `"mc:"`), `compressionThreshold` in bytes (default `2048`).
- `id` is what you pass as the provider when caching through Query, the Index Module, or `Modules.CACHING`; `id` is required (the Caching Module throws `No "id" provided for provider`).
- On Medusa Cloud, `defineConfig` registers this provider automatically when `CACHE_REDIS_URL` is set.
- Docs: https://docs.medusajs.com/resources/infrastructure-modules/caching/providers/redis.md
- Build a custom caching provider: https://docs.medusajs.com/resources/references/caching-module-provider.md

## Architecture

- `src/services/redis-cache.ts`: `RedisCachingProvider`, `static identifier = "cache-redis"` (not `caching-redis`). Plain class implementing the `ICachingProviderService` shape: `get({ key?, tags? })`, `set({ key, data, ttl?, tags?, options? })`, `clear({ key?, tags?, options? })`, `flush()`.
- `src/loaders/connection.ts` creates the ioredis client and registers `redisClient`, `prefix`, `logger` in the provider container; `src/loaders/hash.ts` registers an `xxhash-wasm` `hasher` for tag keys.
- Each entry is a Redis hash (`data`, optional `options`) at `{prefix}{key}`, plus a forward index `{prefix}tag:{hash}` and reverse index `{prefix}tags:{key}` (both expire `ttl + 60` s).
- Stored values carry a 1-byte header: `0` raw, `1` gzip (used when the payload exceeds `compressionThreshold`).

## Development

- `yarn build` (also runs `resolve:aliases` for `@types` path alias), `yarn test` (unit tests in `src/**/__tests__`, Redis is mocked).

## Gotchas

- `ttl` is in seconds (it's passed to Redis `EXPIRE`), despite the "milliseconds" comment in the type.
- Passing ioredis options at the top level of `options` still works but is deprecated and logs a warning; use `redisOptions`.
- Connection errors are swallowed: `get` returns `null` and `set` is a no-op with a warning, so a down Redis degrades to cache misses rather than failing requests. A failed initial `ping` only logs a warning.
- `clear({ tags: ["*"] })` clears everything; with `options.autoInvalidate` set (strategy-driven clears), entries saved with `autoInvalidate: false` are kept.
- `flush()` SCANs and deletes every key under `prefix`; use a distinct `prefix` if the Redis instance is shared.
