---
displayed_sidebar: modules
---

# IPricingModuleService Reference

## addPrices

### addPrices(data, sharedContext?): Promise<PriceSetDTO\>

This method adds prices to a price set.

#### Parameters

- `data`: An object of type [AddPricesDTO](AddPricesDTO.md) that holds the data necessary to add the prices. It accepts the following properties:
	- `priceSetId`: A string indicating the ID of the price set to add prices to.
	- `prices`: An array of objects of type [CreatePricesDTO](CreatePricesDTO.md), each being a price to add to the price set. Its items accept the following properties::
		- `amount`: (optional) A number indicating the amount of this price.
		- `currency`: (optional) An object of type [CurrencyDTO](CurrencyDTO.md) that holds the details of the price's currency. Since this is a relation, it will only be retrieved if it's passed to the `relations` array of the find-configuration options.
		- `currency_code`: A string that indicates the currency code of this price.
		- `id`: (optional) A string that indicates the ID of the money amount. A money amount represents a price.
		- `max_quantity`: (optional) A number that indicates the maximum quantity required to be purchased for this price to be applied.
		- `min_quantity`: (optional) A number that indicates the minimum quantity required to be purchased for this price to be applied.
		- `rules`: An object whose keys are rule types' `rule_attribute` attribute, and values are the value of that rule associated with this price.
- `sharedContext`: (optional) An object of type [Context](Context.md) used to share resources, such as transaction manager, with the module. It accepts the following properties:
	- `enableNestedTransactions`: (optional) a boolean value indicating whether nested transactions are enabled.
	- `isolationLevel`: (optional) 
	- `manager`: (optional) An instance of a manager, typically an entity manager, of type `TManager`, which is a typed parameter passed to the context to specify the type of the `manager`.
	- `transactionId`: (optional) a string indicating the ID of the current transaction.
	- `transactionManager`: (optional) An instance of a transaction manager of type `TManager`, which is a typed parameter passed to the context to specify the type of the `transactionManager`.

#### Returns

A promise that resolves to an object of type [PriceSetDTO](PriceSetDTO.md), which is the price set that the prices belong to.

<details>
<summary>
PriceSetDTO
</summary>

- `id`: A string indicating the ID of the price set.
- `money_amounts`: (optional) An array of objects of type [MoneyAmountDTO](MoneyAmountDTO.md), which holds the prices that belong to this price set. Its items accept the following properties::
	- `amount`: (optional) A number indicating the amount of this price.
	- `currency`: (optional) An object of type [CurrencyDTO](CurrencyDTO.md) that holds the details of the price's currency. Since this is a relation, it will only be retrieved if it's passed to the `relations` array of the find-configuration options. It accepts the following properties:
		- `code`: 
		- `name`: (optional) 
		- `symbol`: (optional) 
		- `symbol_native`: (optional) 
	- `currency_code`: (optional) A string that indicates the currency code of this price.
	- `id`: A string that indicates the ID of the money amount. A money amount represents a price.
	- `max_quantity`: (optional) A number that indicates the maximum quantity required to be purchased for this price to be applied.
	- `min_quantity`: (optional) A number that indicates the minimum quantity required to be purchased for this price to be applied.
- `rule_types`: (optional) An array of objects of type [RuleTypeDTO](RuleTypeDTO.md), which holds the rule types applied on this price set. Its items accept the following properties::
	- `default_priority`: A number indicating the priority of the rule type. This is useful when calculating the price of a price set, and multiple rules satisfy the provided context. The higher the value, the higher the priority of the rule type.
	- `id`: A string indicating the ID of the rule type.
	- `name`: A string indicating the display name of the rule type.
	- `rule_attribute`: A string indicating a unique name used to later identify the rule_attribute. For example, it can be used in the `context` parameter of the `calculatePrices` method to specify a rule for calculating the price.

</details>

#### Example

To add a default price to a price set, don't pass it any rules and make sure to pass it the `currency_code`:

```ts
import { 
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function addPricesToPriceSet (priceSetId: string) {
  const pricingService = await initializePricingModule()

  const priceSet = await pricingService.addPrices({
    priceSetId,
    prices: [
     {
        amount: 500,
        currency_code: "USD",
        rules: {},
      },
    ],
  })

  // do something with the price set or return it
}
```

To add prices with rules:

```ts
import { 
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function addPricesToPriceSet (priceSetId: string) {
  const pricingService = await initializePricingModule()

  const priceSet = await pricingService.addPrices({
    priceSetId,
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
  })

  // do something with the price set or return it
}
```

### addPrices(data, sharedContext?): Promise<PriceSetDTO[]\>

This method adds prices to multiple price sets.

#### Parameters

- `data`: An array of objects of type [AddPricesDTO](AddPricesDTO.md), each holding the data necessary to add the prices to the price set. Its items accept the following properties::
	- `priceSetId`: A string indicating the ID of the price set to add prices to.
	- `prices`: An array of objects of type [CreatePricesDTO](CreatePricesDTO.md), each being a price to add to the price set. Its items accept the following properties::
		- `amount`: (optional) A number indicating the amount of this price.
		- `currency`: (optional) An object of type [CurrencyDTO](CurrencyDTO.md) that holds the details of the price's currency. Since this is a relation, it will only be retrieved if it's passed to the `relations` array of the find-configuration options.
		- `currency_code`: A string that indicates the currency code of this price.
		- `id`: (optional) A string that indicates the ID of the money amount. A money amount represents a price.
		- `max_quantity`: (optional) A number that indicates the maximum quantity required to be purchased for this price to be applied.
		- `min_quantity`: (optional) A number that indicates the minimum quantity required to be purchased for this price to be applied.
		- `rules`: An object whose keys are rule types' `rule_attribute` attribute, and values are the value of that rule associated with this price.
