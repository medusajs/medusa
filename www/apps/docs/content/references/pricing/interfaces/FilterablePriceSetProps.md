---
displayed_sidebar: pricingReference
---

# FilterablePriceSetProps

An object that can be used to specify filters on price sets.

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

[packages/types/src/dal/index.ts:14](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/dal/index.ts#L14)

___

### $or

 `Optional` **$or**: ([`FilterablePriceSetProps`](FilterablePriceSetProps.md) \| [`BaseFilterable`](BaseFilterable.md)<[`FilterablePriceSetProps`](FilterablePriceSetProps.md)\>)[]

An array of filters to apply on the entity, where each item in the array is joined with an "or" condition.

#### Inherited from

[BaseFilterable](BaseFilterable.md).[$or](BaseFilterable.md#$or)

#### Defined in

[packages/types/src/dal/index.ts:15](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/dal/index.ts#L15)

___

### id

 `Optional` **id**: `string`[]

An array of strings, each being an ID to filter price sets.

#### Defined in

[packages/types/src/pricing/common/price-set.ts:158](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/pricing/common/price-set.ts#L158)

___

### money\_amounts

 `Optional` **money\_amounts**: [`FilterableMoneyAmountProps`](FilterableMoneyAmountProps.md)

An object of type [FilterableMoneyAmountProps](FilterableMoneyAmountProps.md) that is used to filter the price sets by their associated money amounts.

#### Defined in

[packages/types/src/pricing/common/price-set.ts:159](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/pricing/common/price-set.ts#L159)
