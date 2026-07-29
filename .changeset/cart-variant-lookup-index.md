---
"@medusajs/core-flows": patch
---

perf(core-flows): index variants by id in prepareVariantsAndItemsWithPricesStep so the per-line-item lookup is O(1) instead of a linear scan
