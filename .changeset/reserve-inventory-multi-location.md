---
"@medusajs/core-flows": patch
---

fix(core-flows): split inventory reservations across locations when no single location can fulfill a line item

Cart completion previously confirmed inventory across the aggregate of a sales channel's stock locations but the reserve step always reserved from `location_ids[0]`, causing order placement to fail with "Not enough stock available" when the only way to satisfy the cart was to draw from multiple locations. The reserve step now greedily splits the reservation across the candidate locations (in the order they appear), and `createOrderFulfillmentWorkflow` filters reservations to the fulfillment's own location so split reservations are consumed correctly across separate per-location fulfillments.
