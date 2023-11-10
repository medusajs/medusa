# IPricingModuleService

## Methods

### addPrices

**addPrices**(`data`, `sharedContext?`): `Promise`<[`PriceSetDTO`](PriceSetDTO.md)\>

This method adds prices to a price set.

**Example**

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

#### Parameters

| Name | Description |
| :------ | :------ |
| `data` | [`AddPricesDTO`](AddPricesDTO.md) | The data defining the price set to add the prices to, along with the prices to add. |
| `sharedContext?` | [`Context`](Context.md) | A context used to share resources, such as transaction manager, between the application and the module. |

#### Returns

`Promise`<[`PriceSetDTO`](PriceSetDTO.md)\>

-`Promise`: The price set that the prices were added to.
	-`id`: The ID of the price set.
	-`money_amounts`: (optional) The prices that belong to this price set.
		-`amount`: (optional) The price of this money amount.
		-`currency`: (optional) The money amount's currency. Since this is a relation, it will only be retrieved if it's passed to the `relations` array of the find-configuration options.
		-`currency_code`: (optional) The currency code of this money amount.
		-`id`: The ID of the money amount.
		-`max_quantity`: (optional) The maximum quantity required to be purchased for this price to be applied.
		-`min_quantity`: (optional) The minimum quantity required to be purchased for this price to be applied.
	-`rule_types`: (optional) The rule types applied on this price set.
		-`default_priority`: The priority of the rule type. This is useful when calculating the price of a price set, and multiple rules satisfy the provided context. The higher the value, the higher the priority of the rule type.
		-`id`: The ID of the rule type.
		-`name`: The display name of the rule type.
		-`rule_attribute`: The unique name used to later identify the rule_attribute. For example, it can be used in the `context` parameter of the `calculatePrices` method to specify a rule for calculating the price.

#### Defined in

packages/types/dist/pricing/service.d.ts:677

**addPrices**(`data`, `sharedContext?`): `Promise`<[`PriceSetDTO`](PriceSetDTO.md)[]\>

This method adds prices to multiple price sets.

**Example**

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

#### Parameters

| Name | Description |
| :------ | :------ |
| `data` | [`AddPricesDTO`](AddPricesDTO.md)[] | The data defining the prices to add per price set. |
| `sharedContext?` | [`Context`](Context.md) | A context used to share resources, such as transaction manager, between the application and the module. |

#### Returns

`Promise`<[`PriceSetDTO`](PriceSetDTO.md)[]\>

-`Promise`: The list of the price sets that prices were added to.
	-`PriceSetDTO[]`: 
		-`id`: The ID of the price set.
		-`money_amounts`: (optional) The prices that belong to this price set.
		-`rule_types`: (optional) The rule types applied on this price set.

#### Defined in

packages/types/dist/pricing/service.d.ts:756

___

### addRules

**addRules**(`data`, `sharedContext?`): `Promise`<[`PriceSetDTO`](PriceSetDTO.md)\>

This method adds rules to a price set.

**Example**

```ts
import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function addRulesToPriceSet (priceSetId: string) {
  const pricingService = await initializePricingModule()

  const priceSet = await pricingService.addRules({
    priceSetId,
    rules: [{
      attribute: "region_id"
    }]
  })

  // do something with the price set or return it
}
```

#### Parameters

| Name | Description |
| :------ | :------ |
| `data` | [`AddRulesDTO`](AddRulesDTO.md) | The data defining the price set to add the rules to, along with the rules to add. |
| `sharedContext?` | [`Context`](Context.md) | A context used to share resources, such as transaction manager, between the application and the module. |

#### Returns

`Promise`<[`PriceSetDTO`](PriceSetDTO.md)\>

-`Promise`: The price set that the rules were added to.
	-`id`: The ID of the price set.
	-`money_amounts`: (optional) The prices that belong to this price set.
		-`amount`: (optional) The price of this money amount.
		-`currency`: (optional) The money amount's currency. Since this is a relation, it will only be retrieved if it's passed to the `relations` array of the find-configuration options.
		-`currency_code`: (optional) The currency code of this money amount.
		-`id`: The ID of the money amount.
		-`max_quantity`: (optional) The maximum quantity required to be purchased for this price to be applied.
		-`min_quantity`: (optional) The minimum quantity required to be purchased for this price to be applied.
	-`rule_types`: (optional) The rule types applied on this price set.
		-`default_priority`: The priority of the rule type. This is useful when calculating the price of a price set, and multiple rules satisfy the provided context. The higher the value, the higher the priority of the rule type.
		-`id`: The ID of the rule type.
		-`name`: The display name of the rule type.
		-`rule_attribute`: The unique name used to later identify the rule_attribute. For example, it can be used in the `context` parameter of the `calculatePrices` method to specify a rule for calculating the price.

#### Defined in

packages/types/dist/pricing/service.d.ts:782

**addRules**(`data`, `sharedContext?`): `Promise`<[`PriceSetDTO`](PriceSetDTO.md)[]\>

This method adds rules to multiple price sets.

**Example**

```ts
import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function addRulesToPriceSet (priceSetId: string) {
  const pricingService = await initializePricingModule()

  const priceSets = await pricingService.addRules([{
    priceSetId,
    rules: [{
      attribute: "region_id"
    }]
  }])

  // do something with the price sets or return them
}
```

#### Parameters

| Name | Description |
| :------ | :------ |
| `data` | [`AddRulesDTO`](AddRulesDTO.md)[] | The data defining the rules to add per price set. |
| `sharedContext?` | [`Context`](Context.md) | A context used to share resources, such as transaction manager, between the application and the module. |

#### Returns

`Promise`<[`PriceSetDTO`](PriceSetDTO.md)[]\>

-`Promise`: The list of the price sets that the rules were added to.
	-`PriceSetDTO[]`: 
		-`id`: The ID of the price set.
		-`money_amounts`: (optional) The prices that belong to this price set.
		-`rule_types`: (optional) The rule types applied on this price set.

#### Defined in

packages/types/dist/pricing/service.d.ts:808

___

### calculatePrices

**calculatePrices**(`filters`, `context?`, `sharedContext?`): `Promise`<[`CalculatedPriceSetDTO`](CalculatedPriceSetDTO.md)\>

This method is used to calculate prices based on the provided filters and context.

**Example**

When you calculate prices, you must at least specify the currency code:

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

To calculate prices for specific minimum and/or maximum quantity:

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
        currency_code: currencyCode,
        min_quantity: 4
      }
    }
  )

  // do something with the price or return it
}
```

To calculate prices for custom rule types:

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
        currency_code: currencyCode,
        region_id: "US"
      }
    }
  )

  // do something with the price or return it
}
```

#### Parameters

| Name | Description |
| :------ | :------ |
| `filters` | [`PricingFilters`](PricingFilters.md) | The filters to apply on prices. |
| `context?` | [`PricingContext`](PricingContext.md) | The context used to select the prices. For example, you can specify the region ID in this context, and only prices having the same value will be retrieved. |
| `sharedContext?` | [`Context`](Context.md) | A context used to share resources, such as transaction manager, between the application and the module. |

#### Returns

`Promise`<[`CalculatedPriceSetDTO`](CalculatedPriceSetDTO.md)\>

-`Promise`: The calculated price matching the context and filters provided.
	-`amount`: The calculated amount. It can possibly be `null` if there's no price set up for the provided context.
	-`currency_code`: The currency code of the calculated price. It can possibly be `null`.
	-`id`: The ID of the price set.
	-`max_quantity`: The maximum quantity required to be purchased for this price to apply. It's set if the `quantity` property is provided in the context. Otherwise, its value will be `null`.
	-`min_quantity`: The minimum quantity required to be purchased for this price to apply. It's set if the `quantity` property is provided in the context. Otherwise, its value will be `null`.

#### Defined in

packages/types/dist/pricing/service.d.ts:89

___

### create

**create**(`data`, `sharedContext?`): `Promise`<[`PriceSetDTO`](PriceSetDTO.md)\>

This method is used to create a new price set.

**Example**

To create a default price set, don't pass any rules. For example:

```ts
import { initialize as initializePricingModule } from "@medusajs/pricing"

async function createPriceSet() {
  const pricingService = await initializePricingModule()

  const priceSet = await pricingService.create({
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
  })

  // do something with the price set or return it
}
```

To create a price set and associate it with rule types:

```ts
import { initialize as initializePricingModule } from "@medusajs/pricing"

async function createPriceSet() {
  const pricingService = await initializePricingModule()

  const priceSet = await pricingService.create({
    rules: [{ rule_attribute: "region_id" }, { rule_attribute: "city" }],
    prices: [
      {
        amount: 300,
        currency_code: "EUR",
        rules: {
          region_id: "PL",
          city: "krakow",
        },
      },
      {
        amount: 400,
        currency_code: "EUR",
        rules: {
          region_id: "PL",
        },
      },
      {
        amount: 450,
        currency_code: "EUR",
        rules: {
          city: "krakow",
        },
      },
    ],
  })

  // do something with the price set or return it
}
```

#### Parameters

| Name | Description |
| :------ | :------ |
| `data` | [`CreatePriceSetDTO`](CreatePriceSetDTO.md) | The attributes of the price set to create. |
| `sharedContext?` | [`Context`](Context.md) | A context used to share resources, such as transaction manager, between the application and the module. |

#### Returns

`Promise`<[`PriceSetDTO`](PriceSetDTO.md)\>

-`Promise`: The created price set.
	-`id`: The ID of the price set.
	-`money_amounts`: (optional) The prices that belong to this price set.
		-`amount`: (optional) The price of this money amount.
		-`currency`: (optional) The money amount's currency. Since this is a relation, it will only be retrieved if it's passed to the `relations` array of the find-configuration options.
		-`currency_code`: (optional) The currency code of this money amount.
		-`id`: The ID of the money amount.
		-`max_quantity`: (optional) The maximum quantity required to be purchased for this price to be applied.
		-`min_quantity`: (optional) The minimum quantity required to be purchased for this price to be applied.
	-`rule_types`: (optional) The rule types applied on this price set.
		-`default_priority`: The priority of the rule type. This is useful when calculating the price of a price set, and multiple rules satisfy the provided context. The higher the value, the higher the priority of the rule type.
		-`id`: The ID of the rule type.
		-`name`: The display name of the rule type.
		-`rule_attribute`: The unique name used to later identify the rule_attribute. For example, it can be used in the `context` parameter of the `calculatePrices` method to specify a rule for calculating the price.

#### Defined in

packages/types/dist/pricing/service.d.ts:459

**create**(`data`, `sharedContext?`): `Promise`<[`PriceSetDTO`](PriceSetDTO.md)[]\>

