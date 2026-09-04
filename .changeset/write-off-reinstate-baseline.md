---
"@medusajs/order": patch
---

fix(order): validate WRITE_OFF_ITEM and REINSTATE_ITEM against remaining quantity, not the original order quantity

Both actions' `validate()` compared the requested quantity against `existing.quantity` - the item's original ordered quantity - regardless of how much had already been written off (or, for reinstating, how much was actually available to reinstate).

For write-offs this means each one is checked in isolation: an item ordered at quantity 5 can be written off 5 units by one claim and then written off again by a second, unrelated claim, since 1 is still "less than 5" even though nothing is left on the line. `operation()` itself never had this problem - it correctly accumulates `written_off_quantity` - but nothing stopped it from accumulating past what was ordered.

For reinstates it's the mirror image and arguably worse: the check should be "not more than what was written off," but it checked "not more than what was ordered." An item that only ever had 2 units written off can have a reinstate request for the full ordered quantity go through, driving `written_off_quantity` negative.

Both now check against the right baseline: write-off checks the requested quantity against `quantity - written_off_quantity` (what's actually left to claim), reinstate checks it against `written_off_quantity` (what's actually available to give back).

Added a test exercising both actions through `calculateOrderChange` directly (no DB needed - these are pure per-action validate/operation functions registered on `OrderChangeProcessing`), chaining the returned order between calls the way separately-confirmed order changes would each see the item's accumulated state. Confirmed the test fails on the current code (both over-write-off and over-reinstate go through silently) and passes after the fix.
