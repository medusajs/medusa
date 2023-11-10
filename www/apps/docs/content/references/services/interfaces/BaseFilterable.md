# BaseFilterable

An object used to allow specifying flexible queries with and/or conditions.

## Type parameters

| Name |
| :------ |
| `T` | `object` |

## Hierarchy

- **`BaseFilterable`**

  ↳ [`FilterablePriceSetProps`](FilterablePriceSetProps.md)

  ↳ [`FilterableMoneyAmountProps`](FilterableMoneyAmountProps.md)

  ↳ [`FilterableCurrencyProps`](FilterableCurrencyProps.md)

  ↳ [`FilterableRuleTypeProps`](FilterableRuleTypeProps.md)

  ↳ [`FilterablePriceSetMoneyAmountRulesProps`](FilterablePriceSetMoneyAmountRulesProps.md)

  ↳ [`FilterablePriceSetMoneyAmountProps`](FilterablePriceSetMoneyAmountProps.md)

  ↳ [`FilterablePriceRuleProps`](FilterablePriceRuleProps.md)

## Properties

### $and

 `Optional` **$and**: ([`BaseFilterable`](BaseFilterable.md)<`T`\> \| `T`)[]

An array of filters to apply on the entity, where each item in the array is joined with an "and" condition.

#### Defined in

packages/types/dist/dal/index.d.ts:12

___

### $or

 `Optional` **$or**: ([`BaseFilterable`](BaseFilterable.md)<`T`\> \| `T`)[]

An array of filters to apply on the entity, where each item in the array is joined with an "or" condition.

#### Defined in

packages/types/dist/dal/index.d.ts:13
