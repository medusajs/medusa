# FilterablePriceSetMoneyAmountRulesProps

Filters to apply on price set money amount rules.

## Hierarchy

- [`BaseFilterable`](BaseFilterable.md)<[`FilterablePriceSetMoneyAmountRulesProps`](FilterablePriceSetMoneyAmountRulesProps.md)\>

  ↳ **`FilterablePriceSetMoneyAmountRulesProps`**

## Properties

### $and

 `Optional` **$and**: ([`FilterablePriceSetMoneyAmountRulesProps`](FilterablePriceSetMoneyAmountRulesProps.md) \| [`BaseFilterable`](BaseFilterable.md)<[`FilterablePriceSetMoneyAmountRulesProps`](FilterablePriceSetMoneyAmountRulesProps.md)\>)[]

An array of filters to apply on the entity, where each item in the array is joined with an "and" condition.

#### Inherited from

[BaseFilterable](BaseFilterable.md).[$and](BaseFilterable.md#$and)

#### Defined in

packages/types/dist/dal/index.d.ts:12

___

### $or

 `Optional` **$or**: ([`FilterablePriceSetMoneyAmountRulesProps`](FilterablePriceSetMoneyAmountRulesProps.md) \| [`BaseFilterable`](BaseFilterable.md)<[`FilterablePriceSetMoneyAmountRulesProps`](FilterablePriceSetMoneyAmountRulesProps.md)\>)[]

An array of filters to apply on the entity, where each item in the array is joined with an "or" condition.

#### Inherited from

[BaseFilterable](BaseFilterable.md).[$or](BaseFilterable.md#$or)

#### Defined in

packages/types/dist/dal/index.d.ts:13

___

### id

 `Optional` **id**: `string`[]

The ID to filter price set money amount rules by.

#### Defined in

packages/types/dist/pricing/common/price-set-money-amount-rules.d.ts:61

___

### price\_set\_money\_amount\_id

 `Optional` **price\_set\_money\_amount\_id**: `string`[]

The IDs to filter the price set money amount rule's associated price set money amount.

#### Defined in

packages/types/dist/pricing/common/price-set-money-amount-rules.d.ts:63

___

### rule\_type\_id

 `Optional` **rule\_type\_id**: `string`[]

The IDs to filter the price set money amount rule's associated rule type.

#### Defined in

packages/types/dist/pricing/common/price-set-money-amount-rules.d.ts:62

___

### value

 `Optional` **value**: `string`[]

The value to filter price set money amount rules by.

#### Defined in

packages/types/dist/pricing/common/price-set-money-amount-rules.d.ts:64
