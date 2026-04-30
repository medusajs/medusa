---
"@medusajs/medusa": patch
---

fix(medusa): `GET /admin/products?price_list_id=...` is significantly faster on large price lists. The `maybeApplyPriceListsFilter` middleware now queries the `price` entry point directly (filtered by `price_list_id`) instead of expanding the entire `price_list → prices → price_set → variant` graph through `price_list`. Variant ids are also de-duplicated before being applied to the products filter.
