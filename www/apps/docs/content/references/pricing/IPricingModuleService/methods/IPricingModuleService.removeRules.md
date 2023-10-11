---
displayed_sidebar: pricingReference
badge:
  variant: orange
  text: Beta
slug: /references/pricing/removeRules
sidebar_label: removeRules
---

# removeRules - Pricing Module Reference

This documentation provides a reference to the removeRules method. This belongs to the Pricing Module.

This method remove rules from a price set.

## Parameters

- `data`: An array of objects of type [RemovePriceSetRulesDTO](../../interfaces/RemovePriceSetRulesDTO.md), each specfiying which rules to remove. Its items accept the following properties:
	- `id`: A string indicating the ID of the price set.
	- `rules`: An array of strings, each string is the `rule_attribute` of a rule you want to remove.
- `sharedContext`: (optional) An object of type [Context](../../interfaces/Context.md) used to share resources, such as transaction manager, between the application and the module. It accepts the following properties:
	- `enableNestedTransactions`: (optional) a boolean value indicating whether nested transactions are enabled.
	- `isolationLevel`: (optional) A string indicating the isolation level of the context. Possible values are `READ UNCOMMITTED`, `READ COMMITTED`, `REPEATABLE READ`, or `SERIALIZABLE`.
	- `manager`: (optional) An instance of a manager, typically an entity manager, of type `TManager`, which is a typed parameter passed to the context to specify the type of the `manager`.
	- `transactionId`: (optional) a string indicating the ID of the current transaction.
	- `transactionManager`: (optional) An instance of a transaction manager of type `TManager`, which is a typed parameter passed to the context to specify the type of the `transactionManager`.

## Returns

A promise that resolves when rules are successfully removed.

## Example

```ts
import { 
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function removePriceSetRule (priceSetId: string, ruleAttributes: []) {
  const pricingService = await initializePricingModule()

  await pricingService.removeRules([
    {
      id: priceSetId,
      rules: ruleAttributes
    },
  ])
}
```
