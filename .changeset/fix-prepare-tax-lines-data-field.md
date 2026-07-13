---
"@medusajs/core-flows": patch
---

fix(core-flows): preserve `data` field in `prepareTaxLinesData` during cart completion

PR #15840 added the `data` column to tax line DTOs and the set/upsert steps, but `prepareTaxLinesData` in `cart/utils/prepare-line-item-data.ts` — which copies cart tax lines to order tax lines during `complete-cart` — was not updated. As a result the `data` field (used by providers like Stripe Tax to store jurisdiction breakdowns) was silently discarded on every order placement.
