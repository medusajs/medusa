---
displayed_sidebar: pricingReference
---

# FilterableRuleTypeProps

An object used to filter retrieved rule types.

## Hierarchy

- [`BaseFilterable`](BaseFilterable.md)<[`FilterableRuleTypeProps`](FilterableRuleTypeProps.md)\>

  ↳ **`FilterableRuleTypeProps`**

## Properties

### $and

 `Optional` **$and**: ([`FilterableRuleTypeProps`](FilterableRuleTypeProps.md) \| [`BaseFilterable`](BaseFilterable.md)<[`FilterableRuleTypeProps`](FilterableRuleTypeProps.md)\>)[]

An array of filters to apply on the entity, where each item in the array is joined with an "and" condition.

#### Inherited from

[BaseFilterable](BaseFilterable.md).[$and](BaseFilterable.md#$and)

#### Defined in

[packages/types/src/dal/index.ts:14](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/dal/index.ts#L14)

___

### $or

 `Optional` **$or**: ([`FilterableRuleTypeProps`](FilterableRuleTypeProps.md) \| [`BaseFilterable`](BaseFilterable.md)<[`FilterableRuleTypeProps`](FilterableRuleTypeProps.md)\>)[]

An array of filters to apply on the entity, where each item in the array is joined with an "or" condition.

#### Inherited from

[BaseFilterable](BaseFilterable.md).[$or](BaseFilterable.md#$or)

#### Defined in

[packages/types/src/dal/index.ts:15](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/dal/index.ts#L15)

___

### id

 `Optional` **id**: `string`[]

an array of strings, each being an ID to filter rule types.

#### Defined in

[packages/types/src/pricing/common/rule-type.ts:65](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/pricing/common/rule-type.ts#L65)

___

### name

 `Optional` **name**: `string`[]

an array of strings, each being a name to filter rule types.

#### Defined in

[packages/types/src/pricing/common/rule-type.ts:66](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/pricing/common/rule-type.ts#L66)

___

### rule\_attribute

 `Optional` **rule\_attribute**: `string`[]

an array of strings, each being a rule attribute to filter rule types.

#### Defined in

[packages/types/src/pricing/common/rule-type.ts:67](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/pricing/common/rule-type.ts#L67)
