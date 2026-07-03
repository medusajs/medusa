---
"@medusajs/core-flows": patch
---

fix(core-flows): only complete a cart from a payment webhook on definitive payment actions (AUTHORIZED/SUCCESSFUL), so intermediate events (e.g. Stripe `payment_intent.created`/`processing`) no longer trigger premature cart completion
