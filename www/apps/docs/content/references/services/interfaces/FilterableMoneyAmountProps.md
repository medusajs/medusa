# FilterableMoneyAmountProps

Filters to apply on a money amount.

## Hierarchy

- [`BaseFilterable`](BaseFilterable.md)<[`FilterableMoneyAmountProps`](FilterableMoneyAmountProps.md)\>

  ↳ **`FilterableMoneyAmountProps`**

## Properties

### $and

 `Optional` **$and**: ([`FilterableMoneyAmountProps`](FilterableMoneyAmountProps.md) \| [`BaseFilterable`](BaseFilterable.md)<[`FilterableMoneyAmountProps`](FilterableMoneyAmountProps.md)\>)[]

An array of filters to apply on the entity, where each item in the array is joined with an "and" condition.

#### Inherited from

[BaseFilterable](BaseFilterable.md).[$and](BaseFilterable.md#$and)

#### Defined in

packages/types/dist/dal/index.d.ts:12

___

### $or

 `Optional` **$or**: ([`FilterableMoneyAmountProps`](FilterableMoneyAmountProps.md) \| [`BaseFilterable`](BaseFilterable.md)<[`FilterableMoneyAmountProps`](FilterableMoneyAmountProps.md)\>)[]

An array of filters to apply on the entity, where each item in the array is joined with an "or" condition.

#### Inherited from

[BaseFilterable](BaseFilterable.md).[$or](BaseFilterable.md#$or)

#### Defined in

packages/types/dist/dal/index.d.ts:13

___

### currency\_code

 `Optional` **currency\_code**: `string` \| `string`[]

Currency codes to filter money amounts by.

#### Defined in

packages/types/dist/pricing/common/money-amount.d.ts:72

___

### id

 `Optional` **id**: `string`[]

IDs to filter money amounts by.

#### Defined in

packages/types/dist/pricing/common/money-amount.d.ts:71
