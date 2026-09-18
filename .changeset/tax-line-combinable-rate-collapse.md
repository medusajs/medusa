---
"@medusajs/core-flows": patch
---

fix(core-flows): stop combinable cart tax lines from collapsing into one row

`upsertTaxLinesForItemsStep` matches each newly-calculated tax line against an item's existing tax lines to decide whether to insert or update, but it only matched on `item_id`. An item can have more than one tax line at once - a combinable regional rate plus its parent region's rate is the normal case for this - and once an item has two existing rows, both new lines resolve to the same `id` (whichever existing row `.find()` happens to return first). The upsert then treats them as the same row: the mikro-orm repository's upsert groups incoming rows by their (in this case wrongly shared) id, so both entries get applied to a single in-memory entity and only the last one actually gets persisted. The other tax rate silently disappears from the recalculated cart.

The first calculation is unaffected, since there's nothing existing yet to collide with - both lines get created correctly. The bug only shows up on a *recalculation* (region change, promotion change, anything that re-runs tax calculation on a cart that already has tax lines), which is probably why it's easy to miss in casual testing.

Matching now also compares `tax_rate_id`, so each new line pairs with the specific existing row it actually corresponds to.

Added a unit test for the two normalize functions directly - they're plain functions with no I/O, so no need to go through the step or a database to exercise them. Confirmed the bug with the original (unexported) logic first: two new tax lines for the same item, matched against two existing rows, both resolved to the *first* existing row's id instead of their own. After the fix each resolves to its own row.
