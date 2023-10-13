---
displayed_sidebar: pricingReference
---

# FilterableCurrencyProps

An object used to filter retrieved currencies.

## Hierarchy

- [`BaseFilterable`](BaseFilterable.md)<[`FilterableCurrencyProps`](FilterableCurrencyProps.md)\>

  ↳ **`FilterableCurrencyProps`**

## Properties

### $and

 `Optional` **$and**: ([`FilterableCurrencyProps`](FilterableCurrencyProps.md) \| [`BaseFilterable`](BaseFilterable.md)<[`FilterableCurrencyProps`](FilterableCurrencyProps.md)\>)[]

An array of filters to apply on the entity, where each item in the array is joined with an "and" condition.

#### Inherited from

[BaseFilterable](BaseFilterable.md).[$and](BaseFilterable.md#$and)

#### Defined in

[packages/types/src/dal/index.ts:14](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/dal/index.ts#L14)

___

### $or

 `Optional` **$or**: ([`FilterableCurrencyProps`](FilterableCurrencyProps.md) \| [`BaseFilterable`](BaseFilterable.md)<[`FilterableCurrencyProps`](FilterableCurrencyProps.md)\>)[]

An array of filters to apply on the entity, where each item in the array is joined with an "or" condition.

#### Inherited from

[BaseFilterable](BaseFilterable.md).[$or](BaseFilterable.md#$or)

#### Defined in

[packages/types/src/dal/index.ts:15](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/dal/index.ts#L15)

___

### code

 `Optional` **code**: `string`[]

an array of strings, each being a currency code to filter the currencies.

#### Defined in

[packages/types/src/pricing/common/currency.ts:69](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/pricing/common/currency.ts#L69)
