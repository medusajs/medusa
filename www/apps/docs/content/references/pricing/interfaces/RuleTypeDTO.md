---
displayed_sidebar: pricingReference
---

# RuleTypeDTO

An object that holds the details of a rule type.

## Properties

### default\_priority

 **default\_priority**: `number`

A number indicating the priority of the rule type. This is useful when calculating the price of a price set, and multiple rules satisfy the provided context. The higher the value, the higher the priority of the rule type.

#### Defined in

[packages/types/src/pricing/common/rule-type.ts:17](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/pricing/common/rule-type.ts#L17)

___

### id

 **id**: `string`

A string indicating the ID of the rule type.

#### Defined in

[packages/types/src/pricing/common/rule-type.ts:14](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/pricing/common/rule-type.ts#L14)

___

### name

 **name**: `string`

A string indicating the display name of the rule type.

#### Defined in

[packages/types/src/pricing/common/rule-type.ts:15](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/pricing/common/rule-type.ts#L15)

___

### rule\_attribute

 **rule\_attribute**: `string`

A string indicating a unique name used to later identify the rule_attribute. For example, it can be used in the `context` parameter of the `calculatePrices` method to specify a rule for calculating the price.

#### Defined in

[packages/types/src/pricing/common/rule-type.ts:16](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/pricing/common/rule-type.ts#L16)
