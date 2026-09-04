---
"@medusajs/promotion": patch
---

fix(promotion): apply buy-get promotions independently of line item order

A `buyget` promotion whose target product is also listed in its own `buy_rules` was applied or not depending purely on the order of line items in the cart, and when it was not applied nothing surfaced — no error, no adjustment, the cart silently stayed at full price.

Two things caused it. `sortByPrice` in `buy-get.ts` never returned `0`, so for equally priced items it claimed a strict ordering that does not exist and left the result up to the sort implementation. The buy-side selection then greedily reserved the first `buy_rules_min_quantity` eligible items and subtracted them from the target's available quantity, so whenever the target item was the one reserved, the promotion was dropped even though a valid assignment existed.

The comparators now return `0` for equal prices (also in `sort-by-price.ts`, where `sortLineItemByPriceAscending` and `sortShippingLineByPriceAscending` had the same problem), and the buy side now prefers items that cannot serve as targets before falling back to target-eligible ones. Buy X get X on a single product is unaffected.
