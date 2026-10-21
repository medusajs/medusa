# @medusajs/index

Index Module (`Modules.INDEX`, experimental): a denormalized Postgres store of data from several modules and their links, so `query.index()` can filter an entity by fields of linked records in one query.

## Using this package

- Not registered by default. Install `@medusajs/index` in the app and register it (docs use `resolve: "@medusajs/index"`; core re-exports it as `@medusajs/medusa/index-module`), then run `npx medusa db:migrate`.

```ts
module.exports = defineConfig({
  modules: [
    {
      resolve: "@medusajs/index",
    },
  ],
})
```

- Query it through Query, not the service directly:

```ts
const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

const { data: products } = await query.index({
  entity: "product",
  fields: ["id", "title", "sales_channels.id"],
  filters: { sales_channels: { id: "sc_123" } },
})
```

- `MEDUSA_FF_INDEX_ENGINE=true` (flag `index_engine`) makes the core `/store/products` and `/admin/products` routes use the index.
- Ingest custom models by setting `filterable: [...]` on a side of a `defineLink` (see `packages/core/utils/src/modules-sdk/define-link.ts`); `id` is added automatically.
- Options (`IndexModuleOptions` in `packages/core/types/src/index-data/service.ts`): `schema` (GraphQL string replacing `src/utils/default-schema.ts`). `customAdapter` is typed but the loader ignores it (code commented out); the storage provider is always `PostgresProvider`.
- Service methods (`IndexModuleService`): `query(config)`, `getInfo()` (per-entity status / last synced key), `sync({ strategy?: "full" | "reset" })`. No generated CRUD (`MedusaService({})`).

Docs: https://docs.medusajs.com/learn/fundamentals/query/index-module.md

## Architecture

- Default schema (`src/utils/default-schema.ts`) indexes `Product`, `ProductVariant`, `Price`, `SalesChannel`. Each type has `@Listeners(values: [...])` naming the module events (`product.product.created`, `pricing.price.updated`, ...) that update it.
- `src/utils/build-config.ts` `buildSchemaObjectRepresentation` merges that schema with every loaded module's joiner config and the `filterable` link definitions into an in-memory schema object representation.
- Models (`src/models`): `IndexData` (`id` + `name` composite PK, `data` JSON; Postgres list-partitioned per entity as `cat_<entity>` tables by `src/utils/create-partitions.ts`), `IndexRelation` (parent/child pivot rows), `IndexMetadata` (entity, fields, `fields_hash`, status pending/processing/done/error), `IndexSync` (`last_key` per entity for resumable sync).
- `onApplicationStart` hook: builds the schema, instantiates `PostgresProvider` (`src/services/postgres-provider.ts`, writes + `query`), subscribes `consumeEvent` to every listener event, generates types (`gqlSchemaToTypes`), then (worker mode only) diffs config against `IndexMetadata` (`src/utils/sync/configuration.ts`) and syncs changed entities via `DataSynchronizer`.
- `DataSynchronizer` + `src/utils/sync/orchestrator.ts` sync entity by entity in batches, coordinating instances with the Locking Module (`Modules.LOCKING`, 60s lock duration, renewed during sync).
- Query building: `src/utils/query-builder.ts`.

## Development

```bash
cd packages/modules/index
yarn build
yarn test                      # src/utils/__tests__
yarn test:integration          # needs Postgres
../../../node_modules/.bin/jest integration-tests/__tests__/query-builder.spec.ts
yarn migration:create          # after any change in src/models
```

- Integration tests: `integration-tests/__tests__/` (`index-engine-module.spec.ts`, `data-synchronizer.spec.ts`, `orchestrator.spec.ts`, `query-builder.spec.ts`, `config-sync.spec.ts`, ...).

## Gotchas

- Requires the Event Bus Module in the container; the constructor throws otherwise. With the in-memory event bus, incremental updates are not received across processes, so the index only catches up on the next start (docs recommend Redis event bus).
- Worker mode is anything except `worker_mode: "server"`. Server-mode instances neither subscribe to events nor sync; `sync()` there only resets metadata status (and `last_key` for `full`, or TRUNCATEs all index tables for `reset`) and emits the internal `index.continue-sync` / `index.full-sync` / `index.reset-sync` event for a worker to pick up.
- `onApplicationStart` catches and only logs errors, so a broken schema does not crash boot; check logs prefixed `[Index engine]`.
- Changing the schema (or a link's `filterable`) changes `fields_hash`; the entity is re-synced on the next start.
