---
displayed_sidebar: pricingReference
badge:
  variant: orange
  text: Beta
slug: /references/pricing/retrieveMoneyAmount
sidebar_label: retrieveMoneyAmount
---

# retrieveMoneyAmount - Pricing Module Reference

This documentation provides a reference to the retrieveMoneyAmount method. This belongs to the Pricing Module.

This method retrieves a money amount by its ID.

## Parameters

- `id`: The ID of the money amount to retrieve.
- `config`: (optional) An object of type [MoneyAmountDTO](../../interfaces/MoneyAmountDTO.md) used to configure how a money amount is retrieved. Its properties, such as `select` or `relations`, accept the attributes or relations associated with a money amount. It accepts the following properties:
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
- `sharedContext`: (optional) An object of type [Context](../../interfaces/Context.md) used to share resources, such as transaction manager, between the application and the module. It accepts the following properties:
	- `enableNestedTransactions`: (optional) a boolean value indicating whether nested transactions are enabled.
	- `isolationLevel`: (optional) A string indicating the isolation level of the context. Possible values are `READ UNCOMMITTED`, `READ COMMITTED`, `REPEATABLE READ`, or `SERIALIZABLE`.
	- `manager`: (optional) An instance of a manager, typically an entity manager, of type `TManager`, which is a typed parameter passed to the context to specify the type of the `manager`.
	- `transactionId`: (optional) a string indicating the ID of the current transaction.
	- `transactionManager`: (optional) An instance of a transaction manager of type `TManager`, which is a typed parameter passed to the context to specify the type of the `transactionManager`.

## Returns

A promise that resolves to an object of type [MoneyAmountDTO](../../interfaces/MoneyAmountDTO.md) which is the retrieved money amount.

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

To retrieve a money amount by its ID:

```ts
import { 
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrieveMoneyAmount (moneyAmountId: string) {
  const pricingService = await initializePricingModule()

  const moneyAmount = await pricingService.retrieveMoneyAmount(
    moneyAmountId,
  )

  // do something with the money amount or return it
}
```

To retrieve relations along with the money amount:

```ts
import { 
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrieveMoneyAmount (moneyAmountId: string) {
  const pricingService = await initializePricingModule()

  const moneyAmount = await pricingService.retrieveMoneyAmount(
    moneyAmountId,
    {
      relations: ["currency"]
    }
  )

  // do something with the money amount or return it
}
```
