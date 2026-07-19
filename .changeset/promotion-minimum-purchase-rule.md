---
"@medusajs/medusa": patch
"@medusajs/types": patch
"@medusajs/core-flows": patch
"@medusajs/dashboard": patch
---

feat(medusa, core-flows, dashboard): support minimum purchase requirements on promotions

Adds `item_subtotal` as a first-class promotion rule attribute with numeric
operators (gte, gt, eq, lte, lt), so all promotion types can be gated on a
minimum purchase amount, e.g. spend 100 or more to get a fixed discount, a
percentage discount, a shipping discount, or free shipping. The order edit and
draft order promotion contexts now include `item_subtotal` so such promotions
are correctly re-evaluated during order changes.
