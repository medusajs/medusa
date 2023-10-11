---
displayed_sidebar: pricingReference
---

# CreateRuleTypeDTO

An object used when creating a rule type to specify its data.

## Properties

### default\_priority

 `Optional` **default\_priority**: `number`

A number indicating the priority of the rule type. This is useful when calculating the price of a price set, and multiple rules satisfy the provided context. The higher the value, the higher the priority of the rule type.

#### Defined in

[packages/types/src/pricing/common/rule-type.ts:34](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/pricing/common/rule-type.ts#L34)

___

### id

 `Optional` **id**: `string`

A string indicating the ID of the rule type.

#### Defined in

[packages/types/src/pricing/common/rule-type.ts:31](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/pricing/common/rule-type.ts#L31)

___

### name

 **name**: `string`

A string indicating the display name of the rule type.

#### Defined in

[packages/types/src/pricing/common/rule-type.ts:32](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/pricing/common/rule-type.ts#L32)

___

### rule\_attribute

 **rule\_attribute**: `string`

A string indicating a unique name used to later identify the rule_attribute. For example, it can be used in the `context` parameter of the `calculatePrices` method to specify a rule for calculating the price.

#### Defined in

[packages/types/src/pricing/common/rule-type.ts:33](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/pricing/common/rule-type.ts#L33)
