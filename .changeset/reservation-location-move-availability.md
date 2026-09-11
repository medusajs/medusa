---
"@medusajs/inventory": patch
---

fix(inventory): validate and account for the destination location when moving a reservation

`updateReservationItems` builds an `availabilityData` entry per reservation to both validate stock and figure out which `inventory_level` rows to adjust afterwards. That entry only ever compared the requested quantity against the *previous* quantity at the *same* location - it never distinguished a location change from a quantity change.

Two separate problems came out of that:

1. Moving a reservation to a different location without also changing its quantity computed the checked amount as `0` (no quantity delta), so `ensureInventoryLevels`'s `validateQuantityAtLocation` check - "does the destination have room for this?" - was checking whether the destination has room for `0` extra units. It always does. A reservation could be moved onto a location that's already fully booked.
2. Even fixing the validation, the old location's `reserved_quantity` never got decremented on a move. `ensureInventoryLevels` only returns level rows for the locations that were actually passed to it, and the update afterwards is built by mapping over exactly those returned rows - so the adjustment map's `-quantity` entry for the old location had nowhere to attach and was silently dropped. The reservation itself moved, but both locations kept the old reserved_quantity as if nothing had changed.

Moving a reservation now checks the full (possibly updated) quantity against the destination, and separately includes the source location in what gets fetched (at a 0-quantity, always-passing check) purely so its level row is present in the result set the adjustments get applied to.

Added two tests: moving a reservation onto a location without enough availability now throws, and leaves both locations' reserved_quantity untouched (the move is rejected outright, not partially applied); moving it onto a location with enough room succeeds and correctly zeroes the old location while crediting the new one. Ran both against the current code first - the first test got `undefined` instead of an error, the second got `reserved_quantity: 3` at the old location instead of `0` - then confirmed both pass after the fix, along with the rest of the inventory module suite (37/37).
