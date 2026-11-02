# @medusajs/instantsearch-adapter

Storefront-side InstantSearch `searchClient` for Medusa Search. It maps InstantSearch requests to Medusa `SearchQuery` payloads, posts them to a Medusa route (by default `POST /store/search`), and maps `SearchResult` responses back to the Algolia response shape widgets expect. Ships no UI widgets.

## Using this package

- Install alongside InstantSearch: `yarn add @medusajs/instantsearch-adapter instantsearch.js` (or `react-instantsearch`, etc.).
- `README.md` in this package has the full option list, HTTP contract, and widget support matrix; keep it in sync when behavior changes.
- Docs: https://docs.medusajs.com/resources/instantsearch.md, store route: https://docs.medusajs.com/resources/infrastructure-modules/search/store-search.md

```ts
import { createInstantSearchAdapter } from "@medusajs/instantsearch-adapter"
import { sdk } from "./sdk"

export const { searchClient } = createInstantSearchAdapter({
  sdk,
  path: "/store/search",
  numericAttributes: ["min_price"],
})
// <InstantSearch indexName="product" searchClient={searchClient}>
```

- Transport, in priority order: `requester` (custom `(queries) => SearchResult[]`), `sdk` (any object with `client.fetch`; sends publishable key and locale headers), or native `fetch` with `baseUrl` + `publishableApiKey`.
- `indexName` is the Search index name (sent as `entity`). Sorting is encoded in the index name: `product/sort/min_price:asc` (comma-separate multiple fields).
- Other options: `batch` (default `true`, one POST of `{ queries }`), `placeholderSearch` (default `true`), `distinctAttribute`, `primaryKey` (default `"id"`), `cacheSearchResultsForSeconds` (default `0`), `additionalSearchParameters`, `indexSpecificSearchParameters`, `transformQuery`, `transformResponse`, `headers`.

### Backend side (Medusa application)

The built-in `POST /store/search` route (`packages/medusa/src/api/store/search/route.ts`) needs the Search module and exposes no index until it is allowed with `configureStoreSearch`:

```ts
import {
  configureStoreSearch,
  defineMiddlewares,
} from "@medusajs/framework/http"

export default defineMiddlewares({
  routes: [
    {
      matcher: "/store/search",
      middlewares: [
        configureStoreSearch({
          allowed_indexes: {
            product: true,
            product_category: { filters: (req) => ({ is_active: true }) },
          },
        }),
      ],
    },
  ],
})
```

- Indexes not in `allowed_indexes` return 404 (and log a warning server-side). Multiple `configureStoreSearch` calls merge their `allowed_indexes`.
- Facetable/filterable/sortable fields come from the index's `defineSearchIndex` definition. Range widgets need the field listed in `numericAttributes` and marked `facetable({ types: ["stats"] })` on the index.

## Architecture

- `src/adapter.ts`: `createInstantSearchAdapter`; builds `search` / `searchForFacetValues` / `clearCache`, placeholder handling, TTL cache keyed by the serialized queries.
- `src/request.ts`: InstantSearch params to `SearchQuery` (`parseIndexName`, `parseSearchParams`, `adaptSearchRequest`, `adaptFacetSearchRequest`, layering of `additionalSearchParameters` / `indexSpecificSearchParameters`).
- `src/filters.ts`: `facetFilters` / `numericFilters` to Medusa `SearchFilters` (`$in`, `$nin`, `$gte`, ...), `mergeFiltersAnd`.
- `src/response.ts`: `SearchResult` to InstantSearch response (hits, `objectID`, highlights/snippets, facets, `facets_stats`).
- `src/http.ts`: transport selection, URL resolution, response unwrapping.
- `src/types.ts`: wire types are duplicated locally on purpose so the package has no runtime dependency on `@medusajs/types`; keep them aligned with `SearchTypes` when the Search contract changes.

## Development

```bash
yarn workspace @medusajs/instantsearch-adapter build   # tsup, CJS + ESM + d.ts
yarn workspace @medusajs/instantsearch-adapter test
cd packages/core/instantsearch-adapter && ../../../node_modules/.bin/jest src/__tests__/filters.spec.ts
```

- Unit tests: `src/__tests__/` (`adapter`, `filters`, `request`, `response`). The `/store/search` route is covered by `integration-tests/http/__tests__/search/`.
- Package has zero runtime dependencies and `sideEffects: false`; don't add imports from other `@medusajs/*` packages.

## Gotchas

- `assertAdapterTransport` throws at creation unless `requester` is set, or `path` is set together with `sdk`, `baseUrl`, or an absolute `path` URL.
- The response must contain exactly one result per posted query, in order; otherwise `unwrapSearchResults` throws `expected N search result(s), received M`. Accepted shapes: `{ results }`, an array, or a single `SearchResult`.
- Algolia `filters` strings are not translated (only `facetFilters` / `numericFilters`); pass Medusa filters via `additionalSearchParameters.filters` instead. Invalid facet/numeric filter strings throw.
- Facet filter strings split on the first `:`, so values may contain colons but field names may not.
- Without `hitsPerPage` from InstantSearch, `pagination.take` is omitted so the backend default applies.
- Hit `objectID` falls back from `hit.id` to `document[primaryKey]` to `document.id`.
- `searchForFacetValues` throws if `params.facetName` is missing.
