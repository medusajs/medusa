# @medusajs/audit-postgres

Audit Module provider that stores audit logs in the `audit_log` table of the application's PostgreSQL database. Self-hosted storage for `@medusajs/audit`; on Medusa Cloud the module's built-in Cloud provider is used instead.

## Using this package

Not registered by default. Register it as a provider of the Audit Module:

```ts
module.exports = defineConfig({
  modules: [
    {
      resolve: "@medusajs/medusa/audit",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/audit-postgres",
            id: "postgres",
            options: { retention_days: 365 }, // omit to keep audit logs forever
          },
        ],
      },
    },
  ],
})
```

- Options (`PostgresAuditProviderOptions`): `retention_days` (positive number, optional). Invalid values throw at boot (`validateOptions`).
- After registering, run `npx medusa db:migrate` to create the table.
- Read and record audit logs through the Audit Module service, not this provider.

## Architecture

- `src/services/postgres-audit.ts`: `PostgresAuditService extends AbstractAuditProviderService`, `static identifier = "audit-postgres"`. Uses the injected Knex connection (`__pg_connection__`) with query builder SQL only, no MikroORM entities.
  - `write`: one multi-row insert per batch with `on conflict (id) do nothing`, so a retried batch never fails on rows an earlier attempt stored.
  - `list` / `listAndCount` / `retrieve`: filters and pagination built in `src/utils/query.ts`. Order is `started_at` then `id`, newest first by default. `q` is a case-insensitive substring match on `action`, `resource_type`, `resource_id`, `actor_id`. `select` limits columns; `id` is always returned.
  - `prune`: deletes rows with `started_at` older than `retention_days`, 10,000 rows per statement until none are left. Returns 0 without `retention_days`. Concurrent runs from several instances are safe. The Audit Module calls it on start and hourly.
- `src/migrations/Migration20261111120000.ts`: creates `audit_log` (no `created_at`, `updated_at`, `deleted_at`), with check constraints on `actor_type` and `outcome`, and indexes `(started_at desc, id desc)`, `(actor_id, started_at desc)`, `(resource_type, resource_id, started_at desc)`.

## Development

- `yarn build`, `yarn test` (unit specs in `src/utils/__tests__`).
- `yarn test:integration`: `integration-tests/__tests__/postgres-audit.spec.ts` loads the Audit Module from `../../audit` (build it first), creates its own database, and runs migrations through `medusaApp.runMigrations()`, the same path as `db:migrate`. Needs a local Postgres (`DB_HOST`, `DB_USERNAME`, `DB_PASSWORD`).

## Gotchas

- The table has no DML model on purpose: DML always adds `created_at`, `updated_at`, and `deleted_at` and scopes indexes to `deleted_at IS NULL`, which an insert-only table must not have. Schema changes therefore go in a new raw SQL migration in `src/migrations` (the same approach as `@medusajs/search-postgres`); `yarn migration:create` does not apply.
- The `actor_type` and `outcome` check constraints must change together with `AuditActorType` and `AuditOutcome` in `packages/core/types/src/audit/common.ts`.