- `sharedContext`: (optional) An object of type [Context](Context.md) used to share resources, such as transaction manager, with the module. It accepts the following properties:
	- `enableNestedTransactions`: (optional) a boolean value indicating whether nested transactions are enabled.
	- `isolationLevel`: (optional) 
	- `manager`: (optional) An instance of a manager, typically an entity manager, of type `TManager`, which is a typed parameter passed to the context to specify the type of the `manager`.
	- `transactionId`: (optional) a string indicating the ID of the current transaction.
	- `transactionManager`: (optional) An instance of a transaction manager of type `TManager`, which is a typed parameter passed to the context to specify the type of the `transactionManager`.

#### Returns

A promise that resolves to an array of objects of type [PriceSetDTO](PriceSetDTO.md), each being a price list that prices were added to.

<details>
<summary>
PriceSetDTO
</summary>

- `id`: A string indicating the ID of the price set.
- `money_amounts`: (optional) An array of objects of type [MoneyAmountDTO](MoneyAmountDTO.md), which holds the prices that belong to this price set. Its items accept the following properties::
	- `amount`: (optional) A number indicating the amount of this price.
	- `currency`: (optional) An object of type [CurrencyDTO](CurrencyDTO.md) that holds the details of the price's currency. Since this is a relation, it will only be retrieved if it's passed to the `relations` array of the find-configuration options. It accepts the following properties:
		- `code`: 
		- `name`: (optional) 
		- `symbol`: (optional) 
		- `symbol_native`: (optional) 
	- `currency_code`: (optional) A string that indicates the currency code of this price.
	- `id`: A string that indicates the ID of the money amount. A money amount represents a price.
	- `max_quantity`: (optional) A number that indicates the maximum quantity required to be purchased for this price to be applied.
	- `min_quantity`: (optional) A number that indicates the minimum quantity required to be purchased for this price to be applied.
- `rule_types`: (optional) An array of objects of type [RuleTypeDTO](RuleTypeDTO.md), which holds the rule types applied on this price set. Its items accept the following properties::
	- `default_priority`: A number indicating the priority of the rule type. This is useful when calculating the price of a price set, and multiple rules satisfy the provided context. The higher the value, the higher the priority of the rule type.
	- `id`: A string indicating the ID of the rule type.
	- `name`: A string indicating the display name of the rule type.
	- `rule_attribute`: A string indicating a unique name used to later identify the rule_attribute. For example, it can be used in the `context` parameter of the `calculatePrices` method to specify a rule for calculating the price.

</details>

#### Example

To add a default price to a price set, don't pass it any rules and make sure to pass it the `currency_code`:

```ts
import { 
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function addPricesToPriceSet (priceSetId: string) {
  const pricingService = await initializePricingModule()

  const priceSets = await pricingService.addPrices([{
    priceSetId,
    prices: [
     {
        amount: 500,
        currency_code: "USD",
        rules: {},
      },
    ],
  }])

  // do something with the price sets or return them
}
```

To add prices with rules:

```ts
import { 
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function addPricesToPriceSet (priceSetId: string) {
  const pricingService = await initializePricingModule()

  const priceSets = await pricingService.addPrices([{
    priceSetId,
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
  }])

  // do something with the price sets or return them
}
```

___

## addRules

### addRules(data, sharedContext?): Promise<PriceSetDTO\>

Add rules to a price set.

#### Parameters

- `data`: Data for adding rules to a price set.
- `sharedContext`: (optional) Optional shared context.

#### Returns

A promise resolving to the updated PriceSetDTO.

### addRules(data, sharedContext?): Promise<PriceSetDTO[]\>

Add rules to multiple price sets.

#### Parameters

- `data`: An array of data for adding rules to price sets.
- `sharedContext`: (optional) Optional shared context.

#### Returns

A promise resolving to an array of updated PriceSetDTOs.

___

## calculatePrices

This method is used to calculate prices based on the provided filters and context.

### Parameters

- `filters`: An object of type [PricingFilters](PricingFilters.md) used to filter the price sets. It accepts the following properties:
	- `id`: An array of strings, each being an ID of a price set.
- `context`: (optional) An object of type [PricingContext](PricingContext.md) to select prices. For example, the pricing context can specify the currency code to calculate prices in. It accepts the following properties:
	- `context`: (optional) an object whose keys are the name of the context attribute. Its value can be a string or a number. For example, you can pass the `currency_code` property with its value being the currency code to calculate the price in. Another example is passing the `quantity` property to calculate the price for that specified quantity, which finds a price set whose `min_quantity` and `max_quantity` conditions match the specified quantity.
- `sharedContext`: (optional) An object of type [Context](Context.md) used to share resources, such as transaction manager, with the module. It accepts the following properties:
	- `enableNestedTransactions`: (optional) a boolean value indicating whether nested transactions are enabled.
	- `isolationLevel`: (optional) 
	- `manager`: (optional) An instance of a manager, typically an entity manager, of type `TManager`, which is a typed parameter passed to the context to specify the type of the `manager`.
	- `transactionId`: (optional) a string indicating the ID of the current transaction.
	- `transactionManager`: (optional) An instance of a transaction manager of type `TManager`, which is a typed parameter passed to the context to specify the type of the `transactionManager`.

### Returns

A promise that resolves to an object of type [CalculatedPriceSetDTO](CalculatedPriceSetDTO.md) which includes the calculated prices.

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

### Example

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

___

## create

### create(data, sharedContext?): Promise<PriceSetDTO\>

