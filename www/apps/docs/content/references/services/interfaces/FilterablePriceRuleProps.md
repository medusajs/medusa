# FilterablePriceRuleProps

Filters to apply to price rules.

## Hierarchy

- [`BaseFilterable`](BaseFilterable.md)<[`FilterablePriceRuleProps`](FilterablePriceRuleProps.md)\>

  ↳ **`FilterablePriceRuleProps`**

## Properties

### $and

 `Optional` **$and**: ([`FilterablePriceRuleProps`](FilterablePriceRuleProps.md) \| [`BaseFilterable`](BaseFilterable.md)<[`FilterablePriceRuleProps`](FilterablePriceRuleProps.md)\>)[]

An array of filters to apply on the entity, where each item in the array is joined with an "and" condition.

#### Inherited from

[BaseFilterable](BaseFilterable.md).[$and](BaseFilterable.md#$and)

#### Defined in

packages/types/dist/dal/index.d.ts:12

___

### $or

 `Optional` **$or**: ([`FilterablePriceRuleProps`](FilterablePriceRuleProps.md) \| [`BaseFilterable`](BaseFilterable.md)<[`FilterablePriceRuleProps`](FilterablePriceRuleProps.md)\>)[]

An array of filters to apply on the entity, where each item in the array is joined with an "or" condition.

#### Inherited from

[BaseFilterable](BaseFilterable.md).[$or](BaseFilterable.md#$or)

#### Defined in

packages/types/dist/dal/index.d.ts:13

___

### id

 `Optional` **id**: `string`[]

The IDs to filter price rules by.

#### Defined in

packages/types/dist/pricing/common/price-rule.d.ts:108

___

### name

 `Optional` **name**: `string`[]

The names to filter price rules by.

#### Defined in

packages/types/dist/pricing/common/price-rule.d.ts:109

___

### price\_set\_id

 `Optional` **price\_set\_id**: `string`[]

The IDs to filter the price rule's associated price set.

#### Defined in

packages/types/dist/pricing/common/price-rule.d.ts:110

___

### rule\_type\_id

 `Optional` **rule\_type\_id**: `string`[]

The IDs to filter the price rule's associated rule type.

#### Defined in

packages/types/dist/pricing/common/price-rule.d.ts:111