This method is used to create multiple price sets.

**Example**

To create price sets with a default price, don't pass any rules and make sure to pass the `currency_code` of the price. For example:

```ts
import { initialize as initializePricingModule } from "@medusajs/pricing"

async function createPriceSets() {
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
import { initialize as initializePricingModule } from "@medusajs/pricing"

async function createPriceSets() {
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
            city: "krakow",
          },
        },
        {
          amount: 400,
          currency_code: "EUR",
          min_quantity: 0,
          max_quantity: 4,
          rules: {
            region_id: "PL",
          },
        },
        {
          amount: 450,
          currency_code: "EUR",
          rules: {
            city: "krakow",
          },
        },
      ],
    },
  ])

  // do something with the price sets or return them
}
```

#### Parameters

| Name | Description |
| :------ | :------ |
| `data` | [`CreatePriceSetDTO`](CreatePriceSetDTO.md)[] | The price sets to create. |
| `sharedContext?` | [`Context`](Context.md) | A context used to share resources, such as transaction manager, between the application and the module. |

#### Returns

`Promise`<[`PriceSetDTO`](PriceSetDTO.md)[]\>

-`Promise`: The list of created price sets.
	-`PriceSetDTO[]`: 
		-`id`: The ID of the price set.
		-`money_amounts`: (optional) The prices that belong to this price set.
		-`rule_types`: (optional) The rule types applied on this price set.

#### Defined in

packages/types/dist/pricing/service.d.ts:543

___

### createCurrencies

**createCurrencies**(`data`, `sharedContext?`): `Promise`<[`CurrencyDTO`](CurrencyDTO.md)[]\>

This method is used to create new currencies.

**Example**

```ts
import { initialize as initializePricingModule } from "@medusajs/pricing"

async function createCurrencies() {
  const pricingService = await initializePricingModule()

  const currencies = await pricingService.createCurrencies([
    {
      code: "USD",
      symbol: "$",
      symbol_native: "$",
      name: "US Dollar",
    },
  ])

  // do something with the currencies or return them
}
```

#### Parameters

| Name | Description |
| :------ | :------ |
| `data` | [`CreateCurrencyDTO`](CreateCurrencyDTO.md)[] | The currencies to create. |
| `sharedContext?` | [`Context`](Context.md) | A context used to share resources, such as transaction manager, between the application and the module. |

#### Returns

`Promise`<[`CurrencyDTO`](CurrencyDTO.md)[]\>

-`Promise`: The list of created currencies.
	-`CurrencyDTO[]`: 
		-`code`: The code of the currency.
		-`name`: (optional) The name of the currency.
		-`symbol`: (optional) The symbol of the currency.
		-`symbol_native`: (optional) The symbol of the currecy in its native form. This is typically the symbol used when displaying a price.

#### Defined in

packages/types/dist/pricing/service.d.ts:1405

___

### createMoneyAmounts

**createMoneyAmounts**(`data`, `sharedContext?`): `Promise`<[`MoneyAmountDTO`](MoneyAmountDTO.md)[]\>

This method creates money amounts.

**Example**

```ts
import { initialize as initializePricingModule } from "@medusajs/pricing"

async function retrieveMoneyAmounts() {
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
      max_quantity: 4,
    },
  ])

  // do something with the money amounts or return them
}
```

#### Parameters

| Name | Description |
| :------ | :------ |
| `data` | [`CreateMoneyAmountDTO`](CreateMoneyAmountDTO.md)[] | The money amounts to create. |
| `sharedContext?` | [`Context`](Context.md) | A context used to share resources, such as transaction manager, between the application and the module. |

#### Returns

`Promise`<[`MoneyAmountDTO`](MoneyAmountDTO.md)[]\>

-`Promise`: The list of created money amounts.
	-`MoneyAmountDTO[]`: 
		-`amount`: (optional) The price of this money amount.
		-`currency`: (optional) The money amount's currency. Since this is a relation, it will only be retrieved if it's passed to the `relations` array of the find-configuration options.
		-`currency_code`: (optional) The currency code of this money amount.
		-`id`: The ID of the money amount.
		-`max_quantity`: (optional) The maximum quantity required to be purchased for this price to be applied.
		-`min_quantity`: (optional) The minimum quantity required to be purchased for this price to be applied.

#### Defined in

packages/types/dist/pricing/service.d.ts:1117

___

### createPriceRules

**createPriceRules**(`data`, `sharedContext?`): `Promise`<[`PriceRuleDTO`](PriceRuleDTO.md)[]\>

This method is used to create new price rules based on the provided data.

**Example**

```ts
import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function createPriceRules (
  id: string,
  priceSetId: string,
  ruleTypeId: string,
  value: string,
  priceSetMoneyAmountId: string,
  priceListId: string
) {
  const pricingService = await initializePricingModule()

  const priceRules = await pricingService.createPriceRules([
    {
      id,
      price_set_id: priceSetId,
      rule_type_id: ruleTypeId,
      value,
      price_set_money_amount_id: priceSetMoneyAmountId,
      price_list_id: priceListId
    }
  ])

  // do something with the price rules or return them
}
```

#### Parameters

| Name | Description |
| :------ | :------ |
| `data` | [`CreatePriceRuleDTO`](CreatePriceRuleDTO.md)[] | The price rules to create. |
| `sharedContext?` | [`Context`](Context.md) | A context used to share resources, such as transaction manager, between the application and the module. |

#### Returns

`Promise`<[`PriceRuleDTO`](PriceRuleDTO.md)[]\>

-`Promise`: The list of created price rules.
	-`PriceRuleDTO[]`: 
		-`id`: The ID of the price rule.
		-`price_list_id`: The ID of the associated price list.
		-`price_set`: The associated price set. It may only be available if the relation `price_set` is expanded.
		-`price_set_id`: The ID of the associated price set.
		-`price_set_money_amount_id`: The ID of the associated price set money amount.
		-`priority`: The priority of the price rule in comparison to other applicable price rules.
		-`rule_type`: The associated rule type. It may only be available if the relation `rule_type` is expanded.
		-`rule_type_id`: The ID of the associated rule type.
		-`value`: The value of the price rule.

#### Defined in

packages/types/dist/pricing/service.d.ts:2601

___

### createPriceSetMoneyAmountRules

**createPriceSetMoneyAmountRules**(`data`, `sharedContext?`): `Promise`<[`PriceSetMoneyAmountRulesDTO`](PriceSetMoneyAmountRulesDTO.md)[]\>

This method is used to create new price set money amount rules. A price set money amount rule creates an association between a price set money amount and
a rule type.

**Example**

```ts
import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function createPriceSetMoneyAmountRules (priceSetMoneyAmountId: string, ruleTypeId: string, value: string) {
  const pricingService = await initializePricingModule()

  const priceSetMoneyAmountRules = await pricingService.createPriceSetMoneyAmountRules([
    {
      price_set_money_amount: priceSetMoneyAmountId,
      rule_type: ruleTypeId,
      value
    }
  ])

  // do something with the price set money amount rules or return them
}
```

#### Parameters

| Name | Description |
| :------ | :------ |
| `data` | [`CreatePriceSetMoneyAmountRulesDTO`](CreatePriceSetMoneyAmountRulesDTO.md)[] | The price set money amount rules to create. |
| `sharedContext?` | [`Context`](Context.md) | A context used to share resources, such as transaction manager, between the application and the module. |

#### Returns

`Promise`<[`PriceSetMoneyAmountRulesDTO`](PriceSetMoneyAmountRulesDTO.md)[]\>

-`Promise`: The list of created price set money amount rules.
	-`PriceSetMoneyAmountRulesDTO[]`: 
		-`id`: The ID of the price set money amount.
		-`price_set_money_amount`: The associated price set money amount. It may only be available if the relation `price_set_money_amount` is expanded.
		-`rule_type`: The associated rule type. It may only be available if the relation `rule_type` is expanded.
		-`value`: The value of the price set money amount rule.

#### Defined in

packages/types/dist/pricing/service.d.ts:2268

___

### createRuleTypes

**createRuleTypes**(`data`, `sharedContext?`): `Promise`<[`RuleTypeDTO`](RuleTypeDTO.md)[]\>

This method is used to create new rule types.

**Example**

```ts
import { initialize as initializePricingModule } from "@medusajs/pricing"

async function createRuleTypes() {
  const pricingService = await initializePricingModule()

  const ruleTypes = await pricingService.createRuleTypes([
    {
      name: "Region",
      rule_attribute: "region_id",
    },
  ])

  // do something with the rule types or return them
}
```

#### Parameters

| Name | Description |
| :------ | :------ |
| `data` | [`CreateRuleTypeDTO`](CreateRuleTypeDTO.md)[] | The rule types to create. |
| `sharedContext?` | [`Context`](Context.md) | A context used to share resources, such as transaction manager, between the application and the module. |

#### Returns

`Promise`<[`RuleTypeDTO`](RuleTypeDTO.md)[]\>

-`Promise`: The list of created rule types.
	-`RuleTypeDTO[]`: 
		-`default_priority`: The priority of the rule type. This is useful when calculating the price of a price set, and multiple rules satisfy the provided context. The higher the value, the higher the priority of the rule type.
		-`id`: The ID of the rule type.
		-`name`: The display name of the rule type.
		-`rule_attribute`: The unique name used to later identify the rule_attribute. For example, it can be used in the `context` parameter of the `calculatePrices` method to specify a rule for calculating the price.

#### Defined in

packages/types/dist/pricing/service.d.ts:1739

___

### delete

**delete**(`ids`, `sharedContext?`): `Promise`<`void`\>

This method deletes price sets by their IDs.

**Example**

```ts
import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function removePriceSetRule (priceSetIds: string[]) {
  const pricingService = await initializePricingModule()

  await pricingService.delete(priceSetIds)
}
```

#### Parameters

| Name | Description |
| :------ | :------ |
| `ids` | `string`[] | The IDs of the price sets to delete. |
| `sharedContext?` | [`Context`](Context.md) | A context used to share resources, such as transaction manager, between the application and the module. |

#### Returns

`Promise`<`void`\>

-`Promise`: Resolves when the price sets are successfully deleted.

#### Defined in

packages/types/dist/pricing/service.d.ts:598

___

### deleteCurrencies

**deleteCurrencies**(`currencyCodes`, `sharedContext?`): `Promise`<`void`\>

This method is used to delete currencies based on their currency code.

**Example**

```ts
import { initialize as initializePricingModule } from "@medusajs/pricing"

async function deleteCurrencies() {
  const pricingService = await initializePricingModule()

  await pricingService.deleteCurrencies(["USD"])
}
```

#### Parameters

