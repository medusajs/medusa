---
"@medusajs/index": patch
"@medusajs/medusa": patch
---

feat(index, medusa): resolve `price_list_id` filter on `GET /admin/products` natively through the index engine.

- `@medusajs/index`: the default schema now exposes `price_list_id` on `Price`. On upgrade, existing index-engine users will trigger a one-time re-sync of the `Price` entity (driven by the existing schema-change detection); during that window, `price_list_id` filters served from the index may return incomplete results.
- `@medusajs/medusa`: `getProductsWithIndexEngine` now translates `price_list_id` into the nested filter `variants.prices.price_list_id`, and `maybeApplyPriceListsFilter` skips its in-JS variant-id expansion when the index engine path will handle the filter (i.e. `index_engine` flag enabled and no `tags`/`categories` filters forcing the non-index fallback).

For users with the `index_engine` feature flag enabled and large price lists this removes the multi-second middleware overhead on the price-list detail page.
