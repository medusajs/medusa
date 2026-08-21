---
"@medusajs/medusa": patch
---

fix(medusa): send the built-in order confirmation on order.placed

The configurable-notifications subscriber listened for `order.created`, which the order module never emits (it has no CREATED workflow event), so the shipped order confirmation could never fire. The handler now subscribes to `order.placed` — emitted by completeCartWorkflow and draft-order conversion, i.e. when a customer actually placed an order — and loads the order behind the event's `{ id }` payload before resolving `order.email`/`order.id`, which the previous path templates could never read from the payload.
