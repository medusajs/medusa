---
displayed_sidebar: pricingReference
---

# FilterableMoneyAmountProps

An object that can be used to filter money amounts.

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

[packages/types/src/dal/index.ts:14](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/dal/index.ts#L14)

___

### $or

 `Optional` **$or**: ([`FilterableMoneyAmountProps`](FilterableMoneyAmountProps.md) \| [`BaseFilterable`](BaseFilterable.md)<[`FilterableMoneyAmountProps`](FilterableMoneyAmountProps.md)\>)[]

An array of filters to apply on the entity, where each item in the array is joined with an "or" condition.

#### Inherited from

[BaseFilterable](BaseFilterable.md).[$or](BaseFilterable.md#$or)

#### Defined in

[packages/types/src/dal/index.ts:15](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/dal/index.ts#L15)

___

### currency\_code

 `Optional` **currency\_code**: `string` \| `string`[]

A string or an array of strings, each being a currency code to filter money amounts.

#### Defined in

[packages/types/src/pricing/common/money-amount.ts:77](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/pricing/common/money-amount.ts#L77)

___

### id

 `Optional` **id**: `string`[]

An array of strings, each being an ID to filter money amounts.

#### Defined in

[packages/types/src/pricing/common/money-amount.ts:76](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/pricing/common/money-amount.ts#L76)
