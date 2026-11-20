---
"@medusajs/payment": patch
---

fix(payment): mark a payment session as canceled and recompute its payment collection when its payment is canceled, so a retried cart completion can't place an order backed by a canceled payment
