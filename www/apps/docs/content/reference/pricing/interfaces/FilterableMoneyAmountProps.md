---
displayed_sidebar: modules
---

# FilterableMoneyAmountProps

An object that can be used to filter money amounts.

## Hierarchy

- [`BaseFilterable`](BaseFilterable.md)<[`FilterableMoneyAmountProps`](FilterableMoneyAmountProps.md)\>

  ↳ **`FilterableMoneyAmountProps`**

## Properties

### $and

 `Optional` **$and**: ([`FilterableMoneyAmountProps`](FilterableMoneyAmountProps.md) \| [`BaseFilterable`](BaseFilterable.md)<[`FilterableMoneyAmountProps`](FilterableMoneyAmountProps.md)\>)[]

#### Inherited from

[BaseFilterable](BaseFilterable.md).[$and](BaseFilterable.md#$and)

#### Defined in

[packages/types/src/dal/index.ts:5](https://github.com/medusajs/medusa/blob/0350eeb0a1/packages/types/src/dal/index.ts#L5)

___

### $or

 `Optional` **$or**: ([`FilterableMoneyAmountProps`](FilterableMoneyAmountProps.md) \| [`BaseFilterable`](BaseFilterable.md)<[`FilterableMoneyAmountProps`](FilterableMoneyAmountProps.md)\>)[]

#### Inherited from

[BaseFilterable](BaseFilterable.md).[$or](BaseFilterable.md#$or)

#### Defined in

[packages/types/src/dal/index.ts:6](https://github.com/medusajs/medusa/blob/0350eeb0a1/packages/types/src/dal/index.ts#L6)

___

### currency\_code

 `Optional` **currency\_code**: `string` \| `string`[]

A string or an array of strings, each being the currency code of a money amount to retrieve.

#### Defined in

[packages/types/src/pricing/common/money-amount.ts:65](https://github.com/medusajs/medusa/blob/0350eeb0a1/packages/types/src/pricing/common/money-amount.ts#L65)

___

### id

 `Optional` **id**: `string`[]

An array of strings, each being the ID of a money amount to retrieve.

#### Defined in

[packages/types/src/pricing/common/money-amount.ts:64](https://github.com/medusajs/medusa/blob/0350eeb0a1/packages/types/src/pricing/common/money-amount.ts#L64)