This method is used to create a new price set.

#### Parameters

- `data`: An object of type [CreatePriceSetDTO](CreatePriceSetDTO.md) that holds the attribute of the price set to create. It accepts the following properties:
	- `prices`: (optional) An array of objects of type [CreatePricesDTO](CreatePricesDTO.md), each being a price to associate with the price set. Its items accept the following properties::
		- `amount`: (optional) A number indicating the amount of this price.
		- `currency`: (optional) An object of type [CurrencyDTO](CurrencyDTO.md) that holds the details of the price's currency. Since this is a relation, it will only be retrieved if it's passed to the `relations` array of the find-configuration options.
		- `currency_code`: A string that indicates the currency code of this price.
		- `id`: (optional) A string that indicates the ID of the money amount. A money amount represents a price.
		- `max_quantity`: (optional) A number that indicates the maximum quantity required to be purchased for this price to be applied.
		- `min_quantity`: (optional) A number that indicates the minimum quantity required to be purchased for this price to be applied.
		- `rules`: An object whose keys are rule types' `rule_attribute` attribute, and values are the value of that rule associated with this price.
	- `rules`: (optional) An array of objects, each object accepts a property `rule_attribute`, whose value is a string indicating the `rule_attribute` value of a rule type. This property is used to specify the rule types associated with the price set.
- `sharedContext`: (optional) An object of type [Context](Context.md) used to share resources, such as transaction manager, with the module. It accepts the following properties:
	- `enableNestedTransactions`: (optional) a boolean value indicating whether nested transactions are enabled.
	- `isolationLevel`: (optional) 
	- `manager`: (optional) An instance of a manager, typically an entity manager, of type `TManager`, which is a typed parameter passed to the context to specify the type of the `manager`.
	- `transactionId`: (optional) a string indicating the ID of the current transaction.
	- `transactionManager`: (optional) An instance of a transaction manager of type `TManager`, which is a typed parameter passed to the context to specify the type of the `transactionManager`.

#### Returns

A promise that resolves to an object of type [PriceSetDTO](PriceSetDTO.md), which is the created price set.

<details>
<summary>
PriceSetDTO
</summary>

- `id`: A string indicating the ID of the price set.
- `money_amounts`: (optional) An array of objects of type [MoneyAmountDTO](MoneyAmountDTO.md), which holds the prices that belong to this price set. Its items accept the following properties::
	- `amount`: (optional) A number indicating the amount of this price.
	- `currency`: (optional) An object of type [CurrencyDTO](CurrencyDTO.md) that holds the details of the price's currency. Since this is a relation, it will only be retrieved if it's passed to the `relations` array of the find-configuration options. It accepts the following properties:
		- `code`: 
		- `name`: (optional) 
		- `symbol`: (optional) 
		- `symbol_native`: (optional) 
	- `currency_code`: (optional) A string that indicates the currency code of this price.
	- `id`: A string that indicates the ID of the money amount. A money amount represents a price.
	- `max_quantity`: (optional) A number that indicates the maximum quantity required to be purchased for this price to be applied.
	- `min_quantity`: (optional) A number that indicates the minimum quantity required to be purchased for this price to be applied.
- `rule_types`: (optional) An array of objects of type [RuleTypeDTO](RuleTypeDTO.md), which holds the rule types applied on this price set. Its items accept the following properties::
	- `default_priority`: A number indicating the priority of the rule type. This is useful when calculating the price of a price set, and multiple rules satisfy the provided context. The higher the value, the higher the priority of the rule type.
	- `id`: A string indicating the ID of the rule type.
	- `name`: A string indicating the display name of the rule type.
	- `rule_attribute`: A string indicating a unique name used to later identify the rule_attribute. For example, it can be used in the `context` parameter of the `calculatePrices` method to specify a rule for calculating the price.

</details>

#### Example

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

### create(data, sharedContext?): Promise<PriceSetDTO[]\>

This method is used to create multiple price sets.

#### Parameters

- `data`: An array of objects of type [CreatePriceSetDTO](CreatePriceSetDTO.md), where each object holds the attribute of a price set to create. Its items accept the following properties::
	- `prices`: (optional) An array of objects of type [CreatePricesDTO](CreatePricesDTO.md), each being a price to associate with the price set. Its items accept the following properties::
		- `amount`: (optional) A number indicating the amount of this price.
		- `currency`: (optional) An object of type [CurrencyDTO](CurrencyDTO.md) that holds the details of the price's currency. Since this is a relation, it will only be retrieved if it's passed to the `relations` array of the find-configuration options.
		- `currency_code`: A string that indicates the currency code of this price.
		- `id`: (optional) A string that indicates the ID of the money amount. A money amount represents a price.
		- `max_quantity`: (optional) A number that indicates the maximum quantity required to be purchased for this price to be applied.
		- `min_quantity`: (optional) A number that indicates the minimum quantity required to be purchased for this price to be applied.
		- `rules`: An object whose keys are rule types' `rule_attribute` attribute, and values are the value of that rule associated with this price.
	- `rules`: (optional) An array of objects, each object accepts a property `rule_attribute`, whose value is a string indicating the `rule_attribute` value of a rule type. This property is used to specify the rule types associated with the price set.
- `sharedContext`: (optional) An object of type [Context](Context.md) used to share resources, such as transaction manager, with the module. It accepts the following properties:
	- `enableNestedTransactions`: (optional) a boolean value indicating whether nested transactions are enabled.
	- `isolationLevel`: (optional) 
	- `manager`: (optional) An instance of a manager, typically an entity manager, of type `TManager`, which is a typed parameter passed to the context to specify the type of the `manager`.
	- `transactionId`: (optional) a string indicating the ID of the current transaction.
	- `transactionManager`: (optional) An instance of a transaction manager of type `TManager`, which is a typed parameter passed to the context to specify the type of the `transactionManager`.

