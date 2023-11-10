# FilterableRuleTypeProps

Filters to apply on rule types.

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

packages/types/dist/dal/index.d.ts:12

___

### $or

 `Optional` **$or**: ([`FilterableRuleTypeProps`](FilterableRuleTypeProps.md) \| [`BaseFilterable`](BaseFilterable.md)<[`FilterableRuleTypeProps`](FilterableRuleTypeProps.md)\>)[]

An array of filters to apply on the entity, where each item in the array is joined with an "or" condition.

#### Inherited from

[BaseFilterable](BaseFilterable.md).[$or](BaseFilterable.md#$or)

#### Defined in

packages/types/dist/dal/index.d.ts:13

___

### id

 `Optional` **id**: `string`[]

The IDs to filter rule types by.

#### Defined in

packages/types/dist/pricing/common/rule-type.d.ts:60

___

### name

 `Optional` **name**: `string`[]

The names to filter rule types by.

#### Defined in

packages/types/dist/pricing/common/rule-type.d.ts:61

___

### rule\_attribute

 `Optional` **rule\_attribute**: `string`[]

The rule attributes to filter rule types by.

#### Defined in

packages/types/dist/pricing/common/rule-type.d.ts:62
