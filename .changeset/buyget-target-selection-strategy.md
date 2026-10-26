---
"@medusajs/promotion": patch
"@medusajs/utils": patch
"@medusajs/types": patch
"@medusajs/medusa": patch
"@medusajs/dashboard": patch
---

feat(promotion,utils,types,medusa,dashboard): add target selection strategy for buy-get promotions

Adds `application_method.target_selection_strategy` to choose which eligible items a Buy X Get Y promotion discounts. The default, `most_expensive_first`, keeps the current behaviour. `cheapest_first` discounts the cheapest eligible units across the cart: for "buy 3, get 1 free" with eight units priced 100 to 800, the 100 and 200 units are discounted instead of 100 and 500. The option is available in the admin promotion create and edit forms.
