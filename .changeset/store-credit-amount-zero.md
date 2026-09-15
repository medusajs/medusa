---
"@medusajs/loyalty-plugin": patch
"integration-tests-http": patch
---

fix(loyalty): handle amount=0 in addStoreCreditsToCartWorkflow

Use isDefined to distinguish amount=0 from an undefined amount.

Add an integration test to verify that applying 0 store credit does not
consume the customer's existing balance.
