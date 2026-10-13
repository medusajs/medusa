---
"@medusajs/promotion": patch
---

feat(promotion): add opt-in cheapest-eligible-first selection for buy-get promotions

Setting `promotion.metadata.buyget_selection` to `"cheapest_eligible_first"` makes a Buy X Get Y promotion discount the cheapest eligible units across the cart. For "buy 3, get 1 free" with eight units priced 100 to 800, the 100 and 200 units are discounted, instead of 100 and 500 with the default selection.

Promotions without the option keep the default selection.
