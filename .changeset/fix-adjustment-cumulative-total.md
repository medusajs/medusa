---
"@medusajs/utils": patch
---

fix(utils): assign per-adjustment subtotal/total instead of the cumulative running sum

`calculateAdjustmentTotal` wrote the plural running accumulators (`adjustmentsSubtotal`/`adjustmentsTotal`) onto each adjustment's own `subtotal`/`total`, instead of the singular per-adjustment values. Every adjustment after the first was inflated to the cumulative total; the bug was masked for lines with a single adjustment. The aggregate return values were unaffected.
