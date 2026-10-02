---
"@medusajs/medusa": patch
---

fix(medusa): reject fractional quantities in the store cart validators

A fractional quantity such as `0.1` passed API validation and was then silently
truncated by the `INTEGER` database column, leaving the cart with a line item at
quantity `0` that could never be completed. `1.5` was rounded up, so the shopper
was charged for two. The three quantity validators in
`packages/medusa/src/api/store/carts/validators.ts` now require an integer.
