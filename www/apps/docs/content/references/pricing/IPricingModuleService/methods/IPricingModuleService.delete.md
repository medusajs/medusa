---
displayed_sidebar: pricingReference
badge:
  variant: orange
  text: Beta
slug: /references/pricing/delete
sidebar_label: delete
---

# delete - Pricing Module Reference

This documentation provides a reference to the delete method. This belongs to the Pricing Module.

This method deletes price sets by their IDs.

## Parameters

- `ids`: An array of strings, each being the ID for a price set to delete.
- `sharedContext`: (optional) An object of type [Context](../../interfaces/Context.md) used to share resources, such as transaction manager, between the application and the module. It accepts the following properties:
	- `enableNestedTransactions`: (optional) a boolean value indicating whether nested transactions are enabled.
	- `isolationLevel`: (optional) A string indicating the isolation level of the context. Possible values are `READ UNCOMMITTED`, `READ COMMITTED`, `REPEATABLE READ`, or `SERIALIZABLE`.
	- `manager`: (optional) An instance of a manager, typically an entity manager, of type `TManager`, which is a typed parameter passed to the context to specify the type of the `manager`.
	- `transactionId`: (optional) a string indicating the ID of the current transaction.
	- `transactionManager`: (optional) An instance of a transaction manager of type `TManager`, which is a typed parameter passed to the context to specify the type of the `transactionManager`.

## Returns

A promise that resolves when the price sets are successfully deleted.

## Example

```ts
import { 
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function removePriceSetRule (priceSetIds: string[]) {
  const pricingService = await initializePricingModule()

  await pricingService.delete(priceSetIds)
}
```
