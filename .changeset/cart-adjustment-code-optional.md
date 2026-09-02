---
"@medusajs/types": patch
---

fix(types): make `code` optional and nullable on cart and order adjustment DTOs

The `code` of an adjustment identifies the promotion that created it, and the
underlying data models allow it to be `null` for custom, self-calculated
adjustments. The create input types required it, forcing a type cast, and the
read types typed it as `string | undefined` even though it's returned as `null`.
