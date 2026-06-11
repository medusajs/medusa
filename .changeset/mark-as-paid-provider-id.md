---
"@medusajs/core-flows": patch
"@medusajs/medusa": patch
"@medusajs/js-sdk": patch
"@medusajs/types": patch
---

feat(medusa,core-flows,js-sdk,types): allow provider_id when marking a payment collection as paid

The `mark-as-paid` admin route and the `markPaymentCollectionAsPaid` workflow now accept an optional `provider_id`. When provided, the captured payment is recorded under that provider instead of always using `pp_system_default`. Omitting it preserves the previous behavior. This completes the admin payment-provider flow started in #15169.
