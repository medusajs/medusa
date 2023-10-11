---
displayed_sidebar: pricingReference
badge:
  variant: orange
  text: Beta
slug: /references/pricing/retrieveRuleType
sidebar_label: retrieveRuleType
---

# retrieveRuleType - Pricing Module Reference

This documentation provides a reference to the retrieveRuleType method. This belongs to the Pricing Module.

This method is used to retrieve a rule type by its ID and and optionally based on the provided configurations.

## Parameters

- `code`: 
- `config`: (optional) An object of type [FindConfig](../../interfaces/FindConfig.md) used to configure how the rule type is retrieved. Its properties, such as `select` or `relations`, accept the attributes or relations associated with a rule type. It accepts the following properties:
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

A promise that resolves to an object of type [RuleTypeDTO](../../interfaces/RuleTypeDTO.md).

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
