---
displayed_sidebar: pricingReference
---

# PriceSetDTO

An object that holds the details of a retrieved price set.

## Properties

### id

 **id**: `string`

A string indicating the ID of the price set.

#### Defined in

[packages/types/src/pricing/common/price-set.ts:48](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/pricing/common/price-set.ts#L48)

___

### money\_amounts

 `Optional` **money\_amounts**: [`MoneyAmountDTO`](MoneyAmountDTO.md)[]

An array of objects of type [MoneyAmountDTO](MoneyAmountDTO.md), which holds the prices that belong to this price set.

#### Defined in

[packages/types/src/pricing/common/price-set.ts:49](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/pricing/common/price-set.ts#L49)

___

### rule\_types

 `Optional` **rule\_types**: [`RuleTypeDTO`](RuleTypeDTO.md)[]

An array of objects of type [RuleTypeDTO](RuleTypeDTO.md), which holds the rule types applied on this price set.

#### Defined in

[packages/types/src/pricing/common/price-set.ts:50](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/pricing/common/price-set.ts#L50)
