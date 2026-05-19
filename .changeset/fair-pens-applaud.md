---
"@medusajs/core-flows": minor
"@medusajs/utils": patch
---

feat(core-flows): emit failed-refund event while preserving partial-success refunds

`refundPaymentsStep` now resolves to `{ refunded_payments, failed_refunds }` instead of only the refunded payments array.