#### Returns

A promise that resolves to an array of objects of type [PriceSetDTO](PriceSetDTO.md), which are the created price sets.

<details>
<summary>
PriceSetDTO
</summary>

- `id`: A string indicating the ID of the price set.
- `money_amounts`: (optional) An array of objects of type [MoneyAmountDTO](MoneyAmountDTO.md), which holds the prices that belong to this price set. Its items accept the following properties::
	- `amount`: (optional) A number indicating the amount of this price.
	- `currency`: (optional) An object of type [CurrencyDTO](CurrencyDTO.md) that holds the details of the price's currency. Since this is a relation, it will only be retrieved if it's passed to the `relations` array of the find-configuration options. It accepts the following properties:
		- `code`: 
		- `name`: (optional) 
		- `symbol`: (optional) 
		- `symbol_native`: (optional) 
	- `currency_code`: (optional) A string that indicates the currency code of this price.
	- `id`: A string that indicates the ID of the money amount. A money amount represents a price.
	- `max_quantity`: (optional) A number that indicates the maximum quantity required to be purchased for this price to be applied.
	- `min_quantity`: (optional) A number that indicates the minimum quantity required to be purchased for this price to be applied.
- `rule_types`: (optional) An array of objects of type [RuleTypeDTO](RuleTypeDTO.md), which holds the rule types applied on this price set. Its items accept the following properties::
	- `default_priority`: A number indicating the priority of the rule type. This is useful when calculating the price of a price set, and multiple rules satisfy the provided context. The higher the value, the higher the priority of the rule type.
	- `id`: A string indicating the ID of the rule type.
	- `name`: A string indicating the display name of the rule type.
	- `rule_attribute`: A string indicating a unique name used to later identify the rule_attribute. For example, it can be used in the `context` parameter of the `calculatePrices` method to specify a rule for calculating the price.

</details>

#### Example

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

___

## createCurrencies

Creates new currencies based on the provided data.

### Parameters

- `data`: An array of objects containing the data to create new currencies.
- `sharedContext`: (optional) An optional shared MedusaContext object.

### Returns

A Promise that resolves to an array of newly created currency objects.

___

## createMoneyAmounts

Creates new money amounts based on the provided data.

### Parameters

- `data`: An array of data objects for creating money amounts.
- `sharedContext`: (optional) Optional shared context.

### Returns

A promise that resolves to an array of created MoneyAmountDTOs.

___

## createPriceRules

Creates new price rules based on the provided data.

### Parameters

- `data`: An array of objects containing the data to create new price rules.
- `sharedContext`: (optional) An optional shared MedusaContext object.

### Returns

A Promise that resolves to an array of newly created price rule objects.

___

## createPriceSetMoneyAmountRules

Creates new price set money amount rules based on the provided data.

### Parameters

- `data`: An array of objects containing the data to create new price set money amount rules.
- `sharedContext`: (optional) An optional shared MedusaContext object.

### Returns

A Promise that resolves to an array of newly created price set money amount rule objects.

___

## createRuleTypes

Creates new rule types based on the provided data.

### Parameters

- `data`: An array of objects containing the data to create new rule types.
- `sharedContext`: (optional) An optional shared MedusaContext object.

### Returns

A Promise that resolves to an array of newly created rule type objects.

___

## delete

This method deletes price sets by their IDs.

### Parameters

- `ids`: An array of strings, each being the ID for a price set to delete.
- `sharedContext`: (optional) An object of type [Context](Context.md) used to share resources, such as transaction manager, with the module. It accepts the following properties:
	- `enableNestedTransactions`: (optional) a boolean value indicating whether nested transactions are enabled.
	- `isolationLevel`: (optional) 
	- `manager`: (optional) An instance of a manager, typically an entity manager, of type `TManager`, which is a typed parameter passed to the context to specify the type of the `manager`.
	- `transactionId`: (optional) a string indicating the ID of the current transaction.
	- `transactionManager`: (optional) An instance of a transaction manager of type `TManager`, which is a typed parameter passed to the context to specify the type of the `transactionManager`.

### Returns

A promise that resolves when the price sets are successfully deleted.

### Example

```ts
import { 
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function removePriceSetRule (priceSetIds: string[]) {
  const pricingService = await initializePricingModule()

  await pricingService.delete(priceSetIds)
}
```

___

## deleteCurrencies

Deletes currencies with the specified codes.

### Parameters

- `currencyCodes`: An array of string codes representing the currencies to delete.
- `sharedContext`: (optional) An optional shared MedusaContext object.

### Returns

A Promise that resolves once the currencies are deleted.

___

## deleteMoneyAmounts

Deletes money amounts by their IDs.

### Parameters

- `ids`: An array of IDs for money amounts to delete.
- `sharedContext`: (optional) Optional shared context.

### Returns

A promise that resolves when the money amounts are successfully deleted.

___

## deletePriceRules

Deletes price rules with the specified IDs.

### Parameters

- `priceRuleIds`: An array of string IDs representing the price rules to delete.
- `sharedContext`: (optional) An optional shared MedusaContext object.

### Returns

A Promise that resolves once the price rules are deleted.

___

## deletePriceSetMoneyAmountRules

Deletes price set money amount rules with the specified IDs.

### Parameters

- `ids`: An array of string IDs representing the price set money amount rules to delete.
- `sharedContext`: (optional) An optional shared MedusaContext object.

### Returns

