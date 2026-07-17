---
"@medusajs/pricing": patch
---

fix(pricing): strip empty `rules` object from price payload to prevent DB error

When editing price-list prices with an empty `rules: {}` object, the `normalizePrices` function did not delete the `rules` property because `isPresent({})` returns `false`. The raw `rules` object was then sent to the database, causing a "column 'rules' of relation 'price' does not exist" error.