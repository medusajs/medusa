---
"@medusajs/payment-stripe": patch
---

fix(payment-stripe): don't fail deleting a payment session whose PaymentIntent already succeeded, so the refund-and-recreate payment session compensation keeps the cart recoverable
