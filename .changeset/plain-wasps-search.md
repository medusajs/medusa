---
"@medusajs/medusa": patch
"@medusajs/types": patch
"@medusajs/framework": patch
---

feat(medusa,types,framework): add a generic, InstantSearch-compatible store search endpoint

`POST /store/search` takes the `SearchQuery` batch `@medusajs/instantsearch-adapter`
sends, runs each query against the index it names, and answers with the search
engine's own results — hits, scores, highlights and facets. It replaces
`/store/products/search`, whose `GET` shape neither InstantSearch nor the adapter
could talk to.

Nothing is searchable until a store opts an index in with the new
`configureStoreSearch` middleware, which is also where it narrows what a query
may reach within an allowed index. A product index is narrowed to published
products in the publishable key's sales channels automatically, wherever it
declares those fields, as every other store product read is.
