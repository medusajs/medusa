---
displayed_sidebar: pricingReference
badge:
  variant: orange
  text: Beta
slug: /references/pricing/listPriceSetMoneyAmountRules
sidebar_label: listPriceSetMoneyAmountRules
---

# listPriceSetMoneyAmountRules - Pricing Module Reference

This documentation provides a reference to the listPriceSetMoneyAmountRules method. This belongs to the Pricing Module.

This method is used to retrieve a paginated list of price set money amount rules based on optional filters and configuration.

## Parameters

- `filters`: (optional) An object of type [FilterablePriceSetMoneyAmountRulesProps](../../interfaces/FilterablePriceSetMoneyAmountRulesProps.md) that is used to filter the retrieved price set money amount rules. It accepts the following properties:
	- `$and`: (optional) An array of filters to apply on the entity, where each item in the array is joined with an "and" condition.
	- `$or`: (optional) An array of filters to apply on the entity, where each item in the array is joined with an "or" condition.
	- `id`: (optional) An array of strings, each string indicating an ID to filter the price set money amount rules.
	- `price_set_money_amount_id`: (optional) an array of strings, each string indicating the ID of a price set money amount to filter the price set money amount rules.
	- `rule_type_id`: (optional) An array of strings, each string indicating the ID of a rule type to filter the price set money amount rules.
	- `value`: (optional) an array of strings, each string indicating a value to filter the price set money amount rules.
- `config`: (optional) An object of type [FindConfig](../../interfaces/FindConfig.md) used to configure how the price set money amount rules are retrieved. Its properties, such as `select` or `relations`, accept the attributes or relations associated with a price set money amount rule. It accepts the following properties:
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

A promise that resolves to an array of objects of type [PriceSetMoneyAmountRulesDTO](../../interfaces/PriceSetMoneyAmountRulesDTO.md).

<details>
<summary>
PriceSetMoneyAmountRulesDTO
</summary>

- `id`: A string indicating the ID of the price set money amount.
- `price_set_money_amount`: an object of type [PriceSetMoneyAmountDTO](../../interfaces/PriceSetMoneyAmountDTO.md) holding the data of the associated price set money amount. It accepts the following properties:
	- `id`: a string indicating the ID of a price set money amount.
	- `money_amount`: (optional) an object of type [MoneyAmountDTO](../../interfaces/MoneyAmountDTO.md) holding the data of the associated money amount. It accepts the following properties:
		- `amount`: (optional) A number indicating the amount of this price.
		- `currency`: (optional) An object of type [CurrencyDTO](../../interfaces/CurrencyDTO.md) that holds the details of the price's currency. Since this is a relation, it will only be retrieved if it's passed to the `relations` array of the find-configuration options.
		- `currency_code`: (optional) A string that indicates the currency code of this price.
		- `id`: A string that indicates the ID of the money amount. A money amount represents a price.
		- `max_quantity`: (optional) A number that indicates the maximum quantity required to be purchased for this price to be applied.
		- `min_quantity`: (optional) A number that indicates the minimum quantity required to be purchased for this price to be applied.
	- `price_set`: (optional) an object of type [PriceSetDTO](../../interfaces/PriceSetDTO.md) holding the data of the associated price set. It accepts the following properties:
		- `id`: A string indicating the ID of the price set.
		- `money_amounts`: (optional) An array of objects of type [MoneyAmountDTO](../../interfaces/MoneyAmountDTO.md), which holds the prices that belong to this price set.
		- `rule_types`: (optional) An array of objects of type [RuleTypeDTO](../../interfaces/RuleTypeDTO.md), which holds the rule types applied on this price set.
	- `title`: (optional) a string indicating the title of the price set money amount.
- `rule_type`: an object of type [RuleTypeDTO](../../interfaces/RuleTypeDTO.md) holding the data of the associated rule type. It accepts the following properties:
	- `default_priority`: A number indicating the priority of the rule type. This is useful when calculating the price of a price set, and multiple rules satisfy the provided context. The higher the value, the higher the priority of the rule type.
	- `id`: A string indicating the ID of the rule type.
	- `name`: A string indicating the display name of the rule type.
	- `rule_attribute`: A string indicating a unique name used to later identify the rule_attribute. For example, it can be used in the `context` parameter of the `calculatePrices` method to specify a rule for calculating the price.
- `value`: a string indicating the value of the price set money amount rule.

</details>

## Example

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
