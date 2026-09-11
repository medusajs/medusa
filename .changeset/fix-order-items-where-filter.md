---
"@medusajs/order": patch
---

fix(@medusajs/order): reroute order_item filters on every join-entity field, not just three

Filters on order_item join-entity fields other than `quantity`, `unit_price`, and `compare_at_unit_price` (e.g. `items.fulfilled_quantity`, `items.shipped_quantity`) previously routed to the line-item table, where the column does not exist, and failed metadata validation. The where-remap now reroutes the full join-entity field set (matching the same set already used on the select side) plus the price fields to the order_item entity. Issue #16612.