A Promise that resolves once the price set money amount rules are deleted.

___

## deleteRuleTypes

Deletes rule types with the specified IDs.

### Parameters

- `ruleTypeIds`: An array of string IDs representing the rule types to delete.
- `sharedContext`: (optional) An optional shared MedusaContext object.

### Returns

A Promise that resolves once the rule types are deleted.

___

## list

This method is used to retrieve a paginated list of price sets based on optional filters and configuration.

### Parameters

- `filters`: (optional) An object of type [FilterablePriceSetProps](FilterablePriceSetProps.md) that is used to filter the retrieved price lists. It accepts the following properties:
	- `$and`: (optional) 
	- `$or`: (optional) 
	- `id`: (optional) An array of strings, each being an ID of a price list to retrieve.
	- `money_amounts`: (optional) An object of type [FilterableMoneyAmountProps](FilterableMoneyAmountProps.md) that is used to filter the price sets by their associated money amounts. It accepts the following properties:
		- `$and`: (optional) 
		- `$or`: (optional) 
		- `currency_code`: (optional) A string or an array of strings, each being the currency code of a money amount to retrieve.
		- `id`: (optional) An array of strings, each being the ID of a money amount to retrieve.
- `config`: (optional) An object of type [FindConfig](FindConfig.md) used to configure how the price sets are retrieved. Its properties, such as `select` or `relations`, accept the attributes or relations associated with a price set. It accepts the following properties:
	- `order`: (optional) An object used to specify how to sort the returned records. Its keys are the names of attributes of the entity, and a key's value can either be `ASC` to sort retrieved records in an ascending order, or `DESC` to sort retrieved records in a descending order.
	- `relations`: (optional) An array of strings, each being relation names of the entity to retrieve in the result.
	- `select`: (optional) An array of strings, each being attribute names of the entity to retrieve in the result.
	- `skip`: (optional) A number indicating the number of records to skip before retrieving the results.
	- `take`: (optional) A number indicating the number of records to return in the result.
	- `withDeleted`: (optional) A boolean indicating whether deleted records should also be retrieved as part of the result. This only works if the entity extends the `SoftDeletableEntity` class.
- `sharedContext`: (optional) An object of type [Context](Context.md) used to share resources, such as transaction manager, with the module. It accepts the following properties:
	- `enableNestedTransactions`: (optional) a boolean value indicating whether nested transactions are enabled.
	- `isolationLevel`: (optional) 
	- `manager`: (optional) An instance of a manager, typically an entity manager, of type `TManager`, which is a typed parameter passed to the context to specify the type of the `manager`.
	- `transactionId`: (optional) a string indicating the ID of the current transaction.
	- `transactionManager`: (optional) An instance of a transaction manager of type `TManager`, which is a typed parameter passed to the context to specify the type of the `transactionManager`.

### Returns

A promise that resolves to an array of objects of type [PriceSetDTO](PriceSetDTO.md).

<details>
<summary>
PriceSetDTO
</summary>

- `id`: A string indicating the ID of the price set.
- `money_amounts`: (optional) An array of objects of type [MoneyAmountDTO](MoneyAmountDTO.md), which holds the prices that belong to this price set. Its items accept the following properties::
	- `amount`: (optional) A number indicating the amount of this price.
	- `currency`: (optional) An object of type [CurrencyDTO](CurrencyDTO.md) that holds the details of the price's currency. Since this is a relation, it will only be retrieved if it's passed to the `relations` array of the find-configuration options. It accepts the following properties:
		- `code`: 
		- `name`: (optional) 
		- `symbol`: (optional) 
		- `symbol_native`: (optional) 
	- `currency_code`: (optional) A string that indicates the currency code of this price.
	- `id`: A string that indicates the ID of the money amount. A money amount represents a price.
	- `max_quantity`: (optional) A number that indicates the maximum quantity required to be purchased for this price to be applied.
	- `min_quantity`: (optional) A number that indicates the minimum quantity required to be purchased for this price to be applied.
- `rule_types`: (optional) An array of objects of type [RuleTypeDTO](RuleTypeDTO.md), which holds the rule types applied on this price set. Its items accept the following properties::
	- `default_priority`: A number indicating the priority of the rule type. This is useful when calculating the price of a price set, and multiple rules satisfy the provided context. The higher the value, the higher the priority of the rule type.
	- `id`: A string indicating the ID of the rule type.
	- `name`: A string indicating the display name of the rule type.
	- `rule_attribute`: A string indicating a unique name used to later identify the rule_attribute. For example, it can be used in the `context` parameter of the `calculatePrices` method to specify a rule for calculating the price.

</details>

### Example

To retrieve a list of price sets using their IDs:

```ts
import { 
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrievePriceSets (priceSetIds: string[]) {
  const pricingService = await initializePricingModule()

  const priceSets = await pricingService.list(
    {
      id: priceSetIds
    },
  )

  // do something with the price sets or return them
}
```

To specify relations that should be retrieved within the price sets:

```ts
import { 
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrievePriceSets (priceSetIds: string[]) {
  const pricingService = await initializePricingModule()

  const priceSets = await pricingService.list(
    {
      id: priceSetIds
    },
    {
      relations: ["money_amounts"]
    }
  )

  // do something with the price sets or return them
}
```

By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:

```ts
import { 
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrievePriceSets (priceSetIds: string[], skip: number, take: number) {
  const pricingService = await initializePricingModule()

  const priceSets = await pricingService.list(
    {
      id: priceSetIds
    },
    {
      relations: ["money_amounts"],
      skip,
      take
    }
  )

  // do something with the price sets or return them
}
```

___

## listAndCount

