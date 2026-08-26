---
"@medusajs/order": patch
---

fix(order): allow filtering orders by all order_item join entity fields

Fixes filtering on `items.*` fields that live on the `order_item` join entity (e.g. `fulfilled_quantity`, `shipped_quantity`, `delivered_quantity`, `return_requested_quantity`, `return_received_quantity`, `return_dismissed_quantity`, `written_off_quantity`). Previously only `quantity`, `unit_price`, and `compare_at_unit_price` were routed to the join entity, causing queries like `listOrders({ items: { fulfilled_quantity: 0 } })` to throw `Trying to query by not existing property OrderLineItem.fulfilled_quantity`.
