---
displayed_sidebar: pricingReference
---

# FilterablePriceRuleProps

An object used to filter price rules when retrieving them.

## Hierarchy

- [`BaseFilterable`](BaseFilterable.md)<[`FilterablePriceRuleProps`](FilterablePriceRuleProps.md)\>

  ↳ **`FilterablePriceRuleProps`**

## Properties

### $and

 `Optional` **$and**: ([`FilterablePriceRuleProps`](FilterablePriceRuleProps.md) \| [`BaseFilterable`](BaseFilterable.md)<[`FilterablePriceRuleProps`](FilterablePriceRuleProps.md)\>)[]

An array of filters to apply on the entity, where each item in the array is joined with an "and" condition.

#### Inherited from

[BaseFilterable](BaseFilterable.md).[$and](BaseFilterable.md#$and)

#### Defined in

[packages/types/src/dal/index.ts:14](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/dal/index.ts#L14)

___

### $or

 `Optional` **$or**: ([`FilterablePriceRuleProps`](FilterablePriceRuleProps.md) \| [`BaseFilterable`](BaseFilterable.md)<[`FilterablePriceRuleProps`](FilterablePriceRuleProps.md)\>)[]

An array of filters to apply on the entity, where each item in the array is joined with an "or" condition.

#### Inherited from

[BaseFilterable](BaseFilterable.md).[$or](BaseFilterable.md#$or)

#### Defined in

[packages/types/src/dal/index.ts:15](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/dal/index.ts#L15)

___

### id

 `Optional` **id**: `string`[]

An array of strings, each indicating an ID to filter price rules.

#### Defined in

[packages/types/src/pricing/common/price-rule.ts:103](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/pricing/common/price-rule.ts#L103)

___

### name

 `Optional` **name**: `string`[]

An array of strings, each indicating a name to filter price rules.

#### Defined in

[packages/types/src/pricing/common/price-rule.ts:104](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/pricing/common/price-rule.ts#L104)

___

### price\_set\_id

 `Optional` **price\_set\_id**: `string`[]

An array of strings, each indicating a price set ID to filter price rules.

#### Defined in

[packages/types/src/pricing/common/price-rule.ts:105](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/pricing/common/price-rule.ts#L105)

___

### rule\_type\_id

 `Optional` **rule\_type\_id**: `string`[]

An array of strings, each indicating a rule type ID to filter rule types.

#### Defined in

[packages/types/src/pricing/common/price-rule.ts:106](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/pricing/common/price-rule.ts#L106)