This method is used to retrieve a paginated list of price sets along with the total count of available price sets satisfying the provided filters.

### Parameters

- `filters`: (optional) An object of type [FilterablePriceSetProps](FilterablePriceSetProps.md) that is used to filter the retrieved price lists. It accepts the following properties:
	- `$and`: (optional) 
	- `$or`: (optional) 
	- `id`: (optional) An array of strings, each being an ID of a price list to retrieve.
	- `money_amounts`: (optional) An object of type [FilterableMoneyAmountProps](FilterableMoneyAmountProps.md) that is used to filter the price sets by their associated money amounts. It accepts the following properties:
		- `$and`: (optional) 
		- `$or`: (optional) 
		- `currency_code`: (optional) A string or an array of strings, each being the currency code of a money amount to retrieve.
		- `id`: (optional) An array of strings, each being the ID of a money amount to retrieve.
- `config`: (optional) An object of type [FindConfig](FindConfig.md) used to configure how the price sets are retrieved. Its properties, such as `select` or `relations`, accept the attributes or relations associated with a price set. It accepts the following properties:
	- `order`: (optional) An object used to specify how to sort the returned records. Its keys are the names of attributes of the entity, and a key's value can either be `ASC` to sort retrieved records in an ascending order, or `DESC` to sort retrieved records in a descending order.
	- `relations`: (optional) An array of strings, each being relation names of the entity to retrieve in the result.
	- `select`: (optional) An array of strings, each being attribute names of the entity to retrieve in the result.
	- `skip`: (optional) A number indicating the number of records to skip before retrieving the results.
	- `take`: (optional) A number indicating the number of records to return in the result.
	- `withDeleted`: (optional) A boolean indicating whether deleted records should also be retrieved as part of the result. This only works if the entity extends the `SoftDeletableEntity` class.
- `sharedContext`: (optional) An object of type [Context](Context.md) used to share resources, such as transaction manager, with the module. It accepts the following properties:
	- `enableNestedTransactions`: (optional) a boolean value indicating whether nested transactions are enabled.
	- `isolationLevel`: (optional) 
	- `manager`: (optional) An instance of a manager, typically an entity manager, of type `TManager`, which is a typed parameter passed to the context to specify the type of the `manager`.
	- `transactionId`: (optional) a string indicating the ID of the current transaction.
	- `transactionManager`: (optional) An instance of a transaction manager of type `TManager`, which is a typed parameter passed to the context to specify the type of the `transactionManager`.

### Returns

A promise that resolves to an array having two items, the first item is an array of type [PriceSetDTO](PriceSetDTO.md), and the second item is a number indicating the total count.

<details>
<summary>
PriceSetDTO
</summary>

- `id`: A string indicating the ID of the price set.
- `money_amounts`: (optional) An array of objects of type [MoneyAmountDTO](MoneyAmountDTO.md), which holds the prices that belong to this price set. Its items accept the following properties::
	- `amount`: (optional) A number indicating the amount of this price.
	- `currency`: (optional) An object of type [CurrencyDTO](CurrencyDTO.md) that holds the details of the price's currency. Since this is a relation, it will only be retrieved if it's passed to the `relations` array of the find-configuration options. It accepts the following properties:
		- `code`: 
		- `name`: (optional) 
		- `symbol`: (optional) 
		- `symbol_native`: (optional) 
	- `currency_code`: (optional) A string that indicates the currency code of this price.
	- `id`: A string that indicates the ID of the money amount. A money amount represents a price.
	- `max_quantity`: (optional) A number that indicates the maximum quantity required to be purchased for this price to be applied.
	- `min_quantity`: (optional) A number that indicates the minimum quantity required to be purchased for this price to be applied.
- `rule_types`: (optional) An array of objects of type [RuleTypeDTO](RuleTypeDTO.md), which holds the rule types applied on this price set. Its items accept the following properties::
	- `default_priority`: A number indicating the priority of the rule type. This is useful when calculating the price of a price set, and multiple rules satisfy the provided context. The higher the value, the higher the priority of the rule type.
	- `id`: A string indicating the ID of the rule type.
	- `name`: A string indicating the display name of the rule type.
	- `rule_attribute`: A string indicating a unique name used to later identify the rule_attribute. For example, it can be used in the `context` parameter of the `calculatePrices` method to specify a rule for calculating the price.

</details>

### Example

To retrieve a list of prices sets using their IDs:

```ts
import { 
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrievePriceSets (priceSetIds: string[]) {
  const pricingService = await initializePricingModule()

  const [priceSets, count] = await pricingService.listAndCount(
    {
      id: priceSetIds
    },
  )

  // do something with the price sets or return them
}
```

To specify relations that should be retrieved within the price sets:

```ts
import { 
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrievePriceSets (priceSetIds: string[]) {
  const pricingService = await initializePricingModule()

  const [priceSets, count] = await pricingService.listAndCount(
    {
      id: priceSetIds
    },
    {
      relations: ["money_amounts"]
    }
  )

  // do something with the price sets or return them
}
```

By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:

```ts
import { 
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrievePriceSets (priceSetIds: string[], skip: number, take: number) {
  const pricingService = await initializePricingModule()

  const [priceSets, count] = await pricingService.listAndCount(
    {
      id: priceSetIds
    },
    {
      relations: ["money_amounts"],
      skip,
      take
    }
  )

  // do something with the price sets or return them
}
```

___

## listAndCountCurrencies

Lists and counts currencies based on the provided filters and configuration.

### Parameters

- `filters`: (optional) Optional filters to apply when listing currencies.
- `config`: (optional) Optional configuration for listing currencies.
- `sharedContext`: (optional) An optional shared MedusaContext object.

