---
"@medusajs/core-flows": patch
---

fix(core-flows): stop order-edit confirmation from over-reserving fulfilled lines and resurrecting old reservations on compensation failure

`confirmOrderEditRequestWorkflow` deletes and re-creates the inventory reservation for every line item touched by an `ITEM_UPDATE` action, sized at the item's new quantity minus whatever's already fulfilled. Three separate defects compound here:

1. **No check for whether the quantity actually changed.** Any `ITEM_UPDATE` action queues its line for delete-then-re-reserve, including a price-only edit that never touched quantity.
2. **`fulfilled_quantity` was never fetched.** It lives on the order item's versioned detail (reachable as `items.detail.fulfilled_quantity`), not on the line item itself, and neither of the two field lists this workflow queries with included it. Reading it off the line item directly always returned `undefined`, and `MathBN.sub(x, undefined)` treats `undefined` as `0` - so the "minus what's fulfilled" part silently never happened, and the full new quantity was reserved every time.
3. **Compensation restored by line item, not by what it deleted.** If the resulting reservation failed (not enough stock), `deleteReservationsByLineItemsStep`'s compensation called `restoreReservationItemsByLineItem`, which un-soft-deletes *every* soft-deleted reservation row for that line - including ones fulfillment consumed long before this workflow ran. Those get re-added to `reserved_quantity` with no ceiling check.

Combined: editing the price of a line that's already fully fulfilled and currently out of stock would throw "Not enough stock available" (since the full quantity is being re-reserved as if none of it were fulfilled), and the failure's compensation would resurrect the line's historical, already-consumed reservations - `reserved_quantity` ends up above `stocked_quantity`, and every retry fails and resurrects the same phantoms again.

Fixes:
- Skip the reservation touch entirely for an `ITEM_UPDATE` whose quantity didn't change (checked against the pre-edit order, which the workflow already fetches).
- Added `items.detail.raw_fulfilled_quantity`/`items.detail.fulfilled_quantity` to the order-edit field list, and read fulfilled quantity from `.detail` where it actually lives.
- `deleteReservationsByLineItemsStep`'s compensation now restores by the exact reservation ids the step deleted (already computed as its primary step output) via `restoreReservationItems`, instead of `restoreReservationItemsByLineItem`.

Also extracted the reservation-diffing logic that used to be an inline `transform()` callback into `computeReservationChangesForOrderEdit` (`order-edit/utils/compute-reservation-changes.ts`), matching how `prepareConfirmInventoryInput` is already a separately-tested utility in this same package - it's plain, I/O-free logic, no reason it needs a workflow run to exercise it.

Testing: added `compute-reservation-changes.spec.ts` covering a price-only edit on a fully-fulfilled line (should touch nothing), a real quantity increase on a partially-fulfilled line (should reserve only the unfulfilled remainder), a newly added line, and a removed line. Confirmed both against the original inline logic: the price-only case tried to reserve the full quantity instead of nothing, and the partial-fulfillment case reserved the full new quantity (5) instead of the remainder (2) - both pass after the fix.

For the compensation fix, added two tests to the inventory module suite contrasting the two restore paths directly: `restoreReservationItemsByLineItem` does resurrect a reservation that was soft-deleted well before an unrelated later delete/restore cycle (confirming the mechanism the bug relies on is real), while `restoreReservationItems` given the precise ids from that cycle does not touch it. Full inventory module suite: 37/37.
