<p align="center">
  <a href="https://www.medusajs.com">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/59018053/229103275-b5e482bb-4601-46e6-8142-244f531cebdb.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg">
    <img alt="Medusa logo" src="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg">
    </picture>
  </a>
</p>
<h1 align="center">
  @medusajs/instantsearch-adapter
</h1>

<h4 align="center">
  <a href="https://docs.medusajs.com">Documentation</a> |
  <a href="https://www.medusajs.com">Website</a>
</h4>

<p align="center">
  Building blocks for digital commerce
</p>
<p align="center">
  <a href="https://github.com/medusajs/medusa/blob/develop/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="Medusa is released under the MIT license." />
  </a>
  <a href="https://github.com/medusajs/medusa/blob/develop/CONTRIBUTING.md">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat" alt="PRs welcome!" />
  </a>
  <a href="https://discord.gg/xpCwq3Kfn8">
    <img src="https://img.shields.io/badge/chat-on%20discord-7289DA.svg" alt="Discord Chat" />
  </a>
  <a href="https://twitter.com/intent/follow?screen_name=medusajs">
    <img src="https://img.shields.io/twitter/follow/medusajs.svg?label=Follow%20@medusajs" alt="Follow @medusajs" />
  </a>
</p>

InstantSearch adapter for Medusa Search: a search client that lets [InstantSearch](https://www.algolia.com/doc/guides/building-search-ui/what-is-instantsearch/js/) widgets (`instantsearch.js`, `react-instantsearch`, `vue-instantsearch`, `angular-instantsearch`) query a Medusa application's search indexes. Use it in a storefront to build search UIs, such as search boxes, facet filters, and paginated results, on top of the `POST /store/search` API route. It ships no UI widgets, so install an InstantSearch library alongside it.

## At a glance

| | |
| --- | --- |
| Package | `@medusajs/instantsearch-adapter` |
| Type | Core library |
| Import from | `@medusajs/instantsearch-adapter` |

## Installation

```bash
npm install @medusajs/instantsearch-adapter react-instantsearch instantsearch.js
```

Replace `react-instantsearch` with the InstantSearch library of your storefront's framework.

## Usage

Pass a Medusa JS SDK instance so requests include the publishable API key and locale headers:

```tsx
import {
  InstantSearch,
  SearchBox,
  Hits,
  RefinementList,
  Pagination,
} from "react-instantsearch"
import { createInstantSearchAdapter } from "@medusajs/instantsearch-adapter"
import { sdk } from "./sdk"

const { searchClient } = createInstantSearchAdapter({
  sdk,
  path: "/store/search",
})

export function ProductSearch() {
  return (
    <InstantSearch indexName="product" searchClient={searchClient}>
      <SearchBox />
      <RefinementList attribute="brand" />
      <Hits />
      <Pagination />
    </InstantSearch>
  )
}
```

`indexName` is the name of a search index defined with `defineSearchIndex`. Which fields are searchable, facetable, filterable, and sortable comes from that index definition.

To sort, encode the sort in the index name as `<index>/sort/<field>:<asc|desc>`, for example with the `sortBy` widget:

```ts
sortBy({
  items: [
    { label: "Relevance", value: "product" },
    { label: "Price (asc)", value: "product/sort/min_price:asc" },
    { label: "Price (desc)", value: "product/sort/min_price:desc" },
  ],
})
```

### Expose indexes on `/store/search`

`POST /store/search` exposes no index by default. Opt indexes in with the `configureStoreSearch` middleware in `src/api/middlewares.ts`:

```ts
import { configureStoreSearch, defineMiddlewares } from "@medusajs/framework/http"

export default defineMiddlewares({
  routes: [
    {
      matcher: "/store/search",
      middlewares: [
        configureStoreSearch({
          allowed_indexes: {
            product: true,
            product_category: { filters: () => ({ is_active: true }) },
          },
        }),
      ],
    },
  ],
})
```

`filters` is ANDed onto every query for that index. For a product index whose `status` and `sales_channel_ids` fields are filterable, the route also limits results to published products in the publishable API key's sales channels.

## Configuration

| Option | Type | Description | Default |
| --- | --- | --- | --- |
| `sdk` | Medusa JS SDK instance | Preferred transport. Sends requests with `sdk.client.fetch`. | - |
| `requester` | `(queries: SearchQuery[]) => Promise<SearchResult[]>` | Custom transport. Must return one result per query, in the same order. | - |
| `baseUrl` | `string` | Medusa application URL, used with native `fetch` when `sdk` and `requester` aren't set. | - |
| `path` | `string` | Search route path, or an absolute URL. Required unless `requester` is set. | - |
| `publishableApiKey` | `string` | Publishable API key sent in the `x-publishable-api-key` header with native `fetch`. Not needed with `sdk`. | - |
| `headers` | `Record<string, string>` | Extra headers sent with every request. | - |
| `batch` | `boolean` | Send all queries in one `{ queries }` request. When `false`, sends each query in its own request. | `true` |
| `numericAttributes` | `string[]` | Fields used by range widgets. Requested as `stats` facets. | - |
| `distinctAttribute` | `string` | Field used when InstantSearch sends `distinct: true`. | - |
| `primaryKey` | `string` | Document field used as `objectID` when a hit has no `id`. | `"id"` |
| `placeholderSearch` | `boolean` | Whether an empty query still searches. When `false`, empty queries return no hits without calling the backend. | `true` |
| `cacheSearchResultsForSeconds` | `number` | Client-side cache TTL. `0` disables caching. | `0` |
| `additionalSearchParameters` | `Partial<Omit<SearchQuery, "entity">>` | Defaults merged into every query. Filters are ANDed with the InstantSearch filters; InstantSearch pagination and sort take precedence. | - |
| `indexSpecificSearchParameters` | `Record<string, Partial<Omit<SearchQuery, "entity">>>` | Same as `additionalSearchParameters`, keyed by index name (without the `/sort/...` suffix). | - |
| `transformQuery` | `(query, request) => SearchQuery` | Modify a query after it's mapped from InstantSearch params. | - |
| `transformResponse` | `(response, result, request) => InstantSearchSearchResponse` | Modify a response after it's mapped to the InstantSearch format. | - |

If InstantSearch doesn't send `hitsPerPage`, the adapter omits `pagination.take` so the backend's default page size applies.

## HTTP contract

To use a custom route instead of `/store/search`, it must accept the same requests. The adapter POSTs Medusa `SearchQuery` objects, not Algolia-format params.

With `batch: true` (default), the body is `{ queries: SearchQuery[] }`, and the response must be `{ results: SearchResult[] }` in the same order:

```json
{
  "queries": [
    {
      "entity": "product",
      "filters": { "q": "shoes", "brand": { "$in": ["nike"] } },
      "search_options": {
        "facets": [{ "field": "brand", "type": "value", "limit": 10 }]
      }
    }
  ]
}
```

```json
{
  "results": [
    {
      "hits": [{ "id": "prod_123", "document": { "title": "Trail shoe" } }],
      "facets": {
        "brand": {
          "type": "value",
          "values": [{ "value": "nike", "count": 4 }]
        }
      },
      "metadata": { "skip": 0, "take": 20, "count": 4, "query": "shoes" }
    }
  ]
}
```

With `batch: false`, each `SearchQuery` is the request body, and the response is a single `SearchResult`, or `{ results }` with exactly one result.

## Widget support

- **Supported**: search box, hits and infinite hits, pagination, hits per page, stats, configure, refinement lists (including searchable ones), menus, toggle refinements, current and clear refinements, sort by, and highlight and snippet.
- **Range widgets** (`rangeSlider`, `rangeInput`, `numericMenu`, `ratingMenu`): list the fields in `numericAttributes`, and opt them into stats facets on the index with `facetable({ types: ["stats"] })`. The Postgres and `search-medusa` providers both support stats facets.
- **Highlighting** depends on the search provider. `search-medusa` supports it, Postgres doesn't.
- **Not supported**: `geoSearch`, Algolia `filters` strings, and Algolia-only features such as Insights, Query Rules, and vector search widgets.

## Resources

- [InstantSearch adapter guide](https://docs.medusajs.com/resources/instantsearch)
- [Filtering, sorting, and pagination example](https://docs.medusajs.com/resources/instantsearch/examples/filtering-sorting-pagination)
- [Search Module](https://docs.medusajs.com/resources/infrastructure-modules/search)
- [Store search](https://docs.medusajs.com/resources/infrastructure-modules/search/store-search)
