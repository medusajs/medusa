# @medusajs/audit

Audit Module: records audit logs (who did what, on which resource, how it ended) and reads them back. Registered as `Modules.AUDIT` (`"audit"`). Audit logs are insert and read only: there is no update or delete API.

## Using this package

- Not registered by default: applications add `{ resolve: "@medusajs/medusa/audit" }` to `modules` in `medusa-config.ts`. Without `providers` or a Cloud endpoint, audit logs are stored in the application's database; run `db:migrate` for the table.
- It is a licensed module: the loader (`packages/core/modules-sdk/src/loaders/utils/load-internal.ts`, `LICENSED_MODULES`) only loads it when the license covers `LicenseFeature.AUDIT` (`"audit"`). There is no feature flag.
- Options (`AuditModuleOptions` in `packages/core/types/src/audit/options.ts`):
  - `enabled` (default `true`): when `false`, `createAuditLogs()` is a no-op and nothing is buffered. Reads still go to the default provider.
  - `retention_days`: for the built-in Postgres storage only; audit logs older than this are deleted. Unset keeps them forever. Invalid values throw at boot. With `providers` or a Cloud endpoint it has no effect, and the loader logs a warning.
  - `providers`: `{ resolve, id, options }[]`, custom providers. When set, the built-in Postgres storage is not registered.
  - `default_provider`: a provider `id`. Defaults to `cloud` when `cloud.endpoint` is set, otherwise to the only provider (the built-in `postgres` one when nothing else is configured). Required with several providers and no Cloud.
  - `cloud`: `{ api_key, endpoint, environment_handle }`. When `endpoint` is set, the built-in Cloud provider is registered with the id `cloud` and becomes the default; the other two are then required.
  - `buffer`: `{ max_size = 100, flush_interval_ms = 1000, max_buffered = 10000 }`.

```ts
import { Modules } from "@medusajs/framework/utils"
import type { IAuditModuleService } from "@medusajs/framework/types"

const audit: IAuditModuleService = container.resolve(Modules.AUDIT)

audit.createAuditLogs({ actor_type: "system", action: "catalog.import" }) // returns void
const [logs, count] = await audit.listAndCountAuditLogs(
  { resource_type: "order", resource_id: "order_123" },
  { skip: 0, take: 20 }
)
const log = await audit.retrieveAuditLog("audlog_123") // NOT_FOUND when missing
await audit.flush() // only needed when a script must read its own records back
```

### Service (`src/services/audit-module-service.ts`)

- `createAuditLogs(entry | entries): void`: never throws and never awaits storage. Each entry is normalized (`src/utils/normalize.ts`): `action` is required; `actor_type` defaults to `system`, `outcome` to `succeeded`, `started_at` to now, `ended_at` to `started_at`; dates may be ISO strings; an `audlog_` id is always generated. Invalid entries are dropped with one warning that names the reasons, never the contents.
- `listAuditLogs(filters?, config?)`, `listAndCountAuditLogs(filters?, config?)`: delegate to the default provider with `skip: 0`, `take: 20` and `order: { started_at: "DESC" }` filled in.
- `retrieveAuditLog(id, config?)`: the provider returns `null` for a missing id; the module throws `MedusaError.Types.NOT_FOUND`.
- `flush()`: drains the buffer, never throws.
- Filters (`FilterableAuditLogProps`): `id`, `actor_type`, `actor_id`, `action`, `resource_type`, `resource_id`, `outcome` (value or array), `started_at` (`$gt`/`$gte`/`$lt`/`$lte`), `q`.

## Architecture

- `src/utils/buffer.ts` (`AuditBuffer`): in-memory queue. Writes when it holds `max_size` entries or `flush_interval_ms` after the first pending one (the timer is `unref`'d). Batches are at most `max_size`. A failed batch is retried 3 times in total with 200 ms then 400 ms backoff, then dropped with an error log carrying the count and the reason. Over `max_buffered`, the oldest entries are dropped with a warning. Concurrent `flush()` calls share one drain, which also picks up entries pushed meanwhile.
- Hooks: `onApplicationPrepareShutdown` and `onApplicationShutdown` flush.
- `src/loaders/providers.ts`: registers the Cloud provider from `options.cloud`, then `options.providers` through `moduleProviderLoader`, each as `aud_<id>` instantiated with its own options. It registers `audit_default_provider` and `auditProviderService`, and throws at boot for duplicate ids, an unknown `default_provider`, or several providers without a default. With no Cloud endpoint and no `providers`, it registers the built-in Postgres storage.
- `src/services/audit-provider.ts` (`AuditProviderService`): the only place that knows which provider stores audit logs. The module service calls it and never sees provider ids.
- `src/providers/audit-medusa`: the built-in Medusa Cloud provider (`MedusaAuditService`, identifier `audit-medusa`). The whole wire contract is in `services/medusa-audit.ts`, with no separate client: `POST {endpoint}/records` with `{ records }`, `GET {endpoint}/records` with filters as query parameters (arrays repeated, `started_at[$gte]=<ISO>`, `q`, `offset`, `limit`, `order=-started_at|started_at`, `fields`) answering `{ records, count }`, and `GET {endpoint}/records/:id` answering `{ record }` or 404. Headers: `Authorization: Basic <api_key>` and `x-medusa-environment-handle`. The contract is provisional until the Cloud audit service exists.
- `src/models/audit-log.ts`: the `audit_log` data model, with generated migrations (`yarn migration:create`). It carries the implicit `created_at`, `updated_at` and `deleted_at` columns, which are never used or returned. `AuditModuleService` extends `MedusaService({ AuditLog })` and overrides every generated method: `createAuditLogs`, `listAuditLogs`, `listAndCountAuditLogs` and `retrieveAuditLog` go through the buffer and the provider, and `updateAuditLogs`, `deleteAuditLogs`, `softDeleteAuditLogs` and `restoreAuditLogs` throw `NOT_ALLOWED`.
- `src/providers/audit-postgres` (`PostgresAuditService`, id `postgres`): the default storage. It reads and writes through the generated `auditLogService`, so filters, `q` (over `action`, `actor_id`, `resource_type`, `resource_id`), pagination and field selection are core's. `write` starts `prune()` in the background at most once an hour when `retention_days` is set; there is no timer, so nothing is pruned while nothing is written.
- Custom providers extend `AbstractAuditProviderService` from `@medusajs/framework/utils` and implement `IAuditProvider` (`write`, `list`, `listAndCount`, `retrieve`). Retention is a provider's own concern.

## Development

```bash
cd packages/modules/audit
yarn build
yarn test               # buffer, normalization, loader, Cloud provider
yarn test:integration   # integration-tests/__tests__/audit-module.spec.ts, loads dist: build first
```

- Integration suites inject `testLicense([LicenseFeature.AUDIT])` from `@medusajs/test-utils`, or the module won't load, and use the in-memory provider in `integration-tests/__fixtures__`. Postgres storage is covered in `integration-tests/__tests__/postgres-storage.spec.ts`.

## Gotchas

- `createAuditLogs()` returns `void`, not a promise. Audit logs are lost if the process dies before a flush, or if the provider stays down beyond the retries; this is the accepted trade-off for not delaying requests.
- Never pass whole request or response bodies in `request_data` / `response_data`: they hold personal data and secrets. Pass the fields to keep.
- Writes and reads go to the default provider only.
- An explicit `default_provider` wins over the Cloud default.
