---
"@medusajs/framework": patch
"@medusajs/medusa": patch
"@medusajs/settings": patch
"@medusajs/types": patch
---

fix(framework, medusa, settings, types): prevent sorting orders by computed fields that are not database columns

`GET /admin/orders?order=total` (and `fulfillment_status`, `payment_status`) was reaching
MikroORM with a sort key that has no backing column, causing an uncaught 500 error:
`Trying to order by not existing property Order.total`.

These three fields are computed values derived from related modules — they are not physical
columns in the `Order` table and cannot be used as sort keys at the database level.

**What changed:**

- `@medusajs/types`: added `nonSortableFields?: string[]` to `QueryConfig` — a blocklist of
  fields that are not valid sort targets for a given list endpoint.

- `@medusajs/framework`: `prepareListQuery` now checks `nonSortableFields` after stripping the
  descending prefix (`-`). Requests that attempt to sort by a blocked field receive a clear
  `400 INVALID_DATA` response (`Field total is not sortable`) instead of propagating to
  the ORM.

- `@medusajs/medusa`: `listTransformQueryConfig` for `GET /admin/orders` sets
  `nonSortableFields: ["total", "fulfillment_status", "payment_status"]`.

- `@medusajs/settings`: added `nonSortableFields` to the `EntityOverride` interface and the
  built-in `Order` override. `generateEntityColumns` passes the list into `processEntityType`,
  which sets `sortable: false` for those columns so the admin UI never offers sort affordances
  for them.

**No action required** — existing integrations that do not sort by these fields are unaffected.
Requests that were previously crashing with 500 will now receive a descriptive 400.
