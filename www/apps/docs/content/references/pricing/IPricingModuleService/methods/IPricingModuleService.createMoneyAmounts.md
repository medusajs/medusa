---
displayed_sidebar: pricingReference
badge:
  variant: orange
  text: Beta
slug: /references/pricing/createMoneyAmounts
sidebar_label: createMoneyAmounts
---

# createMoneyAmounts - Pricing Module Reference

This documentation provides a reference to the createMoneyAmounts method. This belongs to the Pricing Module.

This method creates money amounts.

## Parameters

- `data`: An array of objects of type [CreateMoneyAmountDTO](../../interfaces/CreateMoneyAmountDTO.md) that holds the necessary data to create the money amount. Its items accept the following properties:
	- `amount`: (optional) A number indicating the amount of this money amount.
	- `currency`: (optional) An object of type [CurrencyDTO](../../interfaces/CurrencyDTO.md) that holds the details of the money amount's currency. Since this is a relation, it will only be retrieved if it's passed to the `relations` array of the find-configuration options. It accepts the following properties:
		- `code`: a string indicating the code of the currency.
		- `name`: (optional) a string indicating the name of the currency.
		- `symbol`: (optional) a string indicating the symbol of the currency.
		- `symbol_native`: (optional) a string indicating the symbol of the currecy in its native form. This is typically the symbol used when displaying a price.
	- `currency_code`: A string that indicates the currency code of this money amount.
	- `id`: (optional) A string that indicates the ID of the money amount.
	- `max_quantity`: (optional) A number that indicates the maximum quantity required to be purchased for this money amount to be applied.
	- `min_quantity`: (optional) A number that indicates the minimum quantity required to be purchased for this money amount to be applied.
- `sharedContext`: (optional) An object of type [Context](../../interfaces/Context.md) used to share resources, such as transaction manager, between the application and the module. It accepts the following properties:
	- `enableNestedTransactions`: (optional) a boolean value indicating whether nested transactions are enabled.
	- `isolationLevel`: (optional) A string indicating the isolation level of the context. Possible values are `READ UNCOMMITTED`, `READ COMMITTED`, `REPEATABLE READ`, or `SERIALIZABLE`.
	- `manager`: (optional) An instance of a manager, typically an entity manager, of type `TManager`, which is a typed parameter passed to the context to specify the type of the `manager`.
	- `transactionId`: (optional) a string indicating the ID of the current transaction.
	- `transactionManager`: (optional) An instance of a transaction manager of type `TManager`, which is a typed parameter passed to the context to specify the type of the `transactionManager`.

## Returns

A promise that resolves to an array of objects of type [MoneyAmountDTO](../../interfaces/MoneyAmountDTO.md), each being a created money amount.

<details>
<summary>
MoneyAmountDTO
</summary>

- `amount`: (optional) A number indicating the amount of this price.
- `currency`: (optional) An object of type [CurrencyDTO](../../interfaces/CurrencyDTO.md) that holds the details of the price's currency. Since this is a relation, it will only be retrieved if it's passed to the `relations` array of the find-configuration options. It accepts the following properties:
	- `code`: a string indicating the code of the currency.
	- `name`: (optional) a string indicating the name of the currency.
	- `symbol`: (optional) a string indicating the symbol of the currency.
	- `symbol_native`: (optional) a string indicating the symbol of the currecy in its native form. This is typically the symbol used when displaying a price.
- `currency_code`: (optional) A string that indicates the currency code of this price.
- `id`: A string that indicates the ID of the money amount. A money amount represents a price.
- `max_quantity`: (optional) A number that indicates the maximum quantity required to be purchased for this price to be applied.
- `min_quantity`: (optional) A number that indicates the minimum quantity required to be purchased for this price to be applied.

</details>

## Example

```ts
import { 
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrieveMoneyAmounts () {
  const pricingService = await initializePricingModule()

  const moneyAmounts = await pricingService.createMoneyAmounts([
    {
      amount: 500,
      currency_code: "USD",
    },
    {
      amount: 400,
      currency_code: "USD",
      min_quantity: 0,
      max_quantity: 4
    }
  ])

  // do something with the money amounts or return them
}
```
