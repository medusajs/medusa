---
"@medusajs/core-flows": patch
---

fix(core-flows): return 404 when deleting a line item that isn't in the cart

`deleteLineItemsWorkflow` soft-deleted whatever line item ids it was given, even if they belonged to a different cart. A new validation step checks the ids against the cart before the delete, so the store API returns 404 like the update route already does.
