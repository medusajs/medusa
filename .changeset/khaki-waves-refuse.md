---
"@medusajs/core-flows": patch
---

fix(core-flows): apply customer-group price lists when creating a draft order with items

When a draft order was created with line items for a customer belonging to a customer group, the initial prices ignored customer-group-scoped price lists and used the default variant price. The create-order workflow built the pricing context with only `customer_id`, so the `customer.groups.id` attribute that price-list rules match on was missing. The customer is now loaded with its groups and passed into the pricing context, consistent with the add-items flow.
