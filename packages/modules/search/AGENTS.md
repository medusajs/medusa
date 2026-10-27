# @medusajs/search

Infrastructure module for provider-backed search: free-text queries, filters, sorting, and facets over denormalized documents declared with `defineSearchIndex`, kept current from events. Registered as `Modules.SEARCH` (`"search"`).

## Using this package

- Loaded by default through `defineConfig` (`@medusajs/medusa/search`) with the Postgres provider. Default registration from `packages/core/utils/src/common/define-config.ts`:

```ts
{
  resolve: "@medusajs/medusa/search",
  options: {
    providers: [
      {
        resolve: "@medusajs/medusa/search-postgres",
        id: "postgres",
        options: { engine: "native" }, // "lakebase" on Medusa Cloud
      },
    ],
  },
}
```

- Module options (`SearchModuleOptions`, `src/types/index.ts`):
  - `providers`: `{ resolve, id, options }[]`. Several providers may be registered; each index picks one by provider identifier.
  - `default_provider`: identifier used by indexes that name none. Required when more than one provider is registered.
  - `cloud`: `{ api_key, endpoint, environment_handle }`. When set, the built-in `search-medusa` provider (`src/providers/search-medusa`) is registered automatically.
  - `index_prefix`: prepended to every physical index name.
  - `reindex.batch_size`: documents per write request (default `100`).
  - `indexes`: filled by the application, not by hand (see below).
- Indexes are declared in `src/search/*.ts` of an app or plugin with `defineSearchIndex`, `search.define(...)`, `graphSeed`, and `graphConsume` from `@medusajs/framework/utils`. `packages/medusa/src/loaders/search.ts` imports those files before boot and passes the definitions as the `indexes` option.
- Events listed in a definition's `events` are routed to `ingest(event)` by the `search-ingestion` subscriber in `packages/medusa/src/subscribers/search-ingestion.ts`.

- In apps, query through Query rather than the module directly; it hydrates results from the graph. The free-text term goes in `filters.q`:

```ts
const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

const { data, search_result } = await query.search({
  entity: "brand",
  fields: ["id", "name", "country"],
  filters: { q: req.query.q as string },
  pagination: { take: 20 },
})
```

- Resolve the module itself with `container.resolve(Modules.SEARCH)` for index management (`reindex`, `listIndexes`, ...).

### Service methods (`src/services/search-module-service.ts`)

No generated CRUD (`MedusaService({})`). Public methods: `search`, `searchMany`, `upsertDocuments({ index, documents })`, `deleteDocuments({ index, filters })`, `ingest(event)`, `listIndexes`, `getIndex`, `listRetrievableFields`, `reindex(input)`, `deleteIndex(index)`, `createIndexMigrationPlan`, `executeIndexMigrationPlan(actions)`.

### Data models (`src/models`, bookkeeping only, not linkable)

- `SearchIndex` (`srhidx_`): logical index `name`, `active_version`.
- `SearchIndexVersion` (`srhver_`): one physical index per `version`, with `provider`, `physical_name`, `definition_hash`, `status`.
- `SearchIndexSync` (`srhsync_`): append-only seed run history (`status`, `last_key`, `resumable`, `documents_synced`, `error`).
- No module links. No module events of its own.

Docs: https://docs.medusajs.com/resources/infrastructure-modules/search.md, https://docs.medusajs.com/resources/infrastructure-modules/search/index-definitions.md, https://docs.medusajs.com/resources/infrastructure-modules/search/providers.md, https://docs.medusajs.com/resources/infrastructure-modules/search/reindexing.md

## Architecture

- `src/loaders/providers.ts` registers providers as `srh_<identifier>_<id>`; `SearchProviderService` (`src/services/search-provider.ts`) maps them by static `identifier` (e.g. `search-postgres`, `search-medusa`).
- Physical index lifecycle: `src/utils/migrations.ts` (plans run by `medusa db:migrate:search`, which `db:migrate` invokes in a child process), `seeding.ts` (fills new/empty/changed versions, then swaps `active_version`), `versions.ts`, `ingestion.ts`, `deletion.ts`, `active-version-cache.ts`.
- Seeding and reindexing are serialized through the Locking Module when it is registered (optional; absent in tests).
- A definition change is detected via `definition_hash` and handled as a migration that builds a new version, seeds it, and swaps it in.

## Development

```bash
cd packages/modules/search
yarn build
yarn test                                   # src/**/__tests__ (utils, search-medusa provider)
yarn test src/utils/__tests__/versions.spec.ts
yarn test:integration                       # integration-tests/__tests__ (needs Postgres, DB_* env vars)
yarn migration:create                       # after any change in src/models
```

- Integration tests: `integration-tests/__tests__/search-module.spec.ts` and `medusa-cloud-search.spec.ts`, fixtures in `integration-tests/__fixtures__/`.

## Gotchas

- `src/joiner-config.ts` must keep `models: []`; otherwise `defineJoinerConfig` discovers `src/models` from disk and makes the bookkeeping models linkable.
- Index definitions are resolved once in the constructor; nothing registers an index at runtime.
- Seeding on application start runs only in worker mode (`worker_mode !== "server"`), is fire-and-forget, and only seeds indexes already migrated. Errors are logged as `[Search] Failed to seed search indexes`.
- `deleteDocuments` throws `INVALID_DATA` without `filters`; use `{ id: [...] }` or a reindex.
- Registering the same provider identifier twice throws; `default_provider` naming an unregistered provider throws at boot.
- Reads use a cached active version and retry once on `NOT_FOUND` (`withActiveIndexRetry`); writes resolve it with `fresh: true`.
- Seeding retries rate-limited (HTTP 429) provider calls with backoff (`src/utils/rate-limit.ts`).
- `search-medusa`: Cloud creates an index on its first write, so an index seeded with no documents doesn't exist upstream; queries treat that 404 as an empty result. Typo tolerance only applies `Fuzzy` to words of at least `min_word_size_for_one_typo` characters; shorter words match exactly.
