---
"@medusajs/core-flows": patch
---

fix(core-flows): stop a cart's tax lines multiplying when a workflow compensates

`upsertTaxLinesForItemsStep`'s compensation re-created the tax lines it had captured before running, through `upsertLineItemTaxLines` and without their `id`. The Cart Module treats an entry with no `id` as an insert, so the compensation added a second copy of every pre-step tax line, and it never removed the rows the forward step had inserted. Every workflow that failed after that step therefore multiplied the cart's tax lines — reached from `refreshCartItemsWorkflow`, so from any line item add, removal or quantity change.

Nothing surfaces when it happens. The cart's own total is right, and the copies are only visible once `completeCartWorkflow` carries them onto the order, where `tax_total` is then a multiple of the real tax and no longer matches what the payment provider was asked to charge. It stays invisible in a single-rate jurisdiction, where the duplicate rows are the zero-rate calculations that ran before the address was complete.

The compensation now deletes whatever is currently attached to the affected line items and shipping methods and recreates the captured snapshot, which mirrors what `setOrderTaxLinesForItemsStep` already does for orders.
