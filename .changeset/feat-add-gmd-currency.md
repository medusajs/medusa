---
"@medusajs/utils": patch
"@medusajs/dashboard": patch
"@medusajs/loyalty-plugin": patch
---

feat(utils, dashboard, loyalty-plugin): add GMD (Gambian Dalasi) to default currency lists

Adds a `GMD` entry to the hardcoded currency maps in `packages/core/utils/src/defaults/currencies.ts`, `packages/admin/dashboard/src/lib/data/currencies.ts`, and `packages/plugins/loyalty/src/admin/lib/currencies.ts`. Without it, admin pages that map over `store.supported_currencies` and look each one up — most notably the Regions create/edit form — crash with `TypeError: Cannot read properties of undefined (reading 'code')` when a store has GMD as a supported currency.
