---
"@medusajs/medusa": patch
"@medusajs/core-flows": patch
"@medusajs/types": patch
---

feat(orders): add fulfillment_status and payment_status filters to the admin orders list

fix(order-flows): `fulfillment_status`/`payment_status` aren't persisted columns on the order - they're computed from `payment_collections`/`fulfillments` after the remote query fetch. `getOrdersListWorkflow` now strips them out of the remote-query filters and applies them as an in-memory filter (with in-memory pagination) once the statuses are computed, so the new filters actually narrow the result set.

fix(types): add `fulfillment_status`/`payment_status` to `HttpTypes.AdminOrderFilters` so admin dashboard hooks like `useOrders` can pass these filters without a TypeScript excess-property error.
