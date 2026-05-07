---
"@medusajs/cart": patch
---

fix(cart): bump cart `updated_at` when child entities are modified

Adding line items, updating line item quantity, or adding shipping methods now
refreshes the parent cart's `updated_at` timestamp. Previously these mutations
only touched child entities, so MikroORM's `onUpdate` hook on the cart never
fired and abandoned-cart workflows that key off `updated_at` could not detect
recent activity.
