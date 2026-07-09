---
"@medusajs/core-flows": patch
---

fix(core-flows): translate line items when creating an order with items and a locale

`createOrderWorkflow` did not run `getTranslatedLineItemsStep`, so line items provided at order/draft-order creation kept their default-language titles even when a `locale` was set — while items added later (via `addOrderLineItemsWorkflow`) were translated. Line items are now translated on creation too, matching the add-items, cart, and add-to-cart paths.
