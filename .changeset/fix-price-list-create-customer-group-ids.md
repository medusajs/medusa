---
"@medusajs/dashboard": patch
---

fix(dashboard): price-list create page no longer crashes — `PricingDetailsSchema` now picks the existing `rules` field from `PricingCreateSchema` instead of the unrecognized `customer_group_ids` key
