---
"@medusajs/utils": patch
"@medusajs/dashboard": patch
---

Add GMD (Gambian Dalasi) to the bundled currency lists in `@medusajs/utils` and the admin dashboard so admin pages don't crash with `Cannot read properties of undefined (reading 'code')` when GMD is one of the store's supported currencies.
