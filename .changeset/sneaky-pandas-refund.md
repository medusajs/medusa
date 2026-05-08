---
"@medusajs/core-flows": patch
---

fix(core-flows): apply currency-precision tolerance to `validatePaymentsRefundStep`

Mirrors #15303 on the plural `refundPaymentsWorkflow`'s validator. The validator
now sums `raw_amount` instead of `amount` and compares with a per-currency
epsilon (`getEpsilonFromDecimalPrecision`), so sub-cent provider captures (e.g.
Stripe charging in a foreign currency at `87.957975`) no longer cause a refund
of the user-visible rounded amount (`87.96`) to be falsely rejected. Also adds
`captures.raw_amount` and `refunds.raw_amount` to the payments query so the raw
values reach the validator.
