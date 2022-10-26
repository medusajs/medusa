## Adding Line Items

- Only the sales channel inventory is checked; no check in the actual locations

## Reserving items with location id

- The inventory parts for a product variant must all be stocked at the location
- There is not check to verify this

## Reserving items with sales channel id

- The inventory will be reserved at random from one of the locations associated with the sales channel
- Later when we add shipping definitions that take locations into account this will be more sophisticated

## Integration Tests

- With the modular approach introduced here we have an issue when it comes to integration test. Namely, we currently seed the database with test data by using a typeorm connection that uses the default connection loader. Since each module now handles its own connection that would require us to have a connection for each imported module.

## Adjusting inventory

- In the first iteration adjusting inventory couples product variants and inventory parts closely. See adjustInventory in services/product-variant-inventory.ts.
- A future iteration should allow inputs that give granular control over the individual inventory parts when adjusting inventory.
  - This is useful for example when a return is received but the product variant received has one part that is faulty; in this case the inventory for the good parts should be restocked but not the faulty one.

## Moving steps out of services

- When creating claims, swaps, order edits, etc. we should confirm inventory in the controller instead of within the swap/claimService.
- The claims/swaps/etc should be allowed to be created without the necessary inventory and then be cleaned up with a manual action if an order comes in that cannot be fulfilled.

## Nested queries

- When creating a query that has to filter based on a nested relationship e.g. find InventoryItems that have InventoryLevels at location X, you end up with a difficult query.
