---
"@medusajs/fulfillment": patch
---

fix(fulfillment): respect subclass overrides of the cancellation guard

Call `canCancelFulfillmentOrThrow` through the service's runtime constructor so custom fulfillment modules can override the cancellation rules. The default shipped and delivered restrictions are unchanged.
