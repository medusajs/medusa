---
"@medusajs/core-flows": patch
---

fix(core-flows): validate the order before refunding a payment in `refundPaymentWorkflow`, so a refund that can't get its credit line (canceled order or active order change) is rejected before the payment provider moves funds. The workflow now also holds a per-order lock until the credit line is created, and `createOrderChangeStep` waits on that lock, so an order change can't be created while the provider refund is in flight
