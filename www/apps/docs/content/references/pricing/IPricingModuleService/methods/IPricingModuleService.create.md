---
displayed_sidebar: pricingReference
badge:
  variant: orange
  text: Beta
slug: /references/pricing/create
sidebar_label: create
---

# create - Pricing Module Reference

This documentation provides a reference to the create method. This belongs to the Pricing Module.

## create(data, sharedContext?): Promise<PriceSetDTO\>

This method is used to create a new price set.

### Parameters

- `data`: An object of type [CreatePriceSetDTO](../../interfaces/CreatePriceSetDTO.md) that holds the attribute of the price set to create. It accepts the following properties:
	- `prices`: (optional) An array of objects of type [CreatePricesDTO](../../interfaces/CreatePricesDTO.md), each being a price to associate with the price set. Its items accept the following properties:
		- `amount`: (optional) A number indicating the amount of this money amount.
		- `currency`: (optional) An object of type [CurrencyDTO](../../interfaces/CurrencyDTO.md) that holds the details of the money amount's currency. Since this is a relation, it will only be retrieved if it's passed to the `relations` array of the find-configuration options.
		- `currency_code`: A string that indicates the currency code of this money amount.
		- `id`: (optional) A string that indicates the ID of the money amount.
		- `max_quantity`: (optional) A number that indicates the maximum quantity required to be purchased for this money amount to be applied.
		- `min_quantity`: (optional) A number that indicates the minimum quantity required to be purchased for this money amount to be applied.
		- `rules`: An object whose keys are rule types' `rule_attribute` attribute, and values are the value of that rule associated with this price.
	- `rules`: (optional) An array of objects, each object accepts a property `rule_attribute`, whose value is a string indicating the `rule_attribute` value of a rule type. This property is used to specify the rule types associated with the price set.
- `sharedContext`: (optional) An object of type [Context](../../interfaces/Context.md) used to share resources, such as transaction manager, between the application and the module. It accepts the following properties:
	- `enableNestedTransactions`: (optional) a boolean value indicating whether nested transactions are enabled.
	- `isolationLevel`: (optional) A string indicating the isolation level of the context. Possible values are `READ UNCOMMITTED`, `READ COMMITTED`, `REPEATABLE READ`, or `SERIALIZABLE`.
	- `manager`: (optional) An instance of a manager, typically an entity manager, of type `TManager`, which is a typed parameter passed to the context to specify the type of the `manager`.
	- `transactionId`: (optional) a string indicating the ID of the current transaction.
	- `transactionManager`: (optional) An instance of a transaction manager of type `TManager`, which is a typed parameter passed to the context to specify the type of the `transactionManager`.

### Returns

A promise that resolves to an object of type [PriceSetDTO](../../interfaces/PriceSetDTO.md), which is the created price set.

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

### Example

To create a default price set, don't pass any rules. For example:

```ts
import { 
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function createPriceSet () {
  const pricingService = await initializePricingModule()

  const priceSet = await pricingService.create(
    {
      rules: [],
      prices: [
        {
          amount: 500,
          currency_code: "USD",
          min_quantity: 0,
          max_quantity: 4,
          rules: {},
        },
        {
          amount: 400,
          currency_code: "USD",
          min_quantity: 5,
          max_quantity: 10,
          rules: {},
        },
      ],
    },
  )

  // do something with the price set or return it
}
```

To create a price set and associate it with rule types:

```ts
import { 
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function createPriceSet () {
  const pricingService = await initializePricingModule()

  const priceSet = await pricingService.create(
    {
      rules: [{ rule_attribute: "region_id" }, { rule_attribute: "city" }],
      prices: [
        {
          amount: 300,
          currency_code: "EUR",
          rules: {
            region_id: "PL",
            city: "krakow"
          },
        },
        {
          amount: 400,
          currency_code: "EUR",
          rules: {
            region_id: "PL"
          },
        },
        {
          amount: 450,
          currency_code: "EUR",
          rules: {
            city: "krakow"
          },
        }
      ],
    },
  )

  // do something with the price set or return it
}
```

## create(data, sharedContext?): Promise<PriceSetDTO[]\>

This method is used to create multiple price sets.

### Parameters

- `data`: An array of objects of type [CreatePriceSetDTO](../../interfaces/CreatePriceSetDTO.md), where each object holds the attribute of a price set to create. Its items accept the following properties:
	- `prices`: (optional) An array of objects of type [CreatePricesDTO](../../interfaces/CreatePricesDTO.md), each being a price to associate with the price set. Its items accept the following properties:
		- `amount`: (optional) A number indicating the amount of this money amount.
		- `currency`: (optional) An object of type [CurrencyDTO](../../interfaces/CurrencyDTO.md) that holds the details of the money amount's currency. Since this is a relation, it will only be retrieved if it's passed to the `relations` array of the find-configuration options.
		- `currency_code`: A string that indicates the currency code of this money amount.
		- `id`: (optional) A string that indicates the ID of the money amount.
		- `max_quantity`: (optional) A number that indicates the maximum quantity required to be purchased for this money amount to be applied.
		- `min_quantity`: (optional) A number that indicates the minimum quantity required to be purchased for this money amount to be applied.
		- `rules`: An object whose keys are rule types' `rule_attribute` attribute, and values are the value of that rule associated with this price.
	- `rules`: (optional) An array of objects, each object accepts a property `rule_attribute`, whose value is a string indicating the `rule_attribute` value of a rule type. This property is used to specify the rule types associated with the price set.
- `sharedContext`: (optional) An object of type [Context](../../interfaces/Context.md) used to share resources, such as transaction manager, between the application and the module. It accepts the following properties:
	- `enableNestedTransactions`: (optional) a boolean value indicating whether nested transactions are enabled.
	- `isolationLevel`: (optional) A string indicating the isolation level of the context. Possible values are `READ UNCOMMITTED`, `READ COMMITTED`, `REPEATABLE READ`, or `SERIALIZABLE`.
	- `manager`: (optional) An instance of a manager, typically an entity manager, of type `TManager`, which is a typed parameter passed to the context to specify the type of the `manager`.
	- `transactionId`: (optional) a string indicating the ID of the current transaction.
	- `transactionManager`: (optional) An instance of a transaction manager of type `TManager`, which is a typed parameter passed to the context to specify the type of the `transactionManager`.

### Returns

A promise that resolves to an array of objects of type [PriceSetDTO](../../interfaces/PriceSetDTO.md), which are the created price sets.

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

### Example

To create price sets with a default price, don't pass any rules and make sure to pass the `currency_code` of the price. For example:

```ts
import { 
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function createPriceSets () {
  const pricingService = await initializePricingModule()

  const priceSets = await pricingService.create([
    {
      rules: [],
      prices: [
        {
          amount: 500,
          currency_code: "USD",
          rules: {},
        },
      ],
    },
  ])

  // do something with the price sets or return them
}
```

To create price sets and associate them with rule types:

```ts
import { 
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function createPriceSets () {
  const pricingService = await initializePricingModule()

  const priceSets = await pricingService.create([
    {
      rules: [{ rule_attribute: "region_id" }, { rule_attribute: "city" }],
      prices: [
        {
          amount: 300,
          currency_code: "EUR",
          rules: {
            region_id: "PL",
            city: "krakow"
          },
        },
        {
          amount: 400,
          currency_code: "EUR",
          min_quantity: 0,
          max_quantity: 4,
          rules: {
            region_id: "PL"
          },
        },
        {
          amount: 450,
          currency_code: "EUR",
          rules: {
            city: "krakow"
          },
        }
      ],
    },
  ])

  // do something with the price sets or return them
}
```
