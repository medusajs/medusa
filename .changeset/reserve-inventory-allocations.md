---
"@medusajs/core-flows": patch
---

fix(core-flows): split inventory reservations across stock locations and allow customizing reservation allocations

When a cart is completed and no single stock location can cover a line item's quantity, but the aggregate across the sales channel's locations can, the reservation is now split across locations instead of failing with "Not enough stock available". The new `reserveInventoryWorkflow` exposes a `setReservationAllocations` hook to customize at which stock locations quantities are reserved (e.g. for in-store pickup), and `createOrderFulfillmentWorkflow` consumes reservations at the fulfillment's location first so split reservations are fulfilled correctly per location, while keeping the existing behavior for reservations at other locations.
