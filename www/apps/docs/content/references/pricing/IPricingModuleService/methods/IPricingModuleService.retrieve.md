---
displayed_sidebar: pricingReference
badge:
  variant: orange
  text: Beta
slug: /references/pricing/retrieve
sidebar_label: retrieve
---

# retrieve - Pricing Module Reference

This documentation provides a reference to the retrieve method. This belongs to the Pricing Module.

This method is used to retrieves a price set by its ID.

## Parameters

- `id`: A string indicating the ID of the price set to retrieve.
- `config`: (optional) An object of type [FindConfig](../../interfaces/FindConfig.md) used to configure how the price set is retrieved. Its properties, such as `select` or `relations`, accept the attributes or relations associated with a price set. It accepts the following properties:
	- `order`: (optional) An object used to specify how to sort the returned records. Its keys are the names of attributes of the entity, and a key's value can either be `ASC` to sort retrieved records in an ascending order, or `DESC` to sort retrieved records in a descending order.
	- `relations`: (optional) An array of strings, each being relation names of the entity to retrieve in the result.
	- `select`: (optional) An array of strings, each being attribute names of the entity to retrieve in the result.
	- `skip`: (optional) A number indicating the number of records to skip before retrieving the results.
	- `take`: (optional) A number indicating the number of records to return in the result.
	- `withDeleted`: (optional) A boolean indicating whether deleted records should also be retrieved as part of the result. This only works if the entity extends the `SoftDeletableEntity` class.
- `sharedContext`: (optional) An object of type [Context](../../interfaces/Context.md) used to share resources, such as transaction manager, between the application and the module. It accepts the following properties:
	- `enableNestedTransactions`: (optional) a boolean value indicating whether nested transactions are enabled.
	- `isolationLevel`: (optional) A string indicating the isolation level of the context. Possible values are `READ UNCOMMITTED`, `READ COMMITTED`, `REPEATABLE READ`, or `SERIALIZABLE`.
	- `manager`: (optional) An instance of a manager, typically an entity manager, of type `TManager`, which is a typed parameter passed to the context to specify the type of the `manager`.
	- `transactionId`: (optional) a string indicating the ID of the current transaction.
	- `transactionManager`: (optional) An instance of a transaction manager of type `TManager`, which is a typed parameter passed to the context to specify the type of the `transactionManager`.

## Returns

A promise that resolves to an object of type [PriceSetDTO](../../interfaces/PriceSetDTO.md) which is the retrieved price set.

<details>
<summary>
PriceSetDTO
</summary>

- `id`: A string indicating the ID of the price set.
- `money_amounts`: (optional) An array of objects of type [MoneyAmountDTO](../../interfaces/MoneyAmountDTO.md), which holds the prices that belong to this price set. Its items accept the following properties:
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
- `rule_types`: (optional) An array of objects of type [RuleTypeDTO](../../interfaces/RuleTypeDTO.md), which holds the rule types applied on this price set. Its items accept the following properties:
	- `default_priority`: A number indicating the priority of the rule type. This is useful when calculating the price of a price set, and multiple rules satisfy the provided context. The higher the value, the higher the priority of the rule type.
	- `id`: A string indicating the ID of the rule type.
	- `name`: A string indicating the display name of the rule type.
	- `rule_attribute`: A string indicating a unique name used to later identify the rule_attribute. For example, it can be used in the `context` parameter of the `calculatePrices` method to specify a rule for calculating the price.

</details>

## Example

A simple example that retrieves a price set by its ID:

```ts
import { 
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrievePriceSet (priceSetId: string) {
  const pricingService = await initializePricingModule()

  const priceSet = await pricingService.retrieve(
    priceSetId
  )

  // do something with the price set or return it
}
```

To specify relations that should be retrieved:

```ts
import { 
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrievePriceSet (priceSetId: string) {
  const pricingService = await initializePricingModule()

  const priceSet = await pricingService.retrieve(
    priceSetId,
    {
      relations: ["money_amounts"]
    }
  )

  // do something with the price set or return it
}
```
