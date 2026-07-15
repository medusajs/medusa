---
"@medusajs/utils": patch
---

fix(utils): do not double-count tax on discounts in refundable_total for non-tax-inclusive items

`refundable_total` / `refundable_total_per_unit` were understated for a non-tax-inclusive line item that carries a discount (adjustment) and has a pending or partially received return. `setRefundableTotal` subtracted the tax-inclusive discount (`adjustmentsTotal`) and then applied tax to the remaining amount, which taxed the discount a second time.

The discount basis now follows the item's tax inclusivity: tax-inclusive items keep using the tax-inclusive discount (the unit price already includes tax, and no tax is added back), while non-tax-inclusive items subtract the pre-tax discount before tax is applied once. For example, a non-tax-inclusive item at `unit_price 100`, `quantity 2`, `10%` tax, a `20` discount, with `1` unit requested for return now reports `refundable_total` `99` instead of `97.9`.
