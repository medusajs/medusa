---
displayed_sidebar: pricingReference
badge:
  variant: orange
  text: Beta
slug: /references/pricing/listRuleTypes
sidebar_label: listRuleTypes
---

# listRuleTypes - Pricing Module Reference

This documentation provides a reference to the listRuleTypes method. This belongs to the Pricing Module.

This method is used to retrieve a paginated list of rule types based on optional filters and configuration.

## Parameters

- `filters`: (optional) An object of type [FilterableRuleTypeProps](../../interfaces/FilterableRuleTypeProps.md) that is used to filter the retrieved rule types. It accepts the following properties:
	- `$and`: (optional) An array of filters to apply on the entity, where each item in the array is joined with an "and" condition.
	- `$or`: (optional) An array of filters to apply on the entity, where each item in the array is joined with an "or" condition.
	- `id`: (optional) an array of strings, each being an ID to filter rule types.
	- `name`: (optional) an array of strings, each being a name to filter rule types.
	- `rule_attribute`: (optional) an array of strings, each being a rule attribute to filter rule types.
- `config`: (optional) An object of type [FindConfig](../../interfaces/FindConfig.md) used to configure how the rule types are retrieved. Its properties, such as `select` or `relations`, accept the attributes or relations associated with a rule type. It accepts the following properties:
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

A promise that resolves to an array of objects of type [RuleTypeDTO](../../interfaces/RuleTypeDTO.md).

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
