---
"@medusajs/utils": patch
---

feat(utils): add a `context` option to the `graphSeed` and `graphConsume` search helpers, forwarded to every `query.graph` read including the catch-up pass, so an index built from fields that need a query context — such as `variants.calculated_price`, which the Pricing Module refuses to calculate without a currency — can use the helpers instead of a hand-written `seed` and `consume`
