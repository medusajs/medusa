---
"@medusajs/payment": patch
"@medusajs/core-flows": patch
---

fix(payment): return correct result shape from updatePaymentCollections selector overload

The `updatePaymentCollections` method checked `Array.isArray(data)` to decide
between returning a single DTO or an array. Since `data` is always the update
payload object (never an array), the selector overload incorrectly returned a
single `PaymentCollectionDTO` instead of the declared `PaymentCollectionDTO[]`.

Changed the guard to `isString(idOrSelector)` so the ID overload returns a single
DTO and the selector overload returns an array, matching the declared type
signatures.

Also normalized the `createOrUpdateOrderPaymentCollectionWorkflow` result to
return `[]` instead of `undefined` when neither the create nor update branch
executes, matching the declared `PaymentCollectionDTO[]` return type.
