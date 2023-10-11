---
displayed_sidebar: pricingReference
badge:
  variant: orange
  text: Beta
slug: /references/pricing/updatePriceRules
sidebar_label: updatePriceRules
---

# updatePriceRules - Pricing Module Reference

This documentation provides a reference to the updatePriceRules method. This belongs to the Pricing Module.

This method is used to update price rules, each with their provided data.

## Parameters

- `data`: An array of objects of type [UpdatePriceRuleDTO](../../interfaces/UpdatePriceRuleDTO.md), each containing the data to update in a price rule. Its items accept the following properties:
	- `id`: A string indicating the ID of the price rule to update.
	- `price_list_id`: (optional) A string indicating the ID of the associated price list.
	- `price_set_id`: (optional) A string indicating the ID of the associated price set.
	- `price_set_money_amount_id`: (optional) A string indicating the ID of the associated price set money amount.
	- `priority`: (optional) A number indicating the priority of the price rule in comparison to other applicable price rules.
	- `rule_type_id`: (optional) A string indicating the ID of the associated rule type.
	- `value`: (optional) A string indicating the value of the price rule.
- `sharedContext`: (optional) An object of type [Context](../../interfaces/Context.md) used to share resources, such as transaction manager, between the application and the module. It accepts the following properties:
	- `enableNestedTransactions`: (optional) a boolean value indicating whether nested transactions are enabled.
	- `isolationLevel`: (optional) A string indicating the isolation level of the context. Possible values are `READ UNCOMMITTED`, `READ COMMITTED`, `REPEATABLE READ`, or `SERIALIZABLE`.
	- `manager`: (optional) An instance of a manager, typically an entity manager, of type `TManager`, which is a typed parameter passed to the context to specify the type of the `manager`.
	- `transactionId`: (optional) a string indicating the ID of the current transaction.
	- `transactionManager`: (optional) An instance of a transaction manager of type `TManager`, which is a typed parameter passed to the context to specify the type of the `transactionManager`.

## Returns

A promise that resolves to an array of objects of type [PriceRuleDTO](../../interfaces/PriceRuleDTO.md), each being an updated price rule.

<details>
<summary>
PriceRuleDTO
</summary>

- `id`: A string indicating the ID of the price rule.
- `is_dynamic`: A boolean indicating whether the price rule is dynamic.
- `price_list_id`: A string indicating the ID of the associated price list.
- `price_set`: An object of type [PriceSetDTO](../../interfaces/PriceSetDTO.md) that holds the data of the associated price set. It may only be available if the relation `price_set` is expanded. It accepts the following properties:
	- `id`: A string indicating the ID of the price set.
	- `money_amounts`: (optional) An array of objects of type [MoneyAmountDTO](../../interfaces/MoneyAmountDTO.md), which holds the prices that belong to this price set. Its items accept the following properties:
		- `amount`: (optional) A number indicating the amount of this price.
		- `currency`: (optional) An object of type [CurrencyDTO](../../interfaces/CurrencyDTO.md) that holds the details of the price's currency. Since this is a relation, it will only be retrieved if it's passed to the `relations` array of the find-configuration options.
		- `currency_code`: (optional) A string that indicates the currency code of this price.
		- `id`: A string that indicates the ID of the money amount. A money amount represents a price.
		- `max_quantity`: (optional) A number that indicates the maximum quantity required to be purchased for this price to be applied.
		- `min_quantity`: (optional) A number that indicates the minimum quantity required to be purchased for this price to be applied.
	- `rule_types`: (optional) An array of objects of type [RuleTypeDTO](../../interfaces/RuleTypeDTO.md), which holds the rule types applied on this price set. Its items accept the following properties:
		- `default_priority`: A number indicating the priority of the rule type. This is useful when calculating the price of a price set, and multiple rules satisfy the provided context. The higher the value, the higher the priority of the rule type.
		- `id`: A string indicating the ID of the rule type.
		- `name`: A string indicating the display name of the rule type.
		- `rule_attribute`: A string indicating a unique name used to later identify the rule_attribute. For example, it can be used in the `context` parameter of the `calculatePrices` method to specify a rule for calculating the price.
- `price_set_id`: A string indicating the ID of the associated price set.
- `price_set_money_amount_id`: A string indicating the ID of the associated price set money amount.
- `priority`: A number indicating the priority of the price rule in comparison to other applicable price rules.
- `rule_type`: An object of type [RuleTypeDTO](../../interfaces/RuleTypeDTO.md) that holds the data of the associated rule type. It may only be available if the relation `rule_type` is expanded. It accepts the following properties:
	- `default_priority`: A number indicating the priority of the rule type. This is useful when calculating the price of a price set, and multiple rules satisfy the provided context. The higher the value, the higher the priority of the rule type.
	- `id`: A string indicating the ID of the rule type.
	- `name`: A string indicating the display name of the rule type.
	- `rule_attribute`: A string indicating a unique name used to later identify the rule_attribute. For example, it can be used in the `context` parameter of the `calculatePrices` method to specify a rule for calculating the price.
- `rule_type_id`: A string indicating the ID of the associated rule type.
- `value`: A string indicating the value of the price rule.

</details>

## Example

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