### Returns

A Promise that resolves to an array containing the list of currency objects and the total count.

___

## listAndCountMoneyAmounts

Lists money amounts based on optional filters and configuration and provides the total count.

### Parameters

- `filters`: (optional) Optional filters to narrow down the list.
- `config`: (optional) Optional configuration for the listing operation.
- `sharedContext`: (optional) Optional shared context.

### Returns

A promise that resolves to an array of MoneyAmountDTOs and the total count.

___

## listAndCountPriceRules

Lists and counts price rules based on the provided filters and configuration.

### Parameters

- `filters`: (optional) Optional filters to apply when listing price rules.
- `config`: (optional) Optional configuration for listing price rules.
- `sharedContext`: (optional) An optional shared MedusaContext object.

### Returns

A Promise that resolves to an array containing the list of price rule objects and the total count.

___

## listAndCountPriceSetMoneyAmountRules

Lists and counts price set money amount rules based on the provided filters and configuration.

### Parameters

- `filters`: (optional) Optional filters to apply when listing price set money amount rules.
- `config`: (optional) Optional configuration for listing price set money amount rules.
- `sharedContext`: (optional) An optional shared MedusaContext object.

### Returns

A Promise that resolves to an array containing the list of price set money amount rule objects and the total count.

___

## listAndCountRuleTypes

Lists and counts rule types based on the provided filters and configuration.

### Parameters

- `filters`: (optional) Optional filters to apply when listing rule types.
- `config`: (optional) Optional configuration for listing rule types.
- `sharedContext`: (optional) An optional shared MedusaContext object.

### Returns

A Promise that resolves to an array containing the list of rule type objects and the total count.

___

## listCurrencies

Lists currencies based on the provided filters and configuration.

### Parameters

- `filters`: (optional) Optional filters to apply when listing currencies.
- `config`: (optional) Optional configuration for listing currencies.
- `sharedContext`: (optional) An optional shared MedusaContext object.

### Returns

A Promise that resolves to an array containing the list of currency objects.

___

## listMoneyAmounts

Lists money amounts based on optional filters and configuration.

### Parameters

- `filters`: (optional) Optional filters to narrow down the list.
- `config`: (optional) Optional configuration for the listing operation.
- `sharedContext`: (optional) Optional shared context.

### Returns

A promise that resolves to an array of MoneyAmountDTOs.

___

## listPriceRules

Lists price rules based on the provided filters and configuration.

### Parameters

- `filters`: (optional) Optional filters to apply when listing price rules.
- `config`: (optional) Optional configuration for listing price rules.
- `sharedContext`: (optional) An optional shared MedusaContext object.

### Returns

A Promise that resolves to an array containing the list of price rule objects.

___

## listPriceSetMoneyAmountRules

Lists price set money amount rules based on the provided filters and configuration.

### Parameters

- `filters`: (optional) Optional filters to apply when listing price set money amount rules.
- `config`: (optional) Optional configuration for listing price set money amount rules.
- `sharedContext`: (optional) An optional shared MedusaContext object.

### Returns

A Promise that resolves to an array containing the list of price set money amount rule objects.

___

## listRuleTypes

Lists rule types based on the provided filters and configuration.

### Parameters

- `filters`: (optional) Optional filters to apply when listing rule types.
- `config`: (optional) Optional configuration for listing rule types.
- `sharedContext`: (optional) An optional shared MedusaContext object.

### Returns

A Promise that resolves to an array containing the list of rule type objects.

___

## removeRules

This method remove rules from a price set.

### Parameters

- `data`: An array of objects of type [RemovePriceSetRulesDTO](RemovePriceSetRulesDTO.md), each specfiying which rules to remove. Its items accept the following properties::
	- `id`: A string indicating the ID of the price set.
	- `rules`: An array of strings, each string is the `rule_attribute` of a rule you want to remove.
- `sharedContext`: (optional) An object of type [Context](Context.md) used to share resources, such as transaction manager, with the module. It accepts the following properties:
	- `enableNestedTransactions`: (optional) a boolean value indicating whether nested transactions are enabled.
	- `isolationLevel`: (optional) 
	- `manager`: (optional) An instance of a manager, typically an entity manager, of type `TManager`, which is a typed parameter passed to the context to specify the type of the `manager`.
	- `transactionId`: (optional) a string indicating the ID of the current transaction.
	- `transactionManager`: (optional) An instance of a transaction manager of type `TManager`, which is a typed parameter passed to the context to specify the type of the `transactionManager`.

### Returns

A promise that resolves when rules are successfully removed.

### Example

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

___

## retrieve

This method is used to retrieves a price set by its ID.

### Parameters

- `id`: A string indicating the ID of the price set to retrieve.
- `config`: (optional) An object of type [FindConfig](FindConfig.md) used to configure how the price set is retrieved. Its properties, such as `select` or `relations`, accept the attributes or relations associated with a price set. It accepts the following properties:
	- `order`: (optional) An object used to specify how to sort the returned records. Its keys are the names of attributes of the entity, and a key's value can either be `ASC` to sort retrieved records in an ascending order, or `DESC` to sort retrieved records in a descending order.
	- `relations`: (optional) An array of strings, each being relation names of the entity to retrieve in the result.
	- `select`: (optional) An array of strings, each being attribute names of the entity to retrieve in the result.
	- `skip`: (optional) A number indicating the number of records to skip before retrieving the results.
	- `take`: (optional) A number indicating the number of records to return in the result.
	- `withDeleted`: (optional) A boolean indicating whether deleted records should also be retrieved as part of the result. This only works if the entity extends the `SoftDeletableEntity` class.
