---
"@medusajs/promotion": patch
"@medusajs/medusa": patch
"@medusajs/types": patch
"@medusajs/dashboard": patch
---

feat(promotion, medusa, dashboard): support maximum discount amounts and fixed shipping discounts

Adds a `max_amount` field to promotion application methods so percentage
promotions can be capped at a fixed amount, e.g. 10% off up to a maximum
of 50. The cap applies across the promotion's item and shipping
adjustments and requires a currency code. The dashboard promotion create
flow exposes a "Maximum Discount Amount" input for percentage promotions
and a new "Amount off shipping" template for fixed-amount shipping
discounts.
