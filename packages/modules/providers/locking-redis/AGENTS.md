# @medusajs/locking-redis

Locking Module provider backed by Redis (`ioredis` + Lua scripts), with lease renewal during `execute`. Recommended for production and multi-instance deployments.

## Using this package

```ts
module.exports = defineConfig({
  modules: [
    {
      resolve: "@medusajs/medusa/locking",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/locking-redis",
            id: "locking-redis",
            // use this provider by default
            is_default: true,
            options: {
              redisUrl: process.env.LOCKING_REDIS_URL,
            },
          },
        ],
      },
    },
  ],
})
```

- Options (`src/types/index.ts`): `redisUrl` (required), `redisOptions` (ioredis), `namespace` (key prefix, default `"medusa_lock:"`), `waitLockingTimeout` (s, default 5), `defaultRetryInterval` (ms, default 20), `maximumRetryInterval` (ms, default 1000), `backoffFactor` (default 2).
- On Medusa Cloud, `defineConfig` registers it as the default when `REDIS_URL` is set.
- Docs: https://docs.medusajs.com/resources/infrastructure-modules/locking/redis.md
- Build a custom locking provider: https://docs.medusajs.com/resources/references/locking-module-provider.md

## Architecture

- `src/loaders/index.ts`: creates the ioredis connection and registers `redisClient` and `prefix` in the provider container.
- `src/services/redis-lock.ts`: `RedisLockingProvider implements ILockingProvider`, `static identifier = "locking-redis"`. Implements `execute`, `acquire`, `release`, `releaseAll`. Atomic acquire/extend/release are custom Lua commands defined with `defineCommand`, all owner-checked.
- `execute(keys, job, { timeout?, expire? })`: acquires with a per-call owner `execute:{uuid}`, retries with exponential backoff + jitter until `timeout`, then renews the lease (`expire`, default 60 s) every `expire / 3` while `job` runs. If renewal finds the key lost, `job`'s `AbortSignal` is aborted and `execute` throws a `CONFLICT` error even if `job` resolved.
- Reference for a custom locking provider that needs lease semantics.

## Development

- `yarn build` (also runs `resolve:aliases`), `yarn test` (unit specs in `src/services/__tests__`).
- `yarn test:integration`: uses `moduleIntegrationTestRunner` (Postgres) plus Redis at `REDIS_URL` (default `redis://localhost:6379`).

## Gotchas

- Missing `redisUrl` throws at boot. A failed initial connect is only logged.
- The `ttl` option in the type is unused.
- `acquire`/`release`/`releaseAll` without `ownerId` use the owner `"*"`; `releaseAll()` only deletes keys owned by `"*"`, not every lock.
- Long jobs passed to `execute` should honor the `signal` argument; ignoring it still makes `execute` throw once the lease is lost.
- `acquire` throws `CONFLICT` immediately on a held key unless `awaitQueue: true` (then it retries with backoff, with no timeout of its own). Without `expire`, the key never expires.
