---
"@medusajs/core-flows": patch
---

fix(core-flows): respect allow_backorder when calculating pickup inventory availability

Products with `allow_backorder=true` are now correctly treated as available for pickup shipping options, even when `inventory_quantity=0`. Previously, these products would incorrectly trigger `insufficient_inventory: true`, preventing customers from selecting pickup options for backorder-enabled products.
