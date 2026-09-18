---
"@medusajs/order": patch
---

fix(order): serialize order-change creation and fix stale item quantities in concurrent order changes

Two compounding defects let two concurrent order-modifying calls for the same order (e.g. two returns, or a return racing an order edit) corrupt order item state instead of being safely serialized or rejected.

**1. `createOrderChange_`'s "one active order change per order" guard was an unlocked check-then-act.** It lists existing PENDING/REQUESTED order changes, throws if one exists, then creates a new one - with no row lock and no unique constraint backing the invariant (`IDX_order_change_order_id` is not unique). Two concurrent calls could each see no active change and both create one.

**2. `applyOrderChanges_`'s read of `items.detail` (fulfilled/return/shipped/etc. quantities) could return stale values already cached in the request's identity map** from an earlier read in the same call chain (e.g. `createReturn`'s initial order fetch, taken before a concurrent transaction committed its own change to the same order). Every quantity validation and computation in `applyChangesToOrder` (e.g. `RETURN_ITEM` checking requested vs. fulfilled) runs against this data, so a concurrent, already-committed change's contribution could be silently invisible to it.

Together, this let two concurrent returns for the same item each independently compute their return quantity against the same pre-race baseline: both could succeed, each writing its own versioned `OrderItem` detail row, with neither reflecting the other's contribution - `return_requested_quantity` ending up wrong (understated, or allowing more to be returned than was ever fulfilled) depending on the scenario.

**The fix:**
- `createOrderChange_` now locks the order row(s) with `SELECT ... FOR UPDATE` before checking for an active order change, serializing concurrent order-change creation for the same order.
- `applyOrderChanges_` now patches `items[].detail`'s quantity columns with a plain, cache-bypassing read scoped to each item's current version, instead of trusting whatever the identity map already had cached. A blanket MikroORM `refresh: true` isn't safe to use for this: the version-scoped `items` relation is stitched together by a correlated subquery in `base-repository-find.ts`, and MikroORM's refresh path re-populates collection relations without going through that custom query builder - it was observed to fall back to loading the earliest version's row instead of the current one.

Added a regression test that reproduces this against a real DB with two concurrent `createReturn` calls for the same order, in two scenarios: quantities that should both legitimately succeed (asserting the combined `return_requested_quantity` is correct, not lost), and quantities that together exceed what was fulfilled (asserting exactly one is rejected). Full order module integration suite passes (86/86).
