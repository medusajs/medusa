# FilterablePriceSetProps

Filters to apply on price sets.

## Hierarchy

- [`BaseFilterable`](BaseFilterable.md)<[`FilterablePriceSetProps`](FilterablePriceSetProps.md)\>

  ↳ **`FilterablePriceSetProps`**

## Properties

### $and

 `Optional` **$and**: ([`FilterablePriceSetProps`](FilterablePriceSetProps.md) \| [`BaseFilterable`](BaseFilterable.md)<[`FilterablePriceSetProps`](FilterablePriceSetProps.md)\>)[]

An array of filters to apply on the entity, where each item in the array is joined with an "and" condition.

#### Inherited from

[BaseFilterable](BaseFilterable.md).[$and](BaseFilterable.md#$and)

#### Defined in

packages/types/dist/dal/index.d.ts:12

___

### $or

 `Optional` **$or**: ([`FilterablePriceSetProps`](FilterablePriceSetProps.md) \| [`BaseFilterable`](BaseFilterable.md)<[`FilterablePriceSetProps`](FilterablePriceSetProps.md)\>)[]

An array of filters to apply on the entity, where each item in the array is joined with an "or" condition.

#### Inherited from

[BaseFilterable](BaseFilterable.md).[$or](BaseFilterable.md#$or)

#### Defined in

packages/types/dist/dal/index.d.ts:13

___

### id

 `Optional` **id**: `string`[]

IDs to filter price sets by.

#### Defined in

packages/types/dist/pricing/common/price-set.d.ts:141

___

### money\_amounts

 `Optional` **money\_amounts**: [`FilterableMoneyAmountProps`](FilterableMoneyAmountProps.md)

Filters to apply on a price set's associated money amounts.

#### Defined in

packages/types/dist/pricing/common/price-set.d.ts:142
