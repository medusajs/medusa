---
"@medusajs/core-flows": patch
---

fix(core-flows): stop processPaymentWorkflow from picking an unrelated cart when the webhook session is unknown

When a webhook carried a session id that doesn't exist in this instance, the cart lookup ran with an undefined filter, matched every row and went on to lock and complete whichever cart came back first. This is easy to hit when staging and local setups share one Stripe account. The workflow now only looks up the cart and order once the payment session is found, and skips the authorize branches otherwise.
