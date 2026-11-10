# @medusajs/search-postgres

Search Module provider that stores and queries search indexes in the application's PostgreSQL database. Two engines: `native` (GIN + `ts_rank` + `pg_trgm`, any Postgres) and `lakebase` (BM25 + ANN vectors, Medusa Cloud only). Registered by default by `defineConfig`.

## Using this package

Registered automatically with `id: "postgres"` and `engine: "lakebase"` on Medusa Cloud, `"native"` elsewhere. Register explicitly to change options:

```ts
module.exports = defineConfig({
  modules: [
    {
      resolve: "@medusajs/medusa/search",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/search-postgres",
            id: "search-postgres",
            options: {
              // requires a medusa_search_german text search configuration
              language: "german",
            },
          },
        ],
      },
    },
  ],
})
```

- Options (`PostgresSearchProviderOptions`): `engine` (`"native"` default | `"lakebase"`), `language` (default `"english"`), `embedder` (`(text) => Promise<number[]>`, lakebase only, needed for `.embed()` fields and `search_options.vector.query`), `vector_distance` (`"cosine"` default | `"l2"` | `"inner_product"`).
- After registering: `npx medusa db:migrate` (extensions + catalog table), then `npx medusa db:migrate-search` to build indexes from your index definitions.
- Index definitions and queries go through the Search Module / Query (`query.search(...)`), not this provider.
- Docs: https://docs.medusajs.com/resources/infrastructure-modules/search/providers/postgres.md
- Build a custom search provider: https://docs.medusajs.com/resources/references/search/provider.md
- Feature matrix, vector fields, filter semantics: `README.md` in this package.

## Architecture

- `src/services/postgres-search.ts`: `PostgresSearchService extends AbstractSearchProviderService` (from `@medusajs/framework/utils`), `static identifier = "search-postgres"`. Implements `upsertIndex`, `deleteIndex`, `listIndexes`, `upsertDocuments` (chunks of 200), `deleteDocuments`, `clearIndex`, `search`, `searchMany`.
- Uses the injected `manager` with raw SQL only (no MikroORM entities; `mikro-orm.config.dev.ts` has `entities: []`).
- `src/utils/plan.ts`: turns an index definition into an `IndexPlan` (one table per index, columns, GIN/BM25/ANN indexes); the catalog table `search_postgres_index` stores each plan and its `schema_hash`.
- `src/utils/filters.ts` (filters to SQL, jsonb containment for equality/`$in`), `facets.ts`, `documents.ts`, `extensions.ts`.
- `src/migrations/`: enables `pg_trgm`, `unaccent`, creates `medusa_search_english` and the catalog table. Extension creation soft-fails (`RAISE NOTICE`) when the DB role lacks privileges.

## Development

- `yarn build`, `yarn test` (unit specs in `src/utils/__tests__`).
- `yarn test:integration`: `integration-tests/__tests__/postgres-search.spec.ts` via `moduleIntegrationTestRunner`, needs a local Postgres with `pg_trgm`/`unaccent` available.

## Gotchas

- Providers are keyed by `identifier`, not `id`: index definitions and `default_provider` reference `search-postgres`, and registering this provider twice throws.
- `language` must match `/^[a-z0-9_]+$/i`, and the provider always queries the `medusa_search_<language>` text search config. Only `medusa_search_english` is created by the migration; create others yourself.
- Native engine: vector fields in a definition are dropped with a warning, but queries with `search_options.vector` are rejected.
- Unsupported on both engines (rejected explicitly): highlighting, geo, cursor pagination, query-time locales.
- Range operators, `$prefix`, and `$like` are rejected on array fields; a bare value on an array field means membership.