| Name | Description |
| :------ | :------ |
| `currencyCodes` | `string`[] | Currency codes of the currencies to delete. |
| `sharedContext?` | [`Context`](Context.md) | A context used to share resources, such as transaction manager, between the application and the module. |

#### Returns

`Promise`<`void`\>

-`Promise`: Resolves once the currencies are deleted.

#### Defined in

packages/types/dist/pricing/service.d.ts:1451

___

### deleteMoneyAmounts

**deleteMoneyAmounts**(`ids`, `sharedContext?`): `Promise`<`void`\>

This method deletes money amounts by their IDs.

**Example**

```ts
import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function deleteMoneyAmounts (moneyAmountIds: string[]) {
  const pricingService = await initializePricingModule()

  await pricingService.deleteMoneyAmounts(
    moneyAmountIds
  )
}
```

#### Parameters

| Name | Description |
| :------ | :------ |
| `ids` | `string`[] | The IDs of the money amounts to delete. |
| `sharedContext?` | [`Context`](Context.md) | A context used to share resources, such as transaction manager, between the application and the module. |

#### Returns

`Promise`<`void`\>

-`Promise`: Resolves when the money amounts are successfully deleted.

#### Defined in

packages/types/dist/pricing/service.d.ts:1164

___

### deletePriceRules

**deletePriceRules**(`priceRuleIds`, `sharedContext?`): `Promise`<`void`\>

This method is used to delete price rules based on the specified IDs.

**Example**

```ts
import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function deletePriceRules (
  id: string,
) {
  const pricingService = await initializePricingModule()

  await pricingService.deletePriceRules([id])
}
```

#### Parameters

| Name | Description |
| :------ | :------ |
| `priceRuleIds` | `string`[] | The IDs of the price rules to delete. |
| `sharedContext?` | [`Context`](Context.md) | A context used to share resources, such as transaction manager, between the application and the module. |

#### Returns

`Promise`<`void`\>

-`Promise`: Resolves once the price rules are deleted.

#### Defined in

packages/types/dist/pricing/service.d.ts:2651

___

### deletePriceSetMoneyAmountRules

**deletePriceSetMoneyAmountRules**(`ids`, `sharedContext?`): `Promise`<`void`\>

This method is used to delete price set money amount rules based on the specified IDs.

**Example**

```ts
import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function deletePriceSetMoneyAmountRule (id: string) {
  const pricingService = await initializePricingModule()

  await pricingService.deletePriceSetMoneyAmountRules([id])
}
```

#### Parameters

| Name | Description |
| :------ | :------ |
| `ids` | `string`[] | The IDs of the price set money amount rules to delete. |
| `sharedContext?` | [`Context`](Context.md) | A context used to share resources, such as transaction manager, between the application and the module. |

#### Returns

`Promise`<`void`\>

-`Promise`: Resolves once the price set money amount rules are deleted.

#### Defined in

packages/types/dist/pricing/service.d.ts:2314

___

### deleteRuleTypes

**deleteRuleTypes**(`ruleTypeIds`, `sharedContext?`): `Promise`<`void`\>

This method is used to delete rule types based on the provided IDs.

**Example**

```ts
import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function deleteRuleTypes (ruleTypeId: string) {
  const pricingService = await initializePricingModule()

  await pricingService.deleteRuleTypes([ruleTypeId])
}
```

#### Parameters

| Name | Description |
| :------ | :------ |
| `ruleTypeIds` | `string`[] | The IDs of the rule types to delete. |
| `sharedContext?` | [`Context`](Context.md) | A context used to share resources, such as transaction manager, between the application and the module. |

#### Returns

`Promise`<`void`\>

-`Promise`: Resolves once the rule types are deleted.

#### Defined in

packages/types/dist/pricing/service.d.ts:1784

___

### list

**list**(`filters?`, `config?`, `sharedContext?`): `Promise`<[`PriceSetDTO`](PriceSetDTO.md)[]\>

This method is used to retrieve a paginated list of price sets based on optional filters and configuration.

**Example**

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

You can also use the `$and` or `$or` properties of the `filter` parameter to use and/or conditions in your filters. For example:

