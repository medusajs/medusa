---
"@medusajs/order": patch
---

fix: use isDefined check for unit_price in ITEM_UPDATE order change action so that setting an item price to 0 is correctly reflected in previewOrderChange
