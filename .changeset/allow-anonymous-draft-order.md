---
"@medusajs/medusa": patch
---

fix(medusa): allow admin draft orders without an email or customer_id

`POST /admin/draft-orders` previously rejected requests missing both `email` and `customer_id`, even though `createOrderWorkflow` and the order data model already support neither being set. This blocked use cases with no captured customer identity (e.g. POS/walk-in orders). The admin validator no longer requires either field.

Also fixes a related bug the relaxed validator exposed: the route's customer-lookup fallback queried `customer` with `filters: { id: undefined }` when `customer_id` was omitted, which matched an arbitrary customer instead of none, leaking an unrelated customer's email onto the draft order. The lookup now only runs when `customer_id` is actually provided.
