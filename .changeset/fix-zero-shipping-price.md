---
"@medusajs/dashboard": patch
---

fix(dashboard): preserve zero-amount shipping option prices on re-save

Falsy checks treated a price of `0` as unset, dropping free-shipping prices from the API payload on subsequent edits. Replaced `!value` with `value === undefined || value === ""` in the create/edit form handlers, fixed the same issue in `buildShippingOptionPriceRules`, and used `??` instead of `||` in the price cell initialisation.
