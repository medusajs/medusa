---
"@medusajs/utils": patch
"@medusajs/dashboard": patch
---

fix(utils, dashboard): add GMD (Gambian Dalasi) to default currency lists

Adds a `GMD` entry to both hardcoded currency maps (`packages/core/utils/src/defaults/currencies.ts` and `packages/admin/dashboard/src/lib/data/currencies.ts`). Without it, admin pages that map over `store.supported_currencies` and look each one up — most notably the Regions create/edit form — crash with `TypeError: Cannot read properties of undefined (reading 'code')` when a store has GMD as a supported currency.
