---
"@medusajs/core-flows": patch
---

Fix `delivery_address` being null on return fulfillment when using `createAndCompleteReturnOrderWorkflow`. The order query was missing `shipping_address.*` in its fields, so `order.shipping_address` was undefined when passed as `delivery_address` to the fulfillment creation step.
