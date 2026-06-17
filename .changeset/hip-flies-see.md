---
"@medusajs/promotion": patch
"@medusajs/utils": patch
---

fix(promotion): prevent negative taxable base when stacking tax-inclusive and non-tax-inclusive promotions

The applied-promotions accumulator stored adjustment amounts in each promotion's own tax base, so a tax-inclusive promotion compared its remaining applicable amount (incl-tax) against amounts a previous non-tax-inclusive promotion recorded excl-tax. The mismatched bases let the combined discount exceed the line item value and drive the taxable base negative. Applied amounts are now tracked tax-exclusively and converted to the promotion's base before being subtracted, for both `each` and `across` allocations.