```ts
import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrievePriceSets (priceSetIds: string[], moneyAmountIds: string[], skip: number, take: number) {
  const pricingService = await initializePricingModule()

  const priceSets = await pricingService.list(
    {
      $and: [
        {
          id: priceSetIds
        },
        {
          money_amounts: {
            id: moneyAmountIds
          }
        }
      ]
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

#### Parameters

| Name | Description |
| :------ | :------ |
| `filters?` | [`FilterablePriceSetProps`](FilterablePriceSetProps.md) | The filters to apply on the retrieved price lists. |
| `config?` | [`FindConfig`](FindConfig-1.md)<[`PriceSetDTO`](PriceSetDTO.md)\> | The configurations determining how the price sets are retrieved. Its properties, such as `select` or `relations`, accept the attributes or relations associated with a price set. |
| `sharedContext?` | [`Context`](Context.md) | A context used to share resources, such as transaction manager, between the application and the module. |

#### Returns

`Promise`<[`PriceSetDTO`](PriceSetDTO.md)[]\>

-`Promise`: The list of price sets.
	-`PriceSetDTO[]`: 
		-`id`: The ID of the price set.
		-`money_amounts`: (optional) The prices that belong to this price set.
		-`rule_types`: (optional) The rule types applied on this price set.

#### Defined in

packages/types/dist/pricing/service.d.ts:255

___

### listAndCount

**listAndCount**(`filters?`, `config?`, `sharedContext?`): `Promise`<[[`PriceSetDTO`](PriceSetDTO.md)[], `number`]\>

This method is used to retrieve a paginated list of price sets along with the total count of available price sets satisfying the provided filters.

**Example**

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

You can also use the `$and` or `$or` properties of the `filter` parameter to use and/or conditions in your filters. For example:

```ts
import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrievePriceSets (priceSetIds: string[], moneyAmountIds: string[], skip: number, take: number) {
  const pricingService = await initializePricingModule()

  const [priceSets, count] = await pricingService.listAndCount(
    {
      $and: [
        {
          id: priceSetIds
        },
        {
          money_amounts: {
            id: moneyAmountIds
          }
        }
      ]
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

#### Parameters

| Name | Description |
| :------ | :------ |
| `filters?` | [`FilterablePriceSetProps`](FilterablePriceSetProps.md) | The filters to apply on the retrieved price lists. |
| `config?` | [`FindConfig`](FindConfig-1.md)<[`PriceSetDTO`](PriceSetDTO.md)\> | The configurations determining how the price sets are retrieved. Its properties, such as `select` or `relations`, accept the attributes or relations associated with a price set. |
| `sharedContext?` | [`Context`](Context.md) | A context used to share resources, such as transaction manager, between the application and the module. |

#### Returns

`Promise`<[[`PriceSetDTO`](PriceSetDTO.md)[], `number`]\>

-`Promise`: The list of price sets along with their total count.
	-`PriceSetDTO[]`: 
	-`number`: (optional) 

#### Defined in

packages/types/dist/pricing/service.d.ts:370

___

### listAndCountCurrencies

**listAndCountCurrencies**(`filters?`, `config?`, `sharedContext?`): `Promise`<[[`CurrencyDTO`](CurrencyDTO.md)[], `number`]\>

This method is used to retrieve a paginated list of currencies along with the total count of available currencies satisfying the provided filters.

**Example**

To retrieve a list of currencies using their codes:

```ts
import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrieveCurrencies (codes: string[]) {
  const pricingService = await initializePricingModule()

  const [currencies, count] = await pricingService.listAndCountCurrencies(
    {
      code: codes
    },
  )

  // do something with the currencies or return them
}
```

To specify attributes that should be retrieved within the money amounts:

```ts
import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrieveCurrencies (codes: string[]) {
  const pricingService = await initializePricingModule()

  const [currencies, count] = await pricingService.listAndCountCurrencies(
    {
      code: codes
    },
    {
      select: ["symbol_native"]
    }
  )

  // do something with the currencies or return them
}
```

By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:

```ts
import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrieveCurrencies (codes: string[], skip: number, take: number) {
  const pricingService = await initializePricingModule()

  const [currencies, count] = await pricingService.listAndCountCurrencies(
    {
      code: codes
    },
    {
      select: ["symbol_native"],
      skip,
      take
    }
  )

  // do something with the currencies or return them
}
```

#### Parameters

| Name | Description |
| :------ | :------ |
| `filters?` | [`FilterableCurrencyProps`](FilterableCurrencyProps.md) | The filters to apply on the retrieved currencies. |
| `config?` | [`FindConfig`](FindConfig-1.md)<[`CurrencyDTO`](CurrencyDTO.md)\> | The configurations determining how the currencies are retrieved. Its properties, such as `select` or `relations`, accept the attributes or relations associated with a currency. |
| `sharedContext?` | [`Context`](Context.md) | A context used to share resources, such as transaction manager, between the application and the module. |

#### Returns

`Promise`<[[`CurrencyDTO`](CurrencyDTO.md)[], `number`]\>

-`Promise`: The list of currencies along with the total count.
	-`CurrencyDTO[]`: 
	-`number`: (optional) 

#### Defined in

packages/types/dist/pricing/service.d.ts:1377

___

### listAndCountMoneyAmounts

**listAndCountMoneyAmounts**(`filters?`, `config?`, `sharedContext?`): `Promise`<[[`MoneyAmountDTO`](MoneyAmountDTO.md)[], `number`]\>

This method is used to retrieve a paginated list of money amounts along with the total count of available money amounts satisfying the provided filters.

**Example**

To retrieve a list of money amounts using their IDs:

```ts
import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrieveMoneyAmounts (moneyAmountIds: string[]) {
  const pricingService = await initializePricingModule()

  const [moneyAmounts, count] = await pricingService.listAndCountMoneyAmounts(
    {
      id: moneyAmountIds
    }
  )

  // do something with the money amounts or return them
}
```

To specify relations that should be retrieved within the money amounts:

```ts
import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrieveMoneyAmounts (moneyAmountIds: string[]) {
  const pricingService = await initializePricingModule()

  const [moneyAmounts, count] = await pricingService.listAndCountMoneyAmounts(
    {
      id: moneyAmountIds
    },
    {
      relations: ["currency"]
    }
  )

  // do something with the money amounts or return them
}
```

By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:

```ts
import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrieveMoneyAmounts (moneyAmountIds: string[], skip: number, take: number) {
  const pricingService = await initializePricingModule()

  const [moneyAmounts, count] = await pricingService.listAndCountMoneyAmounts(
    {
      id: moneyAmountIds
    },
    {
      relations: ["currency"],
      skip,
      take
    }
  )

  // do something with the money amounts or return them
}
```

You can also use the `$and` or `$or` properties of the `filter` parameter to use and/or conditions in your filters. For example:

```ts
import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrieveMoneyAmounts (moneyAmountIds: string[], currencyCode: string[], skip: number, take: number) {
  const pricingService = await initializePricingModule()

  const [moneyAmounts, count] = await pricingService.listAndCountMoneyAmounts(
    {
      $and: [
        {
          id: moneyAmountIds
        },
        {
          currency_code: currencyCode
        }
      ]
    },
    {
      relations: ["currency"],
      skip,
      take
    }
  )

  // do something with the money amounts or return them
}
```

#### Parameters

| Name | Description |
| :------ | :------ |
| `filters?` | [`FilterableMoneyAmountProps`](FilterableMoneyAmountProps.md) | The filters to apply on the retrieved money amounts. |
| `config?` | [`FindConfig`](FindConfig-1.md)<[`MoneyAmountDTO`](MoneyAmountDTO.md)\> | The configurations determining how the money amounts are retrieved. Its properties, such as `select` or `relations`, accept the attributes or relations associated with a money amount. |
| `sharedContext?` | [`Context`](Context.md) | A context used to share resources, such as transaction manager, between the application and the module. |

#### Returns

`Promise`<[[`MoneyAmountDTO`](MoneyAmountDTO.md)[], `number`]\>

-`Promise`: The list of money amounts along with their total count.
	-`MoneyAmountDTO[]`: 
	-`number`: (optional) 

#### Defined in

packages/types/dist/pricing/service.d.ts:1085

___

### listAndCountPriceRules

**listAndCountPriceRules**(`filters?`, `config?`, `sharedContext?`): `Promise`<[[`PriceRuleDTO`](PriceRuleDTO.md)[], `number`]\>

This method is used to retrieve a paginated list of price rules along with the total count of available price rules satisfying the provided filters.

**Example**

To retrieve a list of price rules using their IDs:

```ts
import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrievePriceRules (id: string) {
  const pricingService = await initializePricingModule()

  const [priceRules, count] = await pricingService.listAndCountPriceRules({
    id: [id]
  })

  // do something with the price rules or return them
}
```

To specify relations that should be retrieved within the price rules:

```ts
import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrievePriceRules (id: string) {
  const pricingService = await initializePricingModule()

  const [priceRules, count] = await pricingService.listAndCountPriceRules({
    id: [id],
  }, {
    relations: ["price_set"]
  })

  // do something with the price rules or return them
}
```

By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:

```ts
import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrievePriceRules (id: string, skip: number, take: number) {
  const pricingService = await initializePricingModule()

  const [priceRules, count] = await pricingService.listAndCountPriceRules({
    id: [id],
  }, {
    relations: ["price_set"],
    skip,
    take
  })

  // do something with the price rules or return them
}
```

You can also use the `$and` or `$or` properties of the `filter` parameter to use and/or conditions in your filters. For example:

```ts
import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrievePriceRules (ids: string[], name: string[], skip: number, take: number) {
  const pricingService = await initializePricingModule()

  const [priceRules, count] = await pricingService.listAndCountPriceRules({
    $and: [
      {
        id: ids
      },
      {
        name
      }
    ]
  }, {
    relations: ["price_set"],
    skip,
    take
  })

  // do something with the price rules or return them
}
```

#### Parameters

| Name | Description |
| :------ | :------ |
| `filters?` | [`FilterablePriceRuleProps`](FilterablePriceRuleProps.md) | The filters to apply on the retrieved price rules. |
| `config?` | [`FindConfig`](FindConfig-1.md)<[`PriceRuleDTO`](PriceRuleDTO.md)\> | The configurations determining how the price rule is retrieved. Its properties, such as `select` or `relations`, accept the attributes or relations associated with a price rule. |
| `sharedContext?` | [`Context`](Context.md) | A context used to share resources, such as transaction manager, between the application and the module. |

#### Returns

`Promise`<[[`PriceRuleDTO`](PriceRuleDTO.md)[], `number`]\>

-`Promise`: The list of price rules along with their total count.
	-`PriceRuleDTO[]`: 
	-`number`: (optional) 

#### Defined in

packages/types/dist/pricing/service.d.ts:2564

___

### listAndCountPriceSetMoneyAmountRules

**listAndCountPriceSetMoneyAmountRules**(`filters?`, `config?`, `sharedContext?`): `Promise`<[[`PriceSetMoneyAmountRulesDTO`](PriceSetMoneyAmountRulesDTO.md)[], `number`]\>

This method is used to retrieve a paginated list of price set money amount rules along with the total count of
available price set money amount rules satisfying the provided filters.

**Example**

To retrieve a list of price set money amounts using their IDs:

```ts
import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrievePriceSetMoneyAmountRules (id: string) {
  const pricingService = await initializePricingModule()

  const [priceSetMoneyAmountRules, count] = await pricingService.listAndCountPriceSetMoneyAmountRules({
    id: [id]
  })

  // do something with the price set money amount rules or return them
}
```

To specify relations that should be retrieved within the price set money amount rules:

```ts
import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrievePriceSetMoneyAmountRules (id: string) {
  const pricingService = await initializePricingModule()

  const [priceSetMoneyAmountRules, count] = await pricingService.listAndCountPriceSetMoneyAmountRules({
    id: [id]
  }, {
    relations: ["price_set_money_amount"],
  })

  // do something with the price set money amount rules or return them
}
```

By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:

```ts
import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrievePriceSetMoneyAmountRules (id: string, skip: number, take: number) {
  const pricingService = await initializePricingModule()

  const [priceSetMoneyAmountRules, count] = await pricingService.listAndCountPriceSetMoneyAmountRules({
    id: [id]
  }, {
    relations: ["price_set_money_amount"],
    skip,
    take
  })

  // do something with the price set money amount rules or return them
}
```

You can also use the `$and` or `$or` properties of the `filter` parameter to use and/or conditions in your filters. For example:

```ts
import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrievePriceSetMoneyAmountRules (ids: string[], ruleTypeId: string[], skip: number, take: number) {
  const pricingService = await initializePricingModule()

  const [priceSetMoneyAmountRules, count] = await pricingService.listAndCountPriceSetMoneyAmountRules({
    $and: [
      {
        id: ids
      },
      {
        rule_type_id: ruleTypeId
      }
    ]
  }, {
    relations: ["price_set_money_amount"],
    skip,
    take
  })

  // do something with the price set money amount rules or return them
}
```

#### Parameters

| Name | Description |
| :------ | :------ |
| `filters?` | [`FilterablePriceSetMoneyAmountRulesProps`](FilterablePriceSetMoneyAmountRulesProps.md) | The filters to apply on the retrieved price set money amount rules. |
| `config?` | [`FindConfig`](FindConfig-1.md)<[`PriceSetMoneyAmountRulesDTO`](PriceSetMoneyAmountRulesDTO.md)\> | The configurations determining how the price set money amount rules are retrieved. Its properties, such as `select` or `relations`, accept the attributes or relations associated with a price set money amount rule. |
| `sharedContext?` | [`Context`](Context.md) | A context used to share resources, such as transaction manager, between the application and the module. |

#### Returns

`Promise`<[[`PriceSetMoneyAmountRulesDTO`](PriceSetMoneyAmountRulesDTO.md)[], `number`]\>

-`Promise`: The list of price set money amount rules and their total count.
	-`PriceSetMoneyAmountRulesDTO[]`: 
	-`number`: (optional) 

#### Defined in

packages/types/dist/pricing/service.d.ts:2035

___

### listAndCountPriceSetMoneyAmounts

**listAndCountPriceSetMoneyAmounts**(`filters?`, `config?`, `sharedContext?`): `Promise`<[[`PriceSetMoneyAmountDTO`](PriceSetMoneyAmountDTO.md)[], `number`]\>

This method is used to retrieve a paginated list of price set money amounts along with the total count of
available price set money amounts satisfying the provided filters.

**Example**

To retrieve a list of price set money amounts using their IDs:

```ts
import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrievePriceSetMoneyAmounts (id: string) {
  const pricingService = await initializePricingModule()

  const [priceSetMoneyAmounts, count] = await pricingService.listAndCountPriceSetMoneyAmounts({
    id: [id]
  })

  // do something with the price set money amounts or return them
}
```

To specify relations that should be retrieved within the price set money amounts:

```ts
import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrievePriceSetMoneyAmounts (id: string) {
  const pricingService = await initializePricingModule()

  const [priceSetMoneyAmounts, count] = await pricingService.listAndCountPriceSetMoneyAmounts({
    id: [id]
  }, {
    relations: ["price_rules"],
  })

  // do something with the price set money amounts or return them
}
```

By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:

```ts
import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrievePriceSetMoneyAmounts (id: string, skip: number, take: number) {
  const pricingService = await initializePricingModule()

  const [priceSetMoneyAmounts, count] = await pricingService.listAndCountPriceSetMoneyAmounts({
    id: [id]
  }, {
    relations: ["price_rules"],
    skip,
    take
  })

  // do something with the price set money amounts or return them
}
```

You can also use the `$and` or `$or` properties of the `filter` parameter to use and/or conditions in your filters. For example:

```ts
import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrievePriceSetMoneyAmounts (ids: string[], titles: string[], skip: number, take: number) {
  const pricingService = await initializePricingModule()

  const [priceSetMoneyAmounts, count] = await pricingService.listAndCountPriceSetMoneyAmounts({
    $and: [
      {
        id: ids
      },
      {
        title: titles
      }
    ]
  }, {
    relations: ["price_rules"],
    skip,
    take
  })

  // do something with the price set money amounts or return them
}
```

#### Parameters

| Name | Description |
| :------ | :------ |
| `filters?` | [`FilterablePriceSetMoneyAmountProps`](FilterablePriceSetMoneyAmountProps.md) | The filters to apply on the retrieved price set money amounts. |
| `config?` | [`FindConfig`](FindConfig-1.md)<[`PriceSetMoneyAmountDTO`](PriceSetMoneyAmountDTO.md)\> | The configurations determining how the price set money amounts are retrieved. Its properties, such as `select` or `relations`, accept the attributes or relations associated with a price set money amount. |
| `sharedContext?` | [`Context`](Context.md) | A context used to share resources, such as transaction manager, between the application and the module. |

#### Returns

`Promise`<[[`PriceSetMoneyAmountDTO`](PriceSetMoneyAmountDTO.md)[], `number`]\>

-`Promise`: The list of price set money amounts and their total count.
	-`PriceSetMoneyAmountDTO[]`: 
	-`number`: (optional) 

#### Defined in

packages/types/dist/pricing/service.d.ts:2240

___

### listAndCountRuleTypes

**listAndCountRuleTypes**(`filters?`, `config?`, `sharedContext?`): `Promise`<[[`RuleTypeDTO`](RuleTypeDTO.md)[], `number`]\>

This method is used to retrieve a paginated list of rule types along with the total count of available rule types satisfying the provided filters.

**Example**

To retrieve a list of rule types using their IDs:

```ts
import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrieveRuleTypes (ruleTypeId: string) {
  const pricingService = await initializePricingModule()

  const [ruleTypes, count] = await pricingService.listAndCountRuleTypes({
    id: [
      ruleTypeId
    ]
  })

  // do something with the rule types or return them
}
```

To specify attributes that should be retrieved within the rule types:

```ts
import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrieveRuleTypes (ruleTypeId: string) {
  const pricingService = await initializePricingModule()

  const [ruleTypes, count] = await pricingService.listAndCountRuleTypes({
    id: [
      ruleTypeId
    ]
  }, {
    select: ["name"]
  })

  // do something with the rule types or return them
}
```

By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:

```ts
import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrieveRuleTypes (ruleTypeId: string, skip: number, take: number) {
  const pricingService = await initializePricingModule()

  const [ruleTypes, count] = await pricingService.listAndCountRuleTypes({
    id: [
      ruleTypeId
    ]
  }, {
    select: ["name"],
    skip,
    take
  })

  // do something with the rule types or return them
}
```

You can also use the `$and` or `$or` properties of the `filter` parameter to use and/or conditions in your filters. For example:

```ts
import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrieveRuleTypes (ruleTypeId: string[], name: string[], skip: number, take: number) {
  const pricingService = await initializePricingModule()

  const [ruleTypes, count] = await pricingService.listAndCountRuleTypes({
    $and: [
      {
        id: ruleTypeId
      },
      {
        name
      }
    ]
  }, {
    select: ["name"],
    skip,
    take
  })

  // do something with the rule types or return them
}
```

#### Parameters

| Name | Description |
| :------ | :------ |
| `filters?` | [`FilterableRuleTypeProps`](FilterableRuleTypeProps.md) | The filters to apply on the retrieved rule types. |
| `config?` | [`FindConfig`](FindConfig-1.md)<[`RuleTypeDTO`](RuleTypeDTO.md)\> | The configurations determining how the rule types are retrieved. Its properties, such as `select` or `relations`, accept the attributes or relations associated with a rule type. |
| `sharedContext?` | [`Context`](Context.md) | A context used to share resources, such as transaction manager, between the application and the module. |

#### Returns

`Promise`<[[`RuleTypeDTO`](RuleTypeDTO.md)[], `number`]\>

-`Promise`: The list of rule types along with their total count.
	-`RuleTypeDTO[]`: 
	-`number`: (optional) 

#### Defined in

packages/types/dist/pricing/service.d.ts:1713

___

### listCurrencies

**listCurrencies**(`filters?`, `config?`, `sharedContext?`): `Promise`<[`CurrencyDTO`](CurrencyDTO.md)[]\>

This method is used to retrieve a paginated list of currencies based on optional filters and configuration.

**Example**

To retrieve a list of currencies using their codes:

```ts
import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrieveCurrencies (codes: string[]) {
  const pricingService = await initializePricingModule()

  const currencies = await pricingService.listCurrencies(
    {
      code: codes
    },
  )

  // do something with the currencies or return them
}
```

To specify attributes that should be retrieved within the money amounts:

```ts
import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrieveCurrencies (codes: string[]) {
  const pricingService = await initializePricingModule()

  const currencies = await pricingService.listCurrencies(
    {
      code: codes
    },
    {
      select: ["symbol_native"]
    }
  )

  // do something with the currencies or return them
}
```

By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:

```ts
import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrieveCurrencies (codes: string[], skip: number, take: number) {
  const pricingService = await initializePricingModule()

  const currencies = await pricingService.listCurrencies(
    {
      code: codes
    },
    {
      select: ["symbol_native"],
      skip,
      take
    }
  )

  // do something with the currencies or return them
}
```

#### Parameters

| Name | Description |
| :------ | :------ |
| `filters?` | [`FilterableCurrencyProps`](FilterableCurrencyProps.md) | The filters to apply on the retrieved currencies. |
| `config?` | [`FindConfig`](FindConfig-1.md)<[`CurrencyDTO`](CurrencyDTO.md)\> | The configurations determining how the currencies are retrieved. Its properties, such as `select` or `relations`, accept the attributes or relations associated with a currency. |
| `sharedContext?` | [`Context`](Context.md) | A context used to share resources, such as transaction manager, between the application and the module. |

#### Returns

`Promise`<[`CurrencyDTO`](CurrencyDTO.md)[]\>

-`Promise`: The list of currencies.
	-`CurrencyDTO[]`: 
		-`code`: The code of the currency.
		-`name`: (optional) The name of the currency.
		-`symbol`: (optional) The symbol of the currency.
		-`symbol_native`: (optional) The symbol of the currecy in its native form. This is typically the symbol used when displaying a price.

#### Defined in

packages/types/dist/pricing/service.d.ts:1296

___

### listMoneyAmounts

**listMoneyAmounts**(`filters?`, `config?`, `sharedContext?`): `Promise`<[`MoneyAmountDTO`](MoneyAmountDTO.md)[]\>

This method is used to retrieve a paginated list of money amounts based on optional filters and configuration.

**Example**

To retrieve a list of money amounts using their IDs:

```ts
import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrieveMoneyAmounts (moneyAmountIds: string[]) {
  const pricingService = await initializePricingModule()

  const moneyAmounts = await pricingService.listMoneyAmounts(
    {
      id: moneyAmountIds
    }
  )

  // do something with the money amounts or return them
}
```

To specify relations that should be retrieved within the money amounts:

```ts
import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrieveMoneyAmounts (moneyAmountIds: string[]) {
  const pricingService = await initializePricingModule()

  const moneyAmounts = await pricingService.listMoneyAmounts(
    {
      id: moneyAmountIds
    },
    {
      relations: ["currency"]
    }
  )

  // do something with the money amounts or return them
}
```

By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:

```ts
import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrieveMoneyAmounts (moneyAmountIds: string[], skip: number, take: number) {
  const pricingService = await initializePricingModule()

  const moneyAmounts = await pricingService.listMoneyAmounts(
    {
      id: moneyAmountIds
    },
    {
      relations: ["currency"],
      skip,
      take
    }
  )

  // do something with the money amounts or return them
}
```

You can also use the `$and` or `$or` properties of the `filter` parameter to use and/or conditions in your filters. For example:

```ts
import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrieveMoneyAmounts (moneyAmountIds: string[], currencyCode: string[], skip: number, take: number) {
  const pricingService = await initializePricingModule()

  const moneyAmounts = await pricingService.listMoneyAmounts(
    {
      $and: [
        {
          id: moneyAmountIds
        },
        {
          currency_code: currencyCode
        }
      ]
    },
    {
      relations: ["currency"],
      skip,
      take
    }
  )

  // do something with the money amounts or return them
}
```

#### Parameters

| Name | Description |
| :------ | :------ |
| `filters?` | [`FilterableMoneyAmountProps`](FilterableMoneyAmountProps.md) | The filtes to apply on the retrieved money amounts. |
| `config?` | [`FindConfig`](FindConfig-1.md)<[`MoneyAmountDTO`](MoneyAmountDTO.md)\> | The configurations determining how the money amounts are retrieved. Its properties, such as `select` or `relations`, accept the attributes or relations associated with a money amount. |
| `sharedContext?` | [`Context`](Context.md) | A context used to share resources, such as transaction manager, between the application and the module. |

#### Returns

`Promise`<[`MoneyAmountDTO`](MoneyAmountDTO.md)[]\>

-`Promise`: The list of money amounts.
	-`MoneyAmountDTO[]`: 
		-`amount`: (optional) The price of this money amount.
		-`currency`: (optional) The money amount's currency. Since this is a relation, it will only be retrieved if it's passed to the `relations` array of the find-configuration options.
		-`currency_code`: (optional) The currency code of this money amount.
		-`id`: The ID of the money amount.
		-`max_quantity`: (optional) The maximum quantity required to be purchased for this price to be applied.
		-`min_quantity`: (optional) The minimum quantity required to be purchased for this price to be applied.

#### Defined in

packages/types/dist/pricing/service.d.ts:972

___

### listPriceRules

**listPriceRules**(`filters?`, `config?`, `sharedContext?`): `Promise`<[`PriceRuleDTO`](PriceRuleDTO.md)[]\>

This method is used to retrieve a paginated list of price rules based on optional filters and configuration.

**Example**

To retrieve a list of price rules using their IDs:

```ts
import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrievePriceRules (id: string) {
  const pricingService = await initializePricingModule()

  const priceRules = await pricingService.listPriceRules({
    id: [id]
  })

  // do something with the price rules or return them
}
```

To specify relations that should be retrieved within the price rules:

```ts
import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrievePriceRules (id: string) {
  const pricingService = await initializePricingModule()

  const priceRules = await pricingService.listPriceRules({
    id: [id],
  }, {
    relations: ["price_set"]
  })

  // do something with the price rules or return them
}
```

By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:

```ts
import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrievePriceRules (id: string, skip: number, take: number) {
  const pricingService = await initializePricingModule()

  const priceRules = await pricingService.listPriceRules({
    id: [id],
  }, {
    relations: ["price_set"],
    skip,
    take
  })

  // do something with the price rules or return them
}
```

You can also use the `$and` or `$or` properties of the `filter` parameter to use and/or conditions in your filters. For example:

```ts
import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrievePriceRules (ids: string[], name: string[], skip: number, take: number) {
  const pricingService = await initializePricingModule()

  const priceRules = await pricingService.listPriceRules({
    $and: [
      {
        id: ids
      },
      {
        name
      }
    ]
  }, {
    relations: ["price_set"],
    skip,
    take
  })

  // do something with the price rules or return them
}
```

#### Parameters

| Name | Description |
| :------ | :------ |
| `filters?` | [`FilterablePriceRuleProps`](FilterablePriceRuleProps.md) | The filters to apply on the retrieved price rules. |
| `config?` | [`FindConfig`](FindConfig-1.md)<[`PriceRuleDTO`](PriceRuleDTO.md)\> | The configurations determining how the price rule is retrieved. Its properties, such as `select` or `relations`, accept the attributes or relations associated with a price rule. |
| `sharedContext?` | [`Context`](Context.md) | A context used to share resources, such as transaction manager, between the application and the module. |

#### Returns

`Promise`<[`PriceRuleDTO`](PriceRuleDTO.md)[]\>

-`Promise`: The list of price rules.
	-`PriceRuleDTO[]`: 
		-`id`: The ID of the price rule.
		-`price_list_id`: The ID of the associated price list.
		-`price_set`: The associated price set. It may only be available if the relation `price_set` is expanded.
		-`price_set_id`: The ID of the associated price set.
		-`price_set_money_amount_id`: The ID of the associated price set money amount.
		-`priority`: The priority of the price rule in comparison to other applicable price rules.
		-`rule_type`: The associated rule type. It may only be available if the relation `rule_type` is expanded.
		-`rule_type_id`: The ID of the associated rule type.
		-`value`: The value of the price rule.

#### Defined in

packages/types/dist/pricing/service.d.ts:2462

___

### listPriceSetMoneyAmountRules

**listPriceSetMoneyAmountRules**(`filters?`, `config?`, `sharedContext?`): `Promise`<[`PriceSetMoneyAmountRulesDTO`](PriceSetMoneyAmountRulesDTO.md)[]\>

This method is used to retrieve a paginated list of price set money amount rules based on optional filters and configuration.

**Example**

To retrieve a list of price set money amount rules using their IDs:

```ts
import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrievePriceSetMoneyAmountRules (id: string) {
  const pricingService = await initializePricingModule()

  const priceSetMoneyAmountRules = await pricingService.listPriceSetMoneyAmountRules({
    id: [id]
  })

  // do something with the price set money amount rules or return them
}
```

To specify relations that should be retrieved within the price set money amount rules:

```ts
import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrievePriceSetMoneyAmountRules (id: string) {
  const pricingService = await initializePricingModule()

  const priceSetMoneyAmountRules = await pricingService.listPriceSetMoneyAmountRules({
    id: [id]
  }, {
    relations: ["price_set_money_amount"]
  })

  // do something with the price set money amount rules or return them
}
```

By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:

```ts
import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrievePriceSetMoneyAmountRules (id: string, skip: number, take: number) {
  const pricingService = await initializePricingModule()

  const priceSetMoneyAmountRules = await pricingService.listPriceSetMoneyAmountRules({
    id: [id]
  }, {
    relations: ["price_set_money_amount"],
    skip,
    take
  })

  // do something with the price set money amount rules or return them
}
```

You can also use the `$and` or `$or` properties of the `filter` parameter to use and/or conditions in your filters. For example:

```ts
import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrievePriceSetMoneyAmountRules (ids: string[], ruleTypeId: string[], skip: number, take: number) {
  const pricingService = await initializePricingModule()

  const priceSetMoneyAmountRules = await pricingService.listPriceSetMoneyAmountRules({
    $and: [
      {
        id: ids
      },
      {
        rule_type_id: ruleTypeId
      }
    ]
  }, {
    relations: ["price_set_money_amount"],
    skip,
    take
  })

  // do something with the price set money amount rules or return them
}
```

#### Parameters

| Name | Description |
| :------ | :------ |
| `filters?` | [`FilterablePriceSetMoneyAmountRulesProps`](FilterablePriceSetMoneyAmountRulesProps.md) | The filters to apply on the retrieved price set money amount rules. |
| `config?` | [`FindConfig`](FindConfig-1.md)<[`PriceSetMoneyAmountRulesDTO`](PriceSetMoneyAmountRulesDTO.md)\> | The configurations determining how the price set money amount rules are retrieved. Its properties, such as `select` or `relations`, accept the attributes or relations associated with a price set money amount rule. |
| `sharedContext?` | [`Context`](Context.md) | A context used to share resources, such as transaction manager, between the application and the module. |

#### Returns

`Promise`<[`PriceSetMoneyAmountRulesDTO`](PriceSetMoneyAmountRulesDTO.md)[]\>

-`Promise`: The list of price set money amount rules.
	-`PriceSetMoneyAmountRulesDTO[]`: 
		-`id`: The ID of the price set money amount.
		-`price_set_money_amount`: The associated price set money amount. It may only be available if the relation `price_set_money_amount` is expanded.
		-`rule_type`: The associated rule type. It may only be available if the relation `rule_type` is expanded.
		-`value`: The value of the price set money amount rule.

#### Defined in

packages/types/dist/pricing/service.d.ts:1932

___

### listPriceSetMoneyAmounts

**listPriceSetMoneyAmounts**(`filters?`, `config?`, `sharedContext?`): `Promise`<[`PriceSetMoneyAmountDTO`](PriceSetMoneyAmountDTO.md)[]\>

This method is used to retrieve a paginated list of price set money amounts based on optional filters and configuration.

**Example**

To retrieve a list of price set money amounts using their IDs:

```ts
import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrievePriceSetMoneyAmounts (id: string) {
  const pricingService = await initializePricingModule()

  const priceSetMoneyAmounts = await pricingService.listPriceSetMoneyAmounts({
    id: [id]
  })

  // do something with the price set money amounts or return them
}
```

To specify relations that should be retrieved within the price set money amounts:

```ts
import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrievePriceSetMoneyAmounts (id: string) {
  const pricingService = await initializePricingModule()

  const priceSetMoneyAmounts = await pricingService.listPriceSetMoneyAmounts({
    id: [id]
  }, {
    relations: ["price_rules"]
  })

  // do something with the price set money amounts or return them
}
```

By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:

```ts
import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrievePriceSetMoneyAmounts (id: string, skip: number, take: number) {
  const pricingService = await initializePricingModule()

  const priceSetMoneyAmounts = await pricingService.listPriceSetMoneyAmounts({
    id: [id]
  }, {
    relations: ["price_rules"],
    skip,
    take
  })

  // do something with the price set money amounts or return them
}
```

You can also use the `$and` or `$or` properties of the `filter` parameter to use and/or conditions in your filters. For example:

```ts
import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrievePriceSetMoneyAmounts (ids: string[], titles: string[], skip: number, take: number) {
  const pricingService = await initializePricingModule()

  const priceSetMoneyAmounts = await pricingService.listPriceSetMoneyAmounts({
    $and: [
      {
        id: ids
      },
      {
        title: titles
      }
    ]
  }, {
    relations: ["price_rules"],
    skip,
    take
  })

  // do something with the price set money amounts or return them
}
```

#### Parameters

| Name | Description |
| :------ | :------ |
| `filters?` | [`FilterablePriceSetMoneyAmountProps`](FilterablePriceSetMoneyAmountProps.md) | The filters to apply on the retrieved price set money amounts. |
| `config?` | [`FindConfig`](FindConfig-1.md)<[`PriceSetMoneyAmountDTO`](PriceSetMoneyAmountDTO.md)\> | The configurations determining how the price set money amounts are retrieved. Its properties, such as `select` or `relations`, accept the attributes or relations associated with a price set money amount. |
| `sharedContext?` | [`Context`](Context.md) | A context used to share resources, such as transaction manager, between the application and the module. |

#### Returns

`Promise`<[`PriceSetMoneyAmountDTO`](PriceSetMoneyAmountDTO.md)[]\>

-`Promise`: The list of price set money amounts.
	-`PriceSetMoneyAmountDTO[]`: 
		-`id`: The ID of a price set money amount.
		-`money_amount`: (optional) The money amount associated with the price set money amount. It may only be available if the relation `money_amount` is expanded.
		-`price_rules`: (optional) 
		-`price_set`: (optional) The price set associated with the price set money amount. It may only be available if the relation `price_set` is expanded.
		-`price_set_id`: (optional) 
		-`title`: (optional) The title of the price set money amount.

#### Defined in

packages/types/dist/pricing/service.d.ts:2137

___

### listRuleTypes

**listRuleTypes**(`filters?`, `config?`, `sharedContext?`): `Promise`<[`RuleTypeDTO`](RuleTypeDTO.md)[]\>

This method is used to retrieve a paginated list of rule types based on optional filters and configuration.

**Example**

To retrieve a list of rule types using their IDs:

```ts
import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrieveRuleTypes (ruleTypeId: string) {
  const pricingService = await initializePricingModule()

  const ruleTypes = await pricingService.listRuleTypes({
    id: [
      ruleTypeId
    ]
  })

  // do something with the rule types or return them
}
```

To specify attributes that should be retrieved within the rule types:

```ts
import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrieveRuleTypes (ruleTypeId: string) {
  const pricingService = await initializePricingModule()

  const ruleTypes = await pricingService.listRuleTypes({
    id: [
      ruleTypeId
    ]
  }, {
    select: ["name"]
  })

  // do something with the rule types or return them
}
```

By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:

```ts
import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrieveRuleTypes (ruleTypeId: string, skip: number, take: number) {
  const pricingService = await initializePricingModule()

  const ruleTypes = await pricingService.listRuleTypes({
    id: [
      ruleTypeId
    ]
  }, {
    select: ["name"],
    skip,
    take
  })

  // do something with the rule types or return them
}
```

You can also use the `$and` or `$or` properties of the `filter` parameter to use and/or conditions in your filters. For example:

```ts
import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrieveRuleTypes (ruleTypeId: string[], name: string[], skip: number, take: number) {
  const pricingService = await initializePricingModule()

  const ruleTypes = await pricingService.listRuleTypes({
    $and: [
      {
        id: ruleTypeId
      },
      {
        name
      }
    ]
  }, {
    select: ["name"],
    skip,
    take
  })

  // do something with the rule types or return them
}
```

#### Parameters

| Name | Description |
| :------ | :------ |
| `filters?` | [`FilterableRuleTypeProps`](FilterableRuleTypeProps.md) | The filters to apply on the retrieved rule types. |
| `config?` | [`FindConfig`](FindConfig-1.md)<[`RuleTypeDTO`](RuleTypeDTO.md)\> | The configurations determining how the rule types are retrieved. Its properties, such as `select` or `relations`, accept the attributes or relations associated with a rule type. |
| `sharedContext?` | [`Context`](Context.md) | A context used to share resources, such as transaction manager, between the application and the module. |

#### Returns

`Promise`<[`RuleTypeDTO`](RuleTypeDTO.md)[]\>

-`Promise`: The list of rule types.
	-`RuleTypeDTO[]`: 
		-`default_priority`: The priority of the rule type. This is useful when calculating the price of a price set, and multiple rules satisfy the provided context. The higher the value, the higher the priority of the rule type.
		-`id`: The ID of the rule type.
		-`name`: The display name of the rule type.
		-`rule_attribute`: The unique name used to later identify the rule_attribute. For example, it can be used in the `context` parameter of the `calculatePrices` method to specify a rule for calculating the price.

#### Defined in

packages/types/dist/pricing/service.d.ts:1605

___

### removeRules

**removeRules**(`data`, `sharedContext?`): `Promise`<`void`\>

This method remove rules from a price set.

**Example**

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

#### Parameters

| Name | Description |
| :------ | :------ |
| `data` | [`RemovePriceSetRulesDTO`](RemovePriceSetRulesDTO.md)[] | The rules to remove per price set. |
| `sharedContext?` | [`Context`](Context.md) | A context used to share resources, such as transaction manager, between the application and the module. |

#### Returns

`Promise`<`void`\>

-`Promise`: Resolves when rules are successfully removed.

#### Defined in

packages/types/dist/pricing/service.d.ts:579

___

### retrieve

**retrieve**(`id`, `config?`, `sharedContext?`): `Promise`<[`PriceSetDTO`](PriceSetDTO.md)\>

This method is used to retrieves a price set by its ID.

**Example**

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

#### Parameters

| Name | Description |
| :------ | :------ |
| `id` | `string` | The ID of the price set to retrieve. |
| `config?` | [`FindConfig`](FindConfig-1.md)<[`PriceSetDTO`](PriceSetDTO.md)\> | The configurations determining how the price set is retrieved. Its properties, such as `select` or `relations`, accept the attributes or relations associated with a price set. |
| `sharedContext?` | [`Context`](Context.md) | A context used to share resources, such as transaction manager, between the application and the module. |

#### Returns

`Promise`<[`PriceSetDTO`](PriceSetDTO.md)\>

-`Promise`: The retrieved price set.
	-`id`: The ID of the price set.
	-`money_amounts`: (optional) The prices that belong to this price set.
		-`amount`: (optional) The price of this money amount.
		-`currency`: (optional) The money amount's currency. Since this is a relation, it will only be retrieved if it's passed to the `relations` array of the find-configuration options.
		-`currency_code`: (optional) The currency code of this money amount.
		-`id`: The ID of the money amount.
		-`max_quantity`: (optional) The maximum quantity required to be purchased for this price to be applied.
		-`min_quantity`: (optional) The minimum quantity required to be purchased for this price to be applied.
	-`rule_types`: (optional) The rule types applied on this price set.
		-`default_priority`: The priority of the rule type. This is useful when calculating the price of a price set, and multiple rules satisfy the provided context. The higher the value, the higher the priority of the rule type.
		-`id`: The ID of the rule type.
		-`name`: The display name of the rule type.
		-`rule_attribute`: The unique name used to later identify the rule_attribute. For example, it can be used in the `context` parameter of the `calculatePrices` method to specify a rule for calculating the price.

#### Defined in

packages/types/dist/pricing/service.d.ts:140

___

### retrieveCurrency

**retrieveCurrency**(`code`, `config?`, `sharedContext?`): `Promise`<[`CurrencyDTO`](CurrencyDTO.md)\>

This method retrieves a currency by its code and and optionally based on the provided configurations.

**Example**

A simple example that retrieves a currency by its code:

```ts
import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrieveCurrency (code: string) {
  const pricingService = await initializePricingModule()

  const currency = await pricingService.retrieveCurrency(
    code
  )

  // do something with the currency or return it
}
```

To specify attributes that should be retrieved:

```ts
import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrieveCurrency (code: string) {
  const pricingService = await initializePricingModule()

  const currency = await pricingService.retrieveCurrency(
    code,
    {
      select: ["symbol_native"]
    }
  )

  // do something with the currency or return it
}
```

#### Parameters

| Name | Description |
| :------ | :------ |
| `code` | `string` | The code of the currency to retrieve. |
| `config?` | [`FindConfig`](FindConfig-1.md)<[`CurrencyDTO`](CurrencyDTO.md)\> | The configurations determining how the currency is retrieved. Its properties, such as `select` or `relations`, accept the attributes or relations associated with a currency. |
| `sharedContext?` | [`Context`](Context.md) | A context used to share resources, such as transaction manager, between the application and the module. |

#### Returns

`Promise`<[`CurrencyDTO`](CurrencyDTO.md)\>

-`Promise`: The retrieved currency.
	-`code`: The code of the currency.
	-`name`: (optional) The name of the currency.
	-`symbol`: (optional) The symbol of the currency.
	-`symbol_native`: (optional) The symbol of the currecy in its native form. This is typically the symbol used when displaying a price.

#### Defined in

packages/types/dist/pricing/service.d.ts:1215

___

### retrieveMoneyAmount

**retrieveMoneyAmount**(`id`, `config?`, `sharedContext?`): `Promise`<[`MoneyAmountDTO`](MoneyAmountDTO.md)\>

This method retrieves a money amount by its ID.

**Example**

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

#### Parameters

| Name | Description |
| :------ | :------ |
| `id` | `string` | The ID of the money amount to retrieve. |
| `config?` | [`FindConfig`](FindConfig-1.md)<[`MoneyAmountDTO`](MoneyAmountDTO.md)\> | The configurations determining how a money amount is retrieved. Its properties, such as `select` or `relations`, accept the attributes or relations associated with a money amount. |
| `sharedContext?` | [`Context`](Context.md) | A context used to share resources, such as transaction manager, between the application and the module. |

#### Returns

`Promise`<[`MoneyAmountDTO`](MoneyAmountDTO.md)\>

-`Promise`: The retrieved money amount.
	-`amount`: (optional) The price of this money amount.
	-`currency`: (optional) The money amount's currency. Since this is a relation, it will only be retrieved if it's passed to the `relations` array of the find-configuration options.
		-`code`: The code of the currency.
		-`name`: (optional) The name of the currency.
		-`symbol`: (optional) The symbol of the currency.
		-`symbol_native`: (optional) The symbol of the currecy in its native form. This is typically the symbol used when displaying a price.
	-`currency_code`: (optional) The currency code of this money amount.
	-`id`: The ID of the money amount.
	-`max_quantity`: (optional) The maximum quantity required to be purchased for this price to be applied.
	-`min_quantity`: (optional) The minimum quantity required to be purchased for this price to be applied.

#### Defined in

packages/types/dist/pricing/service.d.ts:859

___

### retrievePriceRule

**retrievePriceRule**(`id`, `config?`, `sharedContext?`): `Promise`<[`PriceRuleDTO`](PriceRuleDTO.md)\>

This method is used to retrieve a price rule by its ID.

**Example**

A simple example that retrieves a price rule by its ID:

```ts
import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrievePriceRule (id: string) {
  const pricingService = await initializePricingModule()

  const priceRule = await pricingService.retrievePriceRule(id)

  // do something with the price rule or return it
}
```

To specify relations that should be retrieved:

```ts
import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrievePriceRule (id: string) {
  const pricingService = await initializePricingModule()

  const priceRule = await pricingService.retrievePriceRule(id, {
    relations: ["price_set"]
  })

  // do something with the price rule or return it
}
```

#### Parameters

| Name | Description |
| :------ | :------ |
| `id` | `string` | The ID of the price rule to retrieve. |
| `config?` | [`FindConfig`](FindConfig-1.md)<[`PriceRuleDTO`](PriceRuleDTO.md)\> | The configurations determining how the price rule is retrieved. Its properties, such as `select` or `relations`, accept the attributes or relations associated with a price rule. |
| `sharedContext?` | [`Context`](Context.md) | A context used to share resources, such as transaction manager, between the application and the module. |

#### Returns

`Promise`<[`PriceRuleDTO`](PriceRuleDTO.md)\>

-`Promise`: The retrieved price rule.
	-`id`: The ID of the price rule.
	-`price_list_id`: The ID of the associated price list.
	-`price_set`: The associated price set. It may only be available if the relation `price_set` is expanded.
		-`id`: The ID of the price set.
		-`money_amounts`: (optional) The prices that belong to this price set.
		-`rule_types`: (optional) The rule types applied on this price set.
	-`price_set_id`: The ID of the associated price set.
	-`price_set_money_amount_id`: The ID of the associated price set money amount.
	-`priority`: The priority of the price rule in comparison to other applicable price rules.
	-`rule_type`: The associated rule type. It may only be available if the relation `rule_type` is expanded.
		-`default_priority`: The priority of the rule type. This is useful when calculating the price of a price set, and multiple rules satisfy the provided context. The higher the value, the higher the priority of the rule type.
		-`id`: The ID of the rule type.
		-`name`: The display name of the rule type.
		-`rule_attribute`: The unique name used to later identify the rule_attribute. For example, it can be used in the `context` parameter of the `calculatePrices` method to specify a rule for calculating the price.
	-`rule_type_id`: The ID of the associated rule type.
	-`value`: The value of the price rule.

#### Defined in

packages/types/dist/pricing/service.d.ts:2360

___

### retrievePriceSetMoneyAmountRules

**retrievePriceSetMoneyAmountRules**(`id`, `config?`, `sharedContext?`): `Promise`<[`PriceSetMoneyAmountRulesDTO`](PriceSetMoneyAmountRulesDTO.md)\>

This method is used to a price set money amount rule by its ID based on the provided configuration.

**Example**

A simple example that retrieves a price set money amount rule by its ID:

```ts
import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrievePriceSetMoneyAmountRule (id: string) {
  const pricingService = await initializePricingModule()

  const priceSetMoneyAmountRule = await pricingService.retrievePriceSetMoneyAmountRules(id)

  // do something with the price set money amount rule or return it
}
```

To specify relations that should be retrieved:

```ts
import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrievePriceSetMoneyAmountRule (id: string) {
  const pricingService = await initializePricingModule()

  const priceSetMoneyAmountRule = await pricingService.retrievePriceSetMoneyAmountRules(id, {
    relations: ["price_set_money_amount"]
  })

  // do something with the price set money amount rule or return it
}
```

#### Parameters

| Name | Description |
| :------ | :------ |
| `id` | `string` | The ID of the price set money amount rule to retrieve. |
| `config?` | [`FindConfig`](FindConfig-1.md)<[`PriceSetMoneyAmountRulesDTO`](PriceSetMoneyAmountRulesDTO.md)\> | The configurations determining how the price set money amount rule is retrieved. Its properties, such as `select` or `relations`, accept the attributes or relations associated with a price set money amount rule. |
| `sharedContext?` | [`Context`](Context.md) | A context used to share resources, such as transaction manager, between the application and the module. |

#### Returns

`Promise`<[`PriceSetMoneyAmountRulesDTO`](PriceSetMoneyAmountRulesDTO.md)\>

-`Promise`: The retrieved price set money amount rule.
	-`id`: The ID of the price set money amount.
	-`price_set_money_amount`: The associated price set money amount. It may only be available if the relation `price_set_money_amount` is expanded.
		-`id`: The ID of a price set money amount.
		-`money_amount`: (optional) The money amount associated with the price set money amount. It may only be available if the relation `money_amount` is expanded.
		-`price_rules`: (optional) 
		-`price_set`: (optional) The price set associated with the price set money amount. It may only be available if the relation `price_set` is expanded.
		-`price_set_id`: (optional) 
		-`title`: (optional) The title of the price set money amount.
	-`rule_type`: The associated rule type. It may only be available if the relation `rule_type` is expanded.
		-`default_priority`: The priority of the rule type. This is useful when calculating the price of a price set, and multiple rules satisfy the provided context. The higher the value, the higher the priority of the rule type.
		-`id`: The ID of the rule type.
		-`name`: The display name of the rule type.
		-`rule_attribute`: The unique name used to later identify the rule_attribute. For example, it can be used in the `context` parameter of the `calculatePrices` method to specify a rule for calculating the price.
	-`value`: The value of the price set money amount rule.

#### Defined in

packages/types/dist/pricing/service.d.ts:1830

___

### retrieveRuleType

**retrieveRuleType**(`id`, `config?`, `sharedContext?`): `Promise`<[`RuleTypeDTO`](RuleTypeDTO.md)\>

This method is used to retrieve a rule type by its ID and and optionally based on the provided configurations.

**Example**

A simple example that retrieves a rule type by its code:

```ts
import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrieveRuleType (ruleTypeId: string) {
  const pricingService = await initializePricingModule()

  const ruleType = await pricingService.retrieveRuleType(ruleTypeId)

  // do something with the rule type or return it
}
```

To specify attributes that should be retrieved:

```ts
import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function retrieveRuleType (ruleTypeId: string) {
  const pricingService = await initializePricingModule()

  const ruleType = await pricingService.retrieveRuleType(ruleTypeId, {
    select: ["name"]
  })

  // do something with the rule type or return it
}
```

#### Parameters

| Name | Description |
| :------ | :------ |
| `id` | `string` | The ID of the rule type to retrieve. |
| `config?` | [`FindConfig`](FindConfig-1.md)<[`RuleTypeDTO`](RuleTypeDTO.md)\> | The configurations determining how the rule type is retrieved. Its properties, such as `select` or `relations`, accept the attributes or relations associated with a rule type. |
| `sharedContext?` | [`Context`](Context.md) | A context used to share resources, such as transaction manager, between the application and the module. |

#### Returns

`Promise`<[`RuleTypeDTO`](RuleTypeDTO.md)\>

-`Promise`: The retrieved rule type.
	-`default_priority`: The priority of the rule type. This is useful when calculating the price of a price set, and multiple rules satisfy the provided context. The higher the value, the higher the priority of the rule type.
	-`id`: The ID of the rule type.
	-`name`: The display name of the rule type.
	-`rule_attribute`: The unique name used to later identify the rule_attribute. For example, it can be used in the `context` parameter of the `calculatePrices` method to specify a rule for calculating the price.

#### Defined in

packages/types/dist/pricing/service.d.ts:1497

___

### updateCurrencies

**updateCurrencies**(`data`, `sharedContext?`): `Promise`<[`CurrencyDTO`](CurrencyDTO.md)[]\>

This method is used to update existing currencies with the provided data. In each currency object, the currency code must be provided to identify which currency to update.

**Example**

```ts
import { initialize as initializePricingModule } from "@medusajs/pricing"

async function updateCurrencies() {
  const pricingService = await initializePricingModule()

  const currencies = await pricingService.updateCurrencies([
    {
      code: "USD",
      symbol: "$",
    },
  ])

  // do something with the currencies or return them
}
```

#### Parameters

| Name | Description |
| :------ | :------ |
| `data` | [`UpdateCurrencyDTO`](UpdateCurrencyDTO.md)[] | The currencies to update, each having the attributes that should be updated in a currency. |
| `sharedContext?` | [`Context`](Context.md) | A context used to share resources, such as transaction manager, between the application and the module. |

#### Returns

`Promise`<[`CurrencyDTO`](CurrencyDTO.md)[]\>

-`Promise`: The list of updated currencies.
	-`CurrencyDTO[]`: 
		-`code`: The code of the currency.
		-`name`: (optional) The name of the currency.
		-`symbol`: (optional) The symbol of the currency.
		-`symbol_native`: (optional) The symbol of the currecy in its native form. This is typically the symbol used when displaying a price.

#### Defined in

packages/types/dist/pricing/service.d.ts:1431

___

### updateMoneyAmounts

**updateMoneyAmounts**(`data`, `sharedContext?`): `Promise`<[`MoneyAmountDTO`](MoneyAmountDTO.md)[]\>

This method updates existing money amounts.

**Example**

```ts
import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function updateMoneyAmounts (moneyAmountId: string, amount: number) {
  const pricingService = await initializePricingModule()

  const moneyAmounts = await pricingService.updateMoneyAmounts([
    {
      id: moneyAmountId,
      amount
    }
  ])

  // do something with the money amounts or return them
}
```

#### Parameters

| Name | Description |
| :------ | :------ |
| `data` | [`UpdateMoneyAmountDTO`](UpdateMoneyAmountDTO.md)[] | The money amounts to update, each having the attributes that should be updated in a money amount. |
| `sharedContext?` | [`Context`](Context.md) | A context used to share resources, such as transaction manager, between the application and the module. |

#### Returns

`Promise`<[`MoneyAmountDTO`](MoneyAmountDTO.md)[]\>

-`Promise`: The list of updated money amounts.
	-`MoneyAmountDTO[]`: 
		-`amount`: (optional) The price of this money amount.
		-`currency`: (optional) The money amount's currency. Since this is a relation, it will only be retrieved if it's passed to the `relations` array of the find-configuration options.
		-`currency_code`: (optional) The currency code of this money amount.
		-`id`: The ID of the money amount.
		-`max_quantity`: (optional) The maximum quantity required to be purchased for this price to be applied.
		-`min_quantity`: (optional) The minimum quantity required to be purchased for this price to be applied.

#### Defined in

packages/types/dist/pricing/service.d.ts:1143

___

### updatePriceRules

**updatePriceRules**(`data`, `sharedContext?`): `Promise`<[`PriceRuleDTO`](PriceRuleDTO.md)[]\>

This method is used to update price rules, each with their provided data.

**Example**

```ts
import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function updatePriceRules (
  id: string,
  priceSetId: string,
) {
  const pricingService = await initializePricingModule()

  const priceRules = await pricingService.updatePriceRules([
    {
      id,
      price_set_id: priceSetId,
    }
  ])

  // do something with the price rules or return them
}
```

#### Parameters

| Name | Description |
| :------ | :------ |
| `data` | [`UpdatePriceRuleDTO`](UpdatePriceRuleDTO.md)[] | The price rules to update, each having attributes that should be updated in a price rule. |
| `sharedContext?` | [`Context`](Context.md) | A context used to share resources, such as transaction manager, between the application and the module. |

#### Returns

`Promise`<[`PriceRuleDTO`](PriceRuleDTO.md)[]\>

-`Promise`: The list of updated price rules.
	-`PriceRuleDTO[]`: 
		-`id`: The ID of the price rule.
		-`price_list_id`: The ID of the associated price list.
		-`price_set`: The associated price set. It may only be available if the relation `price_set` is expanded.
		-`price_set_id`: The ID of the associated price set.
		-`price_set_money_amount_id`: The ID of the associated price set money amount.
		-`priority`: The priority of the price rule in comparison to other applicable price rules.
		-`rule_type`: The associated rule type. It may only be available if the relation `rule_type` is expanded.
		-`rule_type_id`: The ID of the associated rule type.
		-`value`: The value of the price rule.

#### Defined in

packages/types/dist/pricing/service.d.ts:2630

___

### updatePriceSetMoneyAmountRules

**updatePriceSetMoneyAmountRules**(`data`, `sharedContext?`): `Promise`<[`PriceSetMoneyAmountRulesDTO`](PriceSetMoneyAmountRulesDTO.md)[]\>

This method is used to update price set money amount rules, each with their provided data.

**Example**

```ts
import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function updatePriceSetMoneyAmountRules (id: string, value: string) {
  const pricingService = await initializePricingModule()

  const priceSetMoneyAmountRules = await pricingService.updatePriceSetMoneyAmountRules([
    {
      id,
      value
    }
  ])

  // do something with the price set money amount rules or return them
}
```

#### Parameters

| Name | Description |
| :------ | :------ |
| `data` | [`UpdatePriceSetMoneyAmountRulesDTO`](UpdatePriceSetMoneyAmountRulesDTO.md)[] | The price set money amounts to update, each having the attributes to update in a price set money amount. |
| `sharedContext?` | [`Context`](Context.md) | A context used to share resources, such as transaction manager, between the application and the module. |

#### Returns

`Promise`<[`PriceSetMoneyAmountRulesDTO`](PriceSetMoneyAmountRulesDTO.md)[]\>

-`Promise`: The list of updated price set money amount rules.
	-`PriceSetMoneyAmountRulesDTO[]`: 
		-`id`: The ID of the price set money amount.
		-`price_set_money_amount`: The associated price set money amount. It may only be available if the relation `price_set_money_amount` is expanded.
		-`rule_type`: The associated rule type. It may only be available if the relation `rule_type` is expanded.
		-`value`: The value of the price set money amount rule.

#### Defined in

packages/types/dist/pricing/service.d.ts:2295

___

### updateRuleTypes

**updateRuleTypes**(`data`, `sharedContext?`): `Promise`<[`RuleTypeDTO`](RuleTypeDTO.md)[]\>

This method is used to update existing rule types with the provided data.

**Example**

```ts
import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

async function updateRuleTypes (ruleTypeId: string) {
  const pricingService = await initializePricingModule()

  const ruleTypes = await pricingService.updateRuleTypes([
    {
      id: ruleTypeId,
      name: "Region",
    }
  ])

  // do something with the rule types or return them
}
```

#### Parameters

| Name | Description |
| :------ | :------ |
| `data` | [`UpdateRuleTypeDTO`](UpdateRuleTypeDTO.md)[] | The rule types to update, each having the attributes that should be updated in a rule type. |
| `sharedContext?` | [`Context`](Context.md) | A context used to share resources, such as transaction manager, between the application and the module. |

#### Returns

`Promise`<[`RuleTypeDTO`](RuleTypeDTO.md)[]\>

-`Promise`: The list of updated rule types.
	-`RuleTypeDTO[]`: 
		-`default_priority`: The priority of the rule type. This is useful when calculating the price of a price set, and multiple rules satisfy the provided context. The higher the value, the higher the priority of the rule type.
		-`id`: The ID of the rule type.
		-`name`: The display name of the rule type.
		-`rule_attribute`: The unique name used to later identify the rule_attribute. For example, it can be used in the `context` parameter of the `calculatePrices` method to specify a rule for calculating the price.

#### Defined in

packages/types/dist/pricing/service.d.ts:1765
