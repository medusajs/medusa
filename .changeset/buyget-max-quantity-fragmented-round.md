---
"@medusajs/promotion": patch
---

fix(promotion): stop a fragmented buy-get application round from exceeding max_quantity

`preparePromotionApplicationState` (the buy-get compute-actions helper that decides which items a single application round should discount) caps how much it applies against `max_quantity` using `appliedPromotionQuantity`, a running total of everything applied in *earlier* rounds. That total only advances between rounds - it doesn't move as the current round's own target loop adds items.

That's fine as long as one round's `apply_to_quantity` is satisfied by a single target item. It breaks once a round has to fragment across more than one - `apply_to_quantity: 3` but the first eligible item only has 2 units left, say. The cap computed for the *second* item in that same round still subtracts only the previous rounds' total, not the 2 units the first item in *this* round already committed to. Multiply that across enough rounds and fragmented items, and the total discounted quantity ends up past `max_quantity`.

The allowance now also subtracts `availableTargetQuantity`, the quantity this round has already added before considering the current item, so it tightens correctly as a round fills up rather than only between rounds.

Added a test: `apply_to_quantity: 2` with four target-eligible items of 1 unit each (so every round needs two of them) and `max_quantity: 3`. Two full rounds would apply 4 units, which is over the cap once split like this, so the second round has to be rejected outright rather than partially honored. Ran it against the current code first - it discounted all 4 units across 2 rounds, ignoring the cap - then confirmed it discounts exactly 2 after the fix, and ran the full compute-actions suite for the promotion module (92/92, including the existing single-item-round max_quantity tests, which don't fragment and were passing before and after).
