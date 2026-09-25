---
"@medusajs/order": patch
---

fix(order): don't recreate past-version shipping method adjustments when applying an order change, which crashed receiving a return on an order with a shipping-method adjustment
