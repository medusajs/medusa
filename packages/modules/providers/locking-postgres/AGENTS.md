# @medusajs/locking-postgres

Locking Module provider backed by PostgreSQL: `execute` uses transaction-scoped advisory locks, while `acquire`/`release` use rows in a `locking` table. Use it for multi-instance deployments without Redis.

## Using this package

```ts
module.exports = defineConfig({
  modules: [
    {
      resolve: "@medusajs/medusa/locking",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/locking-postgres",
            id: "locking-postgres",
            // use this provider by default
            is_default: true,
          },
        ],
      },
    },
  ],
})
```

- No options. Then run `npx medusa db:migrate` to create the `locking` table.
- The default provider is used unless a call names another; without `is_default` and with several providers registered, the Locking Module falls back to its in-memory provider.
- Docs: https://docs.medusajs.com/resources/infrastructure-modules/locking/postgres.md
- Build a custom locking provider: https://docs.medusajs.com/resources/references/locking-module-provider.md

## Architecture

- `src/services/advisory-lock.ts`: `PostgresAdvisoryLockProvider extends MedusaService({ Locking }) implements ILockingProvider`, `static identifier = "locking-postgres"`.
- `ILockingProvider` methods: `execute(keys, job, { timeout? })`, `acquire(keys, { ownerId?, expire? })`, `release(keys, { ownerId? })`, `releaseAll({ ownerId? })`. Reference for a custom locking provider.
- `execute`: opens a transaction, runs `pg_advisory_xact_lock(hash(key))` per key (djb2-style 32-bit hash), races against `timeout` (default 5 s), runs `job`, commits. The lock is held by the transaction, so no lease renewal.
- `acquire`/`release`: raw SQL on the `locking` table (`id` = key, `owner_id`, `expiration`).
- `src/models/locking.ts` + `src/migrations/` (MikroORM config in `mikro-orm.config.dev.ts`).

## Development

- `yarn build`, `yarn test`
- `yarn test:integration`: `integration-tests/__tests__/index.spec.ts` uses `moduleIntegrationTestRunner`, so it needs a local Postgres (`DB_HOST`, `DB_USERNAME`, `DB_PASSWORD`).
- After changing the model: `yarn migration:create` from this package.

## Gotchas

- Forgetting `db:migrate` after registering the provider makes `acquire`/`release` fail (`locking` table missing); `execute` still works since it only uses advisory locks.
- `execute` ignores `expire` and never aborts the job's `AbortSignal`; a long job holds a DB connection and transaction for its whole duration.
- Keys are hashed to 32-bit ints for advisory locks, so distinct keys can collide and serialize each other.
- `releaseAll()` without `ownerId` truncates the whole `locking` table.
- `acquire` on a key held by a lock with `owner_id = null` always fails, even for a caller without `ownerId`.
