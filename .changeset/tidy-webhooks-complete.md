---
"@medusajs/medusa": patch
---

fix(medusa): skip payment webhook events with an intermediate `pending` action (e.g. Stripe `payment_intent.created`/`processing`) in the payment webhook subscriber, so they no longer trigger premature cart completion
