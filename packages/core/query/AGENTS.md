# @medusajs/query

Implements Query, the cross-module read layer: it takes `query.graph()` / `query.index()` / `query.search()` input, plans it against every queryable module's joiner config and link definitions (`RemoteJoiner`), fetches from each module service, and stitches the results. `@medusajs/modules-sdk` builds the instance that is registered as `query` in the container.

## Using this package

Do not import this package directly. Resolve Query from the container:

```ts
import { ContainerRegistrationKeys, QueryContext } from "@medusajs/framework/utils"

const query = container.resolve(ContainerRegistrationKeys.QUERY)

const { data: products, metadata } = await query.graph(
  {
    entity: "product",
    fields: ["id", "title", "variants.*", "post.*"],
    filters: { status: "published" },
    pagination: { skip: 0, take: 20, order: { created_at: "DESC" } },
    context: {
      variants: {
        calculated_price: QueryContext({
          region_id: "reg_123",
          currency_code: "usd",
        }),
      },
    },
  },
  { throwIfKeyNotFound: true }
)
```

- In API routes use `req.scope.resolve(ContainerRegistrationKeys.QUERY)`; in workflows prefer `useQueryGraphStep` from `@medusajs/core-flows`.
- `query.graph(input, options)` input: `entity`, `fields`, `filters`, `pagination` (`skip`, `take`, `order`), `context`, `withDeleted`, `strategy` (`"joined" | "select-in" | "balanced"`). Returns `{ data, metadata }` (`metadata` holds `count`/`skip`/`take` when paginated).
- Options (`RemoteJoinerOptions`): `throwIfKeyNotFound`, `throwIfRelationNotFound`, `initialData`, `initialDataOnly`, `locale` (applies translations), `cache` (`enable`, `key`, `ttl`, `tags`, `autoInvalidate`, `providers`).
- `query.index(...)` filters through the Index Module and accepts `joinFilters`; throws `Index module is not loaded.` without it.
- `query.search(...)` runs through the Search Module and hydrates fields the index doesn't store with `query.graph`; throws `Search module is not loaded.` without it.
- Legacy: calling `query(...)` / `query.gql(...)` (old remote query) still works.
- Entity names and field typings come from `.medusa/types/query-entry-points` generated on `medusa develop`.
- Docs: https://docs.medusajs.com/learn/fundamentals/query.md, https://docs.medusajs.com/learn/fundamentals/query/query-context.md, https://docs.medusajs.com/learn/fundamentals/query/index-module.md, https://docs.medusajs.com/learn/fundamentals/query/search.md

## Architecture

- `src/query/query.ts`: `Query` class and `createQuery()` (only modules with `isQueryable` definitions are included). `graph` and `index` are wrapped with `@Cached(queryCacheDecoratorOptions)` from `cache.ts`.
- `src/query/to-remote-query.ts`, `to-remote-joiner-query.ts`: convert `{ entity, fields, filters }` input into the joiner query shape.
- `src/query/module-data-fetcher.ts`: calls each module's `list`/`listAndCount`.
- `src/joiner/`: `RemoteJoiner` pipeline `GraphCatalog` (`catalog.ts`, indexes joiner configs) -> `compileQuery` (`compile.ts`, query -> plan) -> `executePlan` (`execute.ts`, fetch + join + shortcuts).
- `src/joiner/cross-module-joins/`: filters/sorts on linked-module fields are pushed down to SQL (`EXISTS`/scalar subqueries) when every hop is a link, read-only link FK, or DML relation in the same database and the field is a non-computed column; anything else becomes a residual filter applied in memory after fetching (`in-memory-filter.ts`).
- Tracing hooks: `Query.instrument.graphQuery/remoteQuery/remoteDataFetch` (wired by `packages/medusa/src/instrumentation`).

## Development

```bash
yarn build
yarn test                                   # jest --bail --forceExit (src and integration-tests)
yarn test src/joiner/__tests__/cross-module-joins.spec.ts
```

- `integration-tests/__tests__/query.spec.ts` uses mocked module services from `integration-tests/__fixtures__/setup`; no database needed.
- Real end-to-end Query behavior is exercised in `integration-tests/modules/` and `integration-tests/http/` at the repo root.

## Gotchas

- Caching is off unless `options.cache` is passed with `enable: true` or any of `key`/`ttl`/`tags`/`computeAutomaticTags`/`autoInvalidate`/`providers`; `cache.enable: false` always wins.
- Cross-module filter pushdown restricts root rows (same semantics as `query.index`), and expand nodes that existed only to carry those filters are dropped.
- `createQuery` throws `Duplicated instance of module <name> is not allowed.` if two loaded modules share a key.
- `query.index` and `query.search` pass `pagination.take` into the follow-up `graph` call on purpose: it forces the `select-in` strategy.
- `throwIfKeyNotFound` requires the primary key in `filters`; otherwise it throws `Primary key(s) [...] not found in filters` even if other filters match.
