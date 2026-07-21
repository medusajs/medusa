---
"@medusajs/core-flows": patch
---

fix(core-flows): filter reservations by line item in createOrderFulfillmentWorkflow

The get-reservations query in `createOrderFulfillmentWorkflow` passed its
`line_item_id` constraint under the variables key `filter`, which the remote
query layer does not recognize (it only honors `filters`). The constraint was
silently dropped and every reservation item in the database was fetched and
hydrated on each fulfillment creation, blocking the event loop for tens of
seconds on stores with large reservation tables.
