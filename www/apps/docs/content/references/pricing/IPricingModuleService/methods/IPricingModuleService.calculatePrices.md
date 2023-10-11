---
displayed_sidebar: pricingReference
badge:
  variant: orange
  text: Beta
slug: /references/pricing/calculatePrices
sidebar_label: calculatePrices
---

# calculatePrices - Pricing Module Reference

This documentation provides a reference to the calculatePrices method. This belongs to the Pricing Module.

This method is used to calculate prices based on the provided filters and context.

## Parameters

- `filters`: An object of type [PricingFilters](../../interfaces/PricingFilters.md) used to filter the price sets. It accepts the following properties:
	- `id`: An array of strings, each being an ID of a price set.
- `context`: (optional) An object of type [PricingContext](../../interfaces/PricingContext.md) to select prices. For example, the pricing context can specify the currency code to calculate prices in. It accepts the following properties:
	- `context`: (optional) an object whose keys are the name of the context attribute. Its value can be a string or a number. For example, you can pass the `currency_code` property with its value being the currency code to calculate the price in. Another example is passing the `quantity` property to calculate the price for that specified quantity, which finds a price set whose `min_quantity` and `max_quantity` conditions match the specified quantity.
- `sharedContext`: (optional) An object of type [Context](../../interfaces/Context.md) used to share resources, such as transaction manager, between the application and the module. It accepts the following properties:
	- `enableNestedTransactions`: (optional) a boolean value indicating whether nested transactions are enabled.
	- `isolationLevel`: (optional) A string indicating the isolation level of the context. Possible values are `READ UNCOMMITTED`, `READ COMMITTED`, `REPEATABLE READ`, or `SERIALIZABLE`.
	- `manager`: (optional) An instance of a manager, typically an entity manager, of type `TManager`, which is a typed parameter passed to the context to specify the type of the `manager`.
	- `transactionId`: (optional) a string indicating the ID of the current transaction.
	- `transactionManager`: (optional) An instance of a transaction manager of type `TManager`, which is a typed parameter passed to the context to specify the type of the `transactionManager`.

## Returns

A promise that resolves to an object of type [CalculatedPriceSetDTO](../../interfaces/CalculatedPriceSetDTO.md) which includes the calculated prices.

<details>
<summary>
CalculatedPriceSetDTO
</summary>

- `amount`: a number indicating the calculated amount. It can possibly be `null` if there's no price set up for the provided context.
- `currency_code`: a string indicating the currency code of the calculated price. It can possibly be `null`.
- `id`: a string indicating the ID of the price set.
- `max_quantity`: a number indicaitng the maximum quantity required to be purchased for this price to apply. It's set if the `quantity` property is provided in the context. Otherwise, its value will be `null`.
- `min_quantity`: a number indicaitng the minimum quantity required to be purchased for this price to apply. It's set if the `quantity` property is provided in the context. Otherwise, its value will be `null`.

</details>

## Example

```ts
import { 
  initialize as initializePricingModule,
} from "@medusajs/pricing"
async function calculatePrice (priceSetId: string, currencyCode: string) {
  const pricingService = await initializePricingModule()

  const price = await pricingService.calculatePrices(
    { id: [priceSetId] },
    {
      context: {
        currency_code: currencyCode
      }
    }
  )

  // do something with the price or return it
}
```
