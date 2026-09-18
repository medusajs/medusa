---
"@medusajs/core-flows": patch
---

fix(core-flows): normalize the legacy `customer_group_id` price list rule attribute to `customer.groups.id`, so customer group price lists created through the API are matched by the pricing context instead of being silently skipped
