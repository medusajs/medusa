---
displayed_sidebar: pricingReference
badge:
  variant: orange
  text: Beta
slug: /references/pricing/addRules
sidebar_label: addRules
---

# addRules - Pricing Module Reference

This documentation provides a reference to the addRules method. This belongs to the Pricing Module.

## addRules(data, sharedContext?): Promise<PriceSetDTO\>

This method adds rules to a price set.

### Parameters

- `data`: An object of type [AddRulesDTO](../../interfaces/AddRulesDTO.md) that holds the necessary data to add rules to a price set. It accepts the following properties:
	- `priceSetId`: A string indicating the ID of the price set to add the rules to.
	- `rules`: An array of objects, each object holds a property `attribute`, with its value being the `rule_attribute` of the rule to add to the price set.
- `sharedContext`: (optional) An object of type [Context](../../interfaces/Context.md) used to share resources, such as transaction manager, between the application and the module. It accepts the following properties:
	- `enableNestedTransactions`: (optional) a boolean value indicating whether nested transactions are enabled.
	- `isolationLevel`: (optional) A string indicating the isolation level of the context. Possible values are `READ UNCOMMITTED`, `READ COMMITTED`, `REPEATABLE READ`, or `SERIALIZABLE`.
	- `manager`: (optional) An instance of a manager, typically an entity manager, of type `TManager`, which is a typed parameter passed to the context to specify the type of the `manager`.
	- `transactionId`: (optional) a string indicating the ID of the current transaction.
	- `transactionManager`: (optional) An instance of a transaction manager of type `TManager`, which is a typed parameter passed to the context to specify the type of the `transactionManager`.

### Returns

A promise that resolves to an object of type [PriceSetDTO](../../interfaces/PriceSetDTO.md), which is the price set that the rules belong to.

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

## addRules(data, sharedContext?): Promise<PriceSetDTO[]\>

This method adds rules to multiple price sets.

### Parameters

- `data`: An array of objects of type [AddRulesDTO](../../interfaces/AddRulesDTO.md), each holding the necessary data to add rules to a price set. Its items accept the following properties:
	- `priceSetId`: A string indicating the ID of the price set to add the rules to.
	- `rules`: An array of objects, each object holds a property `attribute`, with its value being the `rule_attribute` of the rule to add to the price set.
- `sharedContext`: (optional) An object of type [Context](../../interfaces/Context.md) used to share resources, such as transaction manager, between the application and the module. It accepts the following properties:
	- `enableNestedTransactions`: (optional) a boolean value indicating whether nested transactions are enabled.
	- `isolationLevel`: (optional) A string indicating the isolation level of the context. Possible values are `READ UNCOMMITTED`, `READ COMMITTED`, `REPEATABLE READ`, or `SERIALIZABLE`.
	- `manager`: (optional) An instance of a manager, typically an entity manager, of type `TManager`, which is a typed parameter passed to the context to specify the type of the `manager`.
	- `transactionId`: (optional) a string indicating the ID of the current transaction.
	- `transactionManager`: (optional) An instance of a transaction manager of type `TManager`, which is a typed parameter passed to the context to specify the type of the `transactionManager`.

### Returns

A promise that resolves to an array of objects of type [PriceSetDTO](../../interfaces/PriceSetDTO.md), each being the price set that rules were added to.

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
