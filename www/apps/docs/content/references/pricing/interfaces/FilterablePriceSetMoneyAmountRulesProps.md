---
displayed_sidebar: pricingReference
---

# FilterablePriceSetMoneyAmountRulesProps

An object used to filter price set money amount rules when listing them.

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

[packages/types/src/dal/index.ts:14](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/dal/index.ts#L14)

___

### $or

 `Optional` **$or**: ([`FilterablePriceSetMoneyAmountRulesProps`](FilterablePriceSetMoneyAmountRulesProps.md) \| [`BaseFilterable`](BaseFilterable.md)<[`FilterablePriceSetMoneyAmountRulesProps`](FilterablePriceSetMoneyAmountRulesProps.md)\>)[]

An array of filters to apply on the entity, where each item in the array is joined with an "or" condition.

#### Inherited from

[BaseFilterable](BaseFilterable.md).[$or](BaseFilterable.md#$or)

#### Defined in

[packages/types/src/dal/index.ts:15](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/dal/index.ts#L15)

___

### id

 `Optional` **id**: `string`[]

An array of strings, each string indicating an ID to filter the price set money amount rules.

#### Defined in

[packages/types/src/pricing/common/price-set-money-amount-rules.ts:66](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/pricing/common/price-set-money-amount-rules.ts#L66)

___

### price\_set\_money\_amount\_id

 `Optional` **price\_set\_money\_amount\_id**: `string`[]

an array of strings, each string indicating the ID of a price set money amount to filter the price set money amount rules.

#### Defined in

[packages/types/src/pricing/common/price-set-money-amount-rules.ts:68](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/pricing/common/price-set-money-amount-rules.ts#L68)

___

### rule\_type\_id

 `Optional` **rule\_type\_id**: `string`[]

An array of strings, each string indicating the ID of a rule type to filter the price set money amount rules.

#### Defined in

[packages/types/src/pricing/common/price-set-money-amount-rules.ts:67](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/pricing/common/price-set-money-amount-rules.ts#L67)

___

### value

 `Optional` **value**: `string`[]

an array of strings, each string indicating a value to filter the price set money amount rules.

#### Defined in

[packages/types/src/pricing/common/price-set-money-amount-rules.ts:69](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/pricing/common/price-set-money-amount-rules.ts#L69)
