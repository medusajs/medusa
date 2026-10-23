# @medusajs/locking

Locking Module (`Modules.LOCKING`): infrastructure module that serializes access to keys across concurrent jobs, delegating to a locking provider (in-memory built in; Redis and Postgres providers live in `packages/modules/providers/locking-redis` and `locking-postgres`).

## Using this package

- Registered by default as `@medusajs/medusa/locking` with only the in-memory provider (cloud config registers `@medusajs/medusa/locking-redis` as default when `REDIS_URL` is set; see `packages/core/utils/src/common/define-config.ts`).
- Options (`LockingModuleOptions` in `src/types/index.ts`): `providers[]` of `{ resolve, id, is_default?, options? }`.

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
            is_default: true,
            options: { redisUrl: process.env.LOCKING_REDIS_URL },
          },
        ],
      },
    },
  ],
})
```

- Resolve: `container.resolve(Modules.LOCKING)` (`ILockingModule`). In workflows prefer `acquireLockStep` / `releaseLockStep` from `@medusajs/medusa/core-flows`.

```ts
const locking = container.resolve(Modules.LOCKING)

await locking.execute("prod_123", async () => {
  // critical section
}, { timeout: 2 })
```

- Methods (`src/services/locking-module.ts`), all accept `provider` to override the default:
  - `execute(keys, job, { timeout?, expire?, provider? })`: acquires, runs `job`, always releases.
  - `acquire(keys, { ownerId?, expire?, provider? })`, `release(keys, { ownerId?, provider? })`, `releaseAll({ ownerId?, provider? })`.
- No data models, no events, no module links.

Docs: https://docs.medusajs.com/resources/infrastructure-modules/locking.md, https://docs.medusajs.com/resources/infrastructure-modules/locking/redis.md, https://docs.medusajs.com/resources/infrastructure-modules/locking/postgres.md, https://docs.medusajs.com/learn/fundamentals/workflows/locks.md

## Architecture

- `src/loaders/providers.ts`: always registers `InMemoryLockingProvider` (`identifier = "in-memory"`) under `lp_in-memory` and as the default; then registers each configured provider as `lp_<id>` (alias of its provider registration key). The default becomes the provider with `is_default: true`, or the only configured provider when exactly one is configured.
- `src/services/locking-provider.ts` resolves `lp_<providerId>`; providers must have a static `identifier` and a non-empty `id`, or registration throws.
- The service's `__hooks.onApplicationShutdown` calls the optional `shutdown()` of every registered provider (used by `locking-redis` to close its client).
- `src/providers/in-memory.ts`: process-local `Map` of locks with owner, optional expiration, and a promise queue.

## Development

```bash
cd packages/modules/locking
yarn build
yarn test
yarn test:integration
../../../node_modules/.bin/jest integration-tests/__tests__/index.spec.ts -t "should release lock in case of failure"
```

- Integration tests: `integration-tests/__tests__/index.spec.ts`.
- The `migration:*` scripts in `package.json` are unused: there is no `mikro-orm.config.dev.ts` and no `src/models`.

## Gotchas

- In-memory locks only protect a single process; multi-instance deployments need the Redis or Postgres provider.
- `timeout` and `expire` are in seconds. In-memory `execute` uses `timeout` default 5 and minimum 1, waits in the key's queue, and throws on timeout; the job is never started then.
- `acquire` without `ownerId` on an already locked, non-expired key throws `Failed to acquire lock for key "<key>"`. Re-acquiring with the same `ownerId` succeeds and refreshes `expire`.
- Locks taken by `acquire` without `expire` never expire in memory; release them explicitly.
