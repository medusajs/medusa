---
displayed_sidebar: modules
---

# FilterablePriceSetProps

An object that can be used to specify filters on price sets.

## Hierarchy

- [`BaseFilterable`](BaseFilterable.md)<[`FilterablePriceSetProps`](FilterablePriceSetProps.md)\>

  ↳ **`FilterablePriceSetProps`**

## Properties

### $and

 `Optional` **$and**: ([`FilterablePriceSetProps`](FilterablePriceSetProps.md) \| [`BaseFilterable`](BaseFilterable.md)<[`FilterablePriceSetProps`](FilterablePriceSetProps.md)\>)[]

#### Inherited from

[BaseFilterable](BaseFilterable.md).[$and](BaseFilterable.md#$and)

#### Defined in

[packages/types/src/dal/index.ts:5](https://github.com/medusajs/medusa/blob/0350eeb0a1/packages/types/src/dal/index.ts#L5)

___

### $or

 `Optional` **$or**: ([`FilterablePriceSetProps`](FilterablePriceSetProps.md) \| [`BaseFilterable`](BaseFilterable.md)<[`FilterablePriceSetProps`](FilterablePriceSetProps.md)\>)[]

#### Inherited from

[BaseFilterable](BaseFilterable.md).[$or](BaseFilterable.md#$or)

#### Defined in

[packages/types/src/dal/index.ts:6](https://github.com/medusajs/medusa/blob/0350eeb0a1/packages/types/src/dal/index.ts#L6)

___

### id

 `Optional` **id**: `string`[]

An array of strings, each being an ID of a price list to retrieve.

#### Defined in

[packages/types/src/pricing/common/price-set.ts:150](https://github.com/medusajs/medusa/blob/0350eeb0a1/packages/types/src/pricing/common/price-set.ts#L150)

___

### money\_amounts

 `Optional` **money\_amounts**: [`FilterableMoneyAmountProps`](FilterableMoneyAmountProps.md)

An object of type [FilterableMoneyAmountProps](FilterableMoneyAmountProps.md) that is used to filter the price sets by their associated money amounts.

#### Defined in

[packages/types/src/pricing/common/price-set.ts:151](https://github.com/medusajs/medusa/blob/0350eeb0a1/packages/types/src/pricing/common/price-set.ts#L151)
