# `@medusajs/instantsearch-adapter`

An [InstantSearch](https://www.algolia.com/doc/guides/building-search-ui/what-is-instantsearch/js/) search client for Medusa Search. It translates InstantSearch requests into Medusa `SearchQuery` payloads and maps `SearchResult` responses back into the shape InstantSearch widgets expect.

The adapter does not ship UI widgets. Install InstantSearch (or React / Vue / Angular InstantSearch) in your storefront alongside this package.

## Installation

```bash
yarn add @medusajs/instantsearch-adapter instantsearch.js
```

Use a Medusa JS SDK instance so store requests include the publishable API key:

```ts
import { createInstantSearchAdapter } from "@medusajs/instantsearch-adapter"
import instantsearch from "instantsearch.js"
import {
  searchBox,
  hits,
  pagination,
  refinementList,
} from "instantsearch.js/es/widgets"
import { sdk } from "./sdk"

const { searchClient } = createInstantSearchAdapter({
  sdk,
  path: "/store/search",
})

const search = instantsearch({
  indexName: "product",
  searchClient,
})

search.addWidgets([
  searchBox({ container: "#searchbox" }),
  hits({ container: "#hits" }),
  refinementList({ container: "#brand", attribute: "brand" }),
  pagination({ container: "#pagination" }),
])

search.start()
```

The same `searchClient` works with `react-instantsearch`, `vue-instantsearch`, and `angular-instantsearch`.

### React InstantSearch

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

const { searchClient } = createInstantSearchAdapter({ sdk, path: "/store/search" })

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

## Configuration

```ts
createInstantSearchAdapter({
  sdk, // preferred
  // requester,                     // custom (queries) => results
  // baseUrl, publishableApiKey,    // native fetch fallback
  path: "/store/search",
  batch: true, // POST `{ queries }` in one request
  placeholderSearch: true, // empty query still searches
  numericAttributes: ["min_price"], // range widgets: request stats facets
  distinctAttribute: "handle",
  primaryKey: "id",
  cacheSearchResultsForSeconds: 0,
  additionalSearchParameters: {
    filters: { status: { $eq: "published" } },
    search_options: { match_strategy: "last" },
  },
  indexSpecificSearchParameters: {
    product: { fields: ["title", "handle", "thumbnail"] },
  },
  transformQuery: (query, request) => query,
  transformResponse: (response, result, request) => response,
})
```

`path` is required when using `sdk` or `baseUrl`. If InstantSearch does not send `hitsPerPage`, the adapter omits `pagination.take` so the backend default applies.

`indexName` is the Search index `name` (the `entity` sent to Medusa). For `sortBy`, encode the sort in the index name:

```ts
sortBy({
  items: [
    { label: "Relevance", value: "product" },
    { label: "Price (asc)", value: "product/sort/min_price:asc" },
    { label: "Price (desc)", value: "product/sort/min_price:desc" },
  ],
})
```

## HTTP contract

The adapter POSTs Medusa `SearchQuery` objects, not Algolia-format params.

**Batched (default)**

```http
POST /store/search
Content-Type: application/json
x-publishable-api-key: pk_...

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

InstantSearch sends one request per disjunctive facet in addition to the hits query. The route should run `searchMany` / `query.search` per item and return results in the same order.

When `batch: false`, each `SearchQuery` is POSTed as the body and the response is a single `SearchResult`.

The route is responsible for storefront constraints (sales channel, region, which indexes are public). Pass extra filters through `additionalSearchParameters` if the client should send them itself.

## Widget support

Supported: `searchBox`, `hits`, `infiniteHits`, `pagination`, `hitsPerPage`, `stats`, `configure`, `index`, `refinementList` (including searchable), `menu`, `menuSelect`, `toggleRefinement`, `currentRefinements`, `clearRefinements`, `sortBy`, `highlight` / `snippet` (if the search provider supports highlighting), `routing`.

Supported with caveats:

- **Range widgets** (`rangeSlider`, `rangeInput`, `numericMenu`, `ratingMenu`) need stats facets. List those fields in `numericAttributes`, and mark them `facetable({ types: ["stats"] })` (or include `"stats"` alongside `"range"`) on the index — stats are opt-in. Both the Postgres and `search-medusa` providers support stats.
- **Hierarchical menu / breadcrumb** work if the index stores Algolia-style `categories.lvl0`, `categories.lvl1`, … fields.
- **Highlighting** is provider-dependent (available on `search-medusa`, not on Postgres).

Not supported: `geoSearch`, Algolia `filters` strings, Insights / Analytics, Query Rules, related-items, autocomplete, vector-search widgets.

Facetable, filterable, and sortable fields come from your `defineSearchIndex` definition, not from this package. The InstantSearch `stats` widget (hit count / timing) is independent of stats facets and works without `numericAttributes`.
