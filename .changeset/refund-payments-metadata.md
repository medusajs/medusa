---
"@medusajs/core-flows": patch
"@medusajs/payment": patch
"@medusajs/types": patch
---

fix(core-flows, payment, types): expose `metadata` on refund creation through `refundPaymentsWorkflow`

The `Refund` data model supports a `metadata` field, but it was not exposed on
`CreateRefundDTO`, `RefundPaymentsStepInput`, or `RefundPaymentsWorkflowInput`,
making it impossible to set metadata on a refund created via
`refundPaymentsWorkflow`. This adds the optional field to all three types and
threads it through `PaymentModuleService.refundPayment` so the value reaches
the underlying refund row.
