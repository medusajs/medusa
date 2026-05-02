---
"@medusajs/utils": patch
"@medusajs/dashboard": patch
---

fix: add GMD (Gambian Dalasi) to default currency lists

GMD is a valid ISO 4217 code (Gambian Dalasi) but was missing from the
hardcoded currency maps. This caused the admin regions create page to
crash when GMD was present in a store's supported_currencies.
