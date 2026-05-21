---
"@medusajs/dashboard": patch
---

fix(dashboard): use correct cancel hook for return requests in order activity section

The Cancel button in the order Activity timeline was calling `useCancelReturn` (`POST /admin/returns/:id/cancel`), which requires all linked return fulfillments to be canceled first. For storefront-created returns this fails with a 400 if an active return fulfillment exists. The correct hook for canceling a return that is still in the request stage is `useCancelReturnRequest` (`DELETE /admin/returns/:id/request`), which is already used by the active return panel. Both Admin entry points now call the same cancel path.
