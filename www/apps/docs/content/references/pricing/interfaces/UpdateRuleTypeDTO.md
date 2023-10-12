---
displayed_sidebar: pricingReference
---

# UpdateRuleTypeDTO

An object used when updating a rule type to specify the data to update.

## Properties

### default\_priority

 `Optional` **default\_priority**: `number`

A number indicating the priority of the rule type. This is useful when calculating the price of a price set, and multiple rules satisfy the provided context. The higher the value, the higher the priority of the rule type.

#### Defined in

[packages/types/src/pricing/common/rule-type.ts:51](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/pricing/common/rule-type.ts#L51)

___

### id

 **id**: `string`

A string indicating the ID of the rule type to update.

#### Defined in

[packages/types/src/pricing/common/rule-type.ts:48](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/pricing/common/rule-type.ts#L48)

___

### name

 `Optional` **name**: `string`

A string indicating the display name of the rule type.

#### Defined in

[packages/types/src/pricing/common/rule-type.ts:49](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/pricing/common/rule-type.ts#L49)

___

### rule\_attribute

 `Optional` **rule\_attribute**: `string`

A string indicating a unique name used to later identify the rule_attribute. For example, it can be used in the `context` parameter of the `calculatePrices` method to specify a rule for calculating the price.

#### Defined in

[packages/types/src/pricing/common/rule-type.ts:50](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/pricing/common/rule-type.ts#L50)
