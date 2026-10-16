---
"@medusajs/payment": patch
---

fix(payment): the refund-and-recreate payment session compensation no longer fails when a payment session has a captured (succeeded) payment, keeping the cart recoverable
