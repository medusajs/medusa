---
"@medusajs/promotion": patch
---

fix(promotion): rank buy-get items by unit price instead of line subtotal

Buy X Get Y promotions ranked eligible line items by their subtotal to decide which units are bought and which are discounted. A line holding several cheap units can have a higher subtotal than a line holding one expensive unit, so the cheap units were reserved for the buy side and the expensive unit was discounted. For example, a "buy 3, get 1 free" cart with one unit at 379 and three units at 199 discounted the 379 unit instead of a 199 unit.

Items are now ranked by unit price (`subtotal / quantity`). Equally priced items keep the stable ordering introduced in #16397.
