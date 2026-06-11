---
"@medusajs/payment-stripe": patch
---

chore(payment-stripe): Warn at provider initialization when the Stripe `webhookSecret` option is missing, instead of silently accepting the misconfiguration that later breaks webhook signature verification and leaves webhook-dependent payment flows stuck in pending.
