---
"@medusajs/core-flows": patch
---

fix(core-flows): evaluate promotion rules on `item_total` and `total` before the cart's current promotion discounts, so a minimum-spend promotion isn't removed by the next cart update
