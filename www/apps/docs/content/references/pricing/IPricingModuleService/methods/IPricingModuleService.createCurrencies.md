---
displayed_sidebar: pricingReference
badge:
  variant: orange
  text: Beta
slug: /references/pricing/createCurrencies
sidebar_label: createCurrencies
---

# createCurrencies - Pricing Module Reference

This documentation provides a reference to the createCurrencies method. This belongs to the Pricing Module.

This method is used to create new currencies.

## Parameters

- `data`: An array of objects of type [CreateCurrencyDTO](../../interfaces/CreateCurrencyDTO.md), each object holding the data of a currency to create. Its items accept the following properties:
	- `code`: a string indicating the code of the currency.
	- `name`: a string indicating the name of the currency.
	- `symbol`: a string indicating the symbol of the currency.
	- `symbol_native`: a string indicating the symbol of the currecy in its native form. This is typically the symbol used when displaying a price.
- `sharedContext`: (optional) An object of type [Context](../../interfaces/Context.md) used to share resources, such as transaction manager, between the application and the module. It accepts the following properties:
	- `enableNestedTransactions`: (optional) a boolean value indicating whether nested transactions are enabled.
	- `isolationLevel`: (optional) A string indicating the isolation level of the context. Possible values are `READ UNCOMMITTED`, `READ COMMITTED`, `REPEATABLE READ`, or `SERIALIZABLE`.
	- `manager`: (optional) An instance of a manager, typically an entity manager, of type `TManager`, which is a typed parameter passed to the context to specify the type of the `manager`.
	- `transactionId`: (optional) a string indicating the ID of the current transaction.
	- `transactionManager`: (optional) An instance of a transaction manager of type `TManager`, which is a typed parameter passed to the context to specify the type of the `transactionManager`.

## Returns

A promise that resolves to an array of objects of type [CurrencyDTO](../../interfaces/CurrencyDTO.md), each object being a created currency.

<details>
<summary>
CurrencyDTO
</summary>

- `code`: a string indicating the code of the currency.
- `name`: (optional) a string indicating the name of the currency.
- `symbol`: (optional) a string indicating the symbol of the currency.
- `symbol_native`: (optional) a string indicating the symbol of the currecy in its native form. This is typically the symbol used when displaying a price.

</details>

## Example

```ts
import { 
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function createCurrencies () {
  const pricingService = await initializePricingModule()

  const currencies = await pricingService.createCurrencies([
    {
      code: "USD",
      symbol: "$",
      symbol_native: "$",
      name: "US Dollar",
    }
  ])

  // do something with the currencies or return them
}
```
