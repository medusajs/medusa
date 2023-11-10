# FilterablePriceSetMoneyAmountProps

Filters to apply on price set money amounts.

## Hierarchy

- [`BaseFilterable`](BaseFilterable.md)<[`FilterablePriceSetMoneyAmountProps`](FilterablePriceSetMoneyAmountProps.md)\>

  ↳ **`FilterablePriceSetMoneyAmountProps`**

## Properties

### $and

 `Optional` **$and**: ([`FilterablePriceSetMoneyAmountProps`](FilterablePriceSetMoneyAmountProps.md) \| [`BaseFilterable`](BaseFilterable.md)<[`FilterablePriceSetMoneyAmountProps`](FilterablePriceSetMoneyAmountProps.md)\>)[]

An array of filters to apply on the entity, where each item in the array is joined with an "and" condition.

#### Inherited from

[BaseFilterable](BaseFilterable.md).[$and](BaseFilterable.md#$and)

#### Defined in

packages/types/dist/dal/index.d.ts:12

___

### $or

 `Optional` **$or**: ([`FilterablePriceSetMoneyAmountProps`](FilterablePriceSetMoneyAmountProps.md) \| [`BaseFilterable`](BaseFilterable.md)<[`FilterablePriceSetMoneyAmountProps`](FilterablePriceSetMoneyAmountProps.md)\>)[]

An array of filters to apply on the entity, where each item in the array is joined with an "or" condition.

#### Inherited from

[BaseFilterable](BaseFilterable.md).[$or](BaseFilterable.md#$or)

#### Defined in

packages/types/dist/dal/index.d.ts:13

___

### id

 `Optional` **id**: `string`[]

The IDs to filter the price set money amounts by.

#### Defined in

packages/types/dist/pricing/common/price-set-money-amount.d.ts:43

___

### price\_set\_id

 `Optional` **price\_set\_id**: `string`[]

The IDs to filter the price set money amount's associated price set.

#### Defined in

packages/types/dist/pricing/common/price-set-money-amount.d.ts:44
