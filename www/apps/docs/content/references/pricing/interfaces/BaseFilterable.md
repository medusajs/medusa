---
displayed_sidebar: pricingReference
---

# BaseFilterable

An object used to allow specifying flexible queries with and/or conditions.

## Type parameters

| Name |
| :------ |
| `T` |

## Hierarchy

- **`BaseFilterable`**

  ↳ [`FilterablePriceSetProps`](FilterablePriceSetProps.md)

  ↳ [`FilterableMoneyAmountProps`](FilterableMoneyAmountProps.md)

  ↳ [`FilterableCurrencyProps`](FilterableCurrencyProps.md)

  ↳ [`FilterableRuleTypeProps`](FilterableRuleTypeProps.md)

  ↳ [`FilterablePriceSetMoneyAmountRulesProps`](FilterablePriceSetMoneyAmountRulesProps.md)

  ↳ [`FilterablePriceRuleProps`](FilterablePriceRuleProps.md)

## Properties

### $and

 `Optional` **$and**: (`T` \| [`BaseFilterable`](BaseFilterable.md)<`T`\>)[]

An array of filters to apply on the entity, where each item in the array is joined with an "and" condition.

#### Defined in

[packages/types/src/dal/index.ts:14](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/dal/index.ts#L14)

___

### $or

 `Optional` **$or**: (`T` \| [`BaseFilterable`](BaseFilterable.md)<`T`\>)[]

An array of filters to apply on the entity, where each item in the array is joined with an "or" condition.

#### Defined in

[packages/types/src/dal/index.ts:15](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/dal/index.ts#L15)
