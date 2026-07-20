---
"@medusajs/medusa": patch
---

fix(medusa): allow admin draft orders without an email or customer_id

`POST /admin/draft-orders` previously rejected requests missing both `email` and `customer_id`, even though `createOrderWorkflow` and the order data model already support neither being set. This blocked use cases with no captured customer identity (e.g. POS/walk-in orders). The admin validator no longer requires either field.
