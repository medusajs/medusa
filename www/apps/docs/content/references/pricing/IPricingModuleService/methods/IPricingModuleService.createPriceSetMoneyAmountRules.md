---
displayed_sidebar: pricingReference
badge:
  variant: orange
  text: Beta
slug: /references/pricing/createPriceSetMoneyAmountRules
sidebar_label: createPriceSetMoneyAmountRules
---

# createPriceSetMoneyAmountRules - Pricing Module Reference

This documentation provides a reference to the createPriceSetMoneyAmountRules method. This belongs to the Pricing Module.

This method is used to create new price set money amount rules. A price set money amount rule creates an association between a price set money amount and
a rule type.

## Parameters

- `data`: An array of objects of type [CreatePriceSetMoneyAmountRulesDTO](../../interfaces/CreatePriceSetMoneyAmountRulesDTO.md), each containing the data of a price set money amount rule to create. Its items accept the following properties:
	- `price_set_money_amount`: A string indicating the ID of a price set money amount.
	- `rule_type`: A string indicating the ID of a rule type.
	- `value`: A string indicating the value of the price set money amount rule.
- `sharedContext`: (optional) An object of type [Context](../../interfaces/Context.md) used to share resources, such as transaction manager, between the application and the module. It accepts the following properties:
	- `enableNestedTransactions`: (optional) a boolean value indicating whether nested transactions are enabled.
	- `isolationLevel`: (optional) A string indicating the isolation level of the context. Possible values are `READ UNCOMMITTED`, `READ COMMITTED`, `REPEATABLE READ`, or `SERIALIZABLE`.
	- `manager`: (optional) An instance of a manager, typically an entity manager, of type `TManager`, which is a typed parameter passed to the context to specify the type of the `manager`.
	- `transactionId`: (optional) a string indicating the ID of the current transaction.
	- `transactionManager`: (optional) An instance of a transaction manager of type `TManager`, which is a typed parameter passed to the context to specify the type of the `transactionManager`.

## Returns

A promise that resolves to an array of objects of type [PriceSetMoneyAmountRulesDTO](../../interfaces/PriceSetMoneyAmountRulesDTO.md), each being
a created price set money amount rule.

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
