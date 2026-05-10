---
"@medusajs/settings": patch
---

fix(settings): mark `Order.payment_status` and `Order.fulfillment_status` as non-filterable to prevent dashboard 500.

Both fields are declared as scalar enums on the `Order` GraphQL type but are computed at query time, so the orders list API rejects them as filter parameters. With the `view_configurations` flag enabled, the column generator was emitting `filter: { enabled: true, ... }` for these columns, which surfaced a clickable filter affordance in the new configurable orders table; clicking it sent an unsupported query and 500'd the dashboard.

Adds a new `nonFilterableFields?: string[]` field to `EntityOverride` that suppresses the filter affordance on listed columns while leaving them visible and sortable, and lists `payment_status` / `fulfillment_status` under the built-in `Order` override. Closes #14897.
