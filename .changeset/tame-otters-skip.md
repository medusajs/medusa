---
"@medusajs/promotion": patch
"@medusajs/core-flows": patch
---

fix(promotion): skip automatic use_by_attribute promotions when the budget attribute is missing instead of throwing, while still surfacing the error for code-applied ones
