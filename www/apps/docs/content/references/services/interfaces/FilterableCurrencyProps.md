# FilterableCurrencyProps

Filters to apply on a currency.

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

packages/types/dist/dal/index.d.ts:12

___

### $or

 `Optional` **$or**: ([`FilterableCurrencyProps`](FilterableCurrencyProps.md) \| [`BaseFilterable`](BaseFilterable.md)<[`FilterableCurrencyProps`](FilterableCurrencyProps.md)\>)[]

An array of filters to apply on the entity, where each item in the array is joined with an "or" condition.

#### Inherited from

[BaseFilterable](BaseFilterable.md).[$or](BaseFilterable.md#$or)

#### Defined in

packages/types/dist/dal/index.d.ts:13

___

### code

 `Optional` **code**: `string`[]

The codes to filter the currencies by.

#### Defined in

packages/types/dist/pricing/common/currency.d.ts:61