- `sharedContext`: (optional) An object of type [Context](Context.md) used to share resources, such as transaction manager, with the module. It accepts the following properties:
	- `enableNestedTransactions`: (optional) a boolean value indicating whether nested transactions are enabled.
	- `isolationLevel`: (optional) 
	- `manager`: (optional) An instance of a manager, typically an entity manager, of type `TManager`, which is a typed parameter passed to the context to specify the type of the `manager`.
	- `transactionId`: (optional) a string indicating the ID of the current transaction.
	- `transactionManager`: (optional) An instance of a transaction manager of type `TManager`, which is a typed parameter passed to the context to specify the type of the `transactionManager`.

### Returns

A promise that resolves to an object of type [PriceSetDTO](PriceSetDTO.md) which is the retrieved price set.

<details>
<summary>
PriceSetDTO
</summary>

- `id`: A string indicating the ID of the price set.
- `money_amounts`: (optional) An array of objects of type [MoneyAmountDTO](MoneyAmountDTO.md), which holds the prices that belong to this price set. Its items accept the following properties::
	- `amount`: (optional) A number indicating the amount of this price.
	- `currency`: (optional) An object of type [CurrencyDTO](CurrencyDTO.md) that holds the details of the price's currency. Since this is a relation, it will only be retrieved if it's passed to the `relations` array of the find-configuration options. It accepts the following properties:
		- `code`: 
		- `name`: (optional) 
		- `symbol`: (optional) 
		- `symbol_native`: (optional) 
	- `currency_code`: (optional) A string that indicates the currency code of this price.
	- `id`: A string that indicates the ID of the money amount. A money amount represents a price.
	- `max_quantity`: (optional) A number that indicates the maximum quantity required to be purchased for this price to be applied.
	- `min_quantity`: (optional) A number that indicates the minimum quantity required to be purchased for this price to be applied.
- `rule_types`: (optional) An array of objects of type [RuleTypeDTO](RuleTypeDTO.md), which holds the rule types applied on this price set. Its items accept the following properties::
	- `default_priority`: A number indicating the priority of the rule type. This is useful when calculating the price of a price set, and multiple rules satisfy the provided context. The higher the value, the higher the priority of the rule type.
	- `id`: A string indicating the ID of the rule type.
	- `name`: A string indicating the display name of the rule type.
	- `rule_attribute`: A string indicating a unique name used to later identify the rule_attribute. For example, it can be used in the `context` parameter of the `calculatePrices` method to specify a rule for calculating the price.

</details>

### Example

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

___

## retrieveCurrency

Retrieves a currency by its code based on the provided configuration.

### Parameters

- `code`: The code of the currency to retrieve.
- `config`: (optional) Optional configuration for retrieving the currency.
- `sharedContext`: (optional) An optional shared MedusaContext object.

### Returns

A Promise that resolves to the retrieved currency object.

___

## retrieveMoneyAmount

Retrieves a money amount by its ID.

### Parameters

- `id`: The ID of the money amount to retrieve.
- `config`: (optional) Optional configuration for the retrieval operation.
- `sharedContext`: (optional) Optional shared context.

### Returns

A promise that resolves to a MoneyAmountDTO.

___

## retrievePriceRule

Retrieves a price rule by its ID

### Parameters

- `id`: The ID of the price rule to retrieve.
- `config`: (optional) Optional configuration for retrieving the price rule.
- `sharedContext`: (optional) An optional shared MedusaContext object.

### Returns

A Promise that resolves to the retrieved price rule object.

___

## retrievePriceSetMoneyAmountRules

Retrieves a price set money amount rule by its ID based on the provided configuration.

### Parameters

- `id`: The ID of the price set money amount rule to retrieve.
- `config`: (optional) Optional configuration for retrieving the price set money amount rule.
- `sharedContext`: (optional) An optional shared MedusaContext object.

### Returns

A Promise that resolves to the retrieved price set money amount rule object.

___

## retrieveRuleType

Retrieves a rule type by its ID based on the provided configuration.

### Parameters

- `code`: 
- `config`: (optional) Optional configuration for retrieving the rule type.
- `sharedContext`: (optional) An optional shared MedusaContext object.

### Returns

A Promise that resolves to the retrieved rule type object.

___

## updateCurrencies

Updates currencies with the provided data.

### Parameters

- `data`: An array of objects containing the data to update the currencies.
- `sharedContext`: (optional) An optional shared MedusaContext object.

### Returns

A Promise that resolves to an array of updated currency objects.

___

## updateMoneyAmounts

Updates existing money amounts based on the provided data.

### Parameters

- `data`: An array of data objects for updating money amounts.
- `sharedContext`: (optional) Optional shared context.

### Returns

A promise that resolves to an array of updated MoneyAmountDTOs.

___

## updatePriceRules

Updates price rules with the provided data.

### Parameters

- `data`: An array of objects containing the data to update the price rules.
- `sharedContext`: (optional) An optional shared MedusaContext object.

### Returns

A Promise that resolves to an array of updated price rule objects.

___

## updatePriceSetMoneyAmountRules

Updates price set money amount rules with the provided data.

### Parameters

- `data`: An array of objects containing the data to update the price set money amount rules.
- `sharedContext`: (optional) An optional shared MedusaContext object.

### Returns

A Promise that resolves to an array of updated price set money amount rule objects.

___

## updateRuleTypes

Updates rule types with the provided data.

### Parameters

- `data`: An array of objects containing the data to update the rule types.
- `sharedContext`: (optional) An optional shared MedusaContext object.

### Returns

A Promise that resolves to an array of updated rule type objects.
