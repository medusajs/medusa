---
"@medusajs/core-flows": patch
"@medusajs/types": patch
---

fix(core-flows): respect item-level allow_backorder when confirming inventory

When adding an item, the `allow_backorder` flag passed on the item is now honored during inventory confirmation, overriding the variant's own `allow_backorder` setting for that item only. Previously the flag was accepted by the API but ignored, making it impossible to add an out-of-stock variant to a draft order even with `allow_backorder: true`.
