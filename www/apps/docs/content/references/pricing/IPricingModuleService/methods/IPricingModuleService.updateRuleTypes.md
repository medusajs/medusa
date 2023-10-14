---
displayed_sidebar: pricingReference
badge:
  variant: orange
  text: Beta
slug: /references/pricing/updateRuleTypes
sidebar_label: updateRuleTypes
---

# updateRuleTypes - Pricing Module Reference

This documentation provides a reference to the updateRuleTypes method. This belongs to the Pricing Module.

This method is used to update existing rule types with the provided data.

## Parameters

- `data`: An array of objects of type [UpdateRuleTypeDTO](../../interfaces/UpdateRuleTypeDTO.md), each object containing data to be updated in a rule type. Its items accept the following properties:
	- `default_priority`: (optional) A number indicating the priority of the rule type. This is useful when calculating the price of a price set, and multiple rules satisfy the provided context. The higher the value, the higher the priority of the rule type.
	- `id`: A string indicating the ID of the rule type to update.
	- `name`: (optional) A string indicating the display name of the rule type.
	- `rule_attribute`: (optional) A string indicating a unique name used to later identify the rule_attribute. For example, it can be used in the `context` parameter of the `calculatePrices` method to specify a rule for calculating the price.
- `sharedContext`: (optional) An object of type [Context](../../interfaces/Context.md) used to share resources, such as transaction manager, between the application and the module. It accepts the following properties:
	- `enableNestedTransactions`: (optional) a boolean value indicating whether nested transactions are enabled.
	- `isolationLevel`: (optional) A string indicating the isolation level of the context. Possible values are `READ UNCOMMITTED`, `READ COMMITTED`, `REPEATABLE READ`, or `SERIALIZABLE`.
	- `manager`: (optional) An instance of a manager, typically an entity manager, of type `TManager`, which is a typed parameter passed to the context to specify the type of the `manager`.
	- `transactionId`: (optional) a string indicating the ID of the current transaction.
	- `transactionManager`: (optional) An instance of a transaction manager of type `TManager`, which is a typed parameter passed to the context to specify the type of the `transactionManager`.

## Returns

A promise that resolves to an array of objects of type [RuleTypeDTO](../../interfaces/RuleTypeDTO.md), each being an updated rule type.

<details>
<summary>
RuleTypeDTO
</summary>

- `default_priority`: A number indicating the priority of the rule type. This is useful when calculating the price of a price set, and multiple rules satisfy the provided context. The higher the value, the higher the priority of the rule type.
- `id`: A string indicating the ID of the rule type.
- `name`: A string indicating the display name of the rule type.
- `rule_attribute`: A string indicating a unique name used to later identify the rule_attribute. For example, it can be used in the `context` parameter of the `calculatePrices` method to specify a rule for calculating the price.

</details>

## Example

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
