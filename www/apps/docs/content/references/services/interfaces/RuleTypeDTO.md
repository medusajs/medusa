# RuleTypeDTO

A rule type's data.

## Properties

### default\_priority

 **default\_priority**: `number`

The priority of the rule type. This is useful when calculating the price of a price set, and multiple rules satisfy the provided context. The higher the value, the higher the priority of the rule type.

#### Defined in

packages/types/dist/pricing/common/rule-type.d.ts:16

___

### id

 **id**: `string`

The ID of the rule type.

#### Defined in

packages/types/dist/pricing/common/rule-type.d.ts:13

___

### name

 **name**: `string`

The display name of the rule type.

#### Defined in

packages/types/dist/pricing/common/rule-type.d.ts:14

___

### rule\_attribute

 **rule\_attribute**: `string`

The unique name used to later identify the rule_attribute. For example, it can be used in the `context` parameter of the `calculatePrices` method to specify a rule for calculating the price.

#### Defined in

packages/types/dist/pricing/common/rule-type.d.ts:15
