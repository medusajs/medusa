---
displayed_sidebar: pricingReference
---

# PriceRuleDTO

An object that represents a price rule.

## Properties

### id

 **id**: `string`

A string indicating the ID of the price rule.

#### Defined in

[packages/types/src/pricing/common/price-rule.ts:22](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/pricing/common/price-rule.ts#L22)

___

### is\_dynamic

 **is\_dynamic**: `boolean`

A boolean indicating whether the price rule is dynamic.

#### Defined in

[packages/types/src/pricing/common/price-rule.ts:27](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/pricing/common/price-rule.ts#L27)

___

### price\_list\_id

 **price\_list\_id**: `string`

A string indicating the ID of the associated price list.

#### Defined in

[packages/types/src/pricing/common/price-rule.ts:31](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/pricing/common/price-rule.ts#L31)

___

### price\_set

 **price\_set**: [`PriceSetDTO`](PriceSetDTO.md)

An object of type [PriceSetDTO](PriceSetDTO.md) that holds the data of the associated price set. It may only be available if the relation `price_set` is expanded.

#### Defined in

[packages/types/src/pricing/common/price-rule.ts:24](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/pricing/common/price-rule.ts#L24)

___

### price\_set\_id

 **price\_set\_id**: `string`

A string indicating the ID of the associated price set.

#### Defined in

[packages/types/src/pricing/common/price-rule.ts:23](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/pricing/common/price-rule.ts#L23)

___

### price\_set\_money\_amount\_id

 **price\_set\_money\_amount\_id**: `string`

A string indicating the ID of the associated price set money amount.

#### Defined in

[packages/types/src/pricing/common/price-rule.ts:30](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/pricing/common/price-rule.ts#L30)

___

### priority

 **priority**: `number`

A number indicating the priority of the price rule in comparison to other applicable price rules.

#### Defined in

[packages/types/src/pricing/common/price-rule.ts:29](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/pricing/common/price-rule.ts#L29)

___

### rule\_type

 **rule\_type**: [`RuleTypeDTO`](RuleTypeDTO.md)

An object of type [RuleTypeDTO](RuleTypeDTO.md) that holds the data of the associated rule type. It may only be available if the relation `rule_type` is expanded.

#### Defined in

[packages/types/src/pricing/common/price-rule.ts:26](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/pricing/common/price-rule.ts#L26)

___

### rule\_type\_id

 **rule\_type\_id**: `string`

A string indicating the ID of the associated rule type.

#### Defined in

[packages/types/src/pricing/common/price-rule.ts:25](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/pricing/common/price-rule.ts#L25)

___

### value

 **value**: `string`

A string indicating the value of the price rule.

#### Defined in

[packages/types/src/pricing/common/price-rule.ts:28](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/pricing/common/price-rule.ts#L28)
