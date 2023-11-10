# PriceRuleDTO

A price rule's data.

## Properties

### id

 **id**: `string`

The ID of the price rule.

#### Defined in

packages/types/dist/pricing/common/price-rule.d.ts:20

___

### price\_list\_id

 **price\_list\_id**: `string`

The ID of the associated price list.

#### Defined in

packages/types/dist/pricing/common/price-rule.d.ts:35

___

### price\_set

 **price\_set**: [`PriceSetDTO`](PriceSetDTO.md)

The associated price set. It may only be available if the relation `price_set` is expanded.

#### Defined in

packages/types/dist/pricing/common/price-rule.d.ts:22

___

### price\_set\_id

 **price\_set\_id**: `string`

The ID of the associated price set.

#### Defined in

packages/types/dist/pricing/common/price-rule.d.ts:21

___

### price\_set\_money\_amount\_id

 **price\_set\_money\_amount\_id**: `string`

The ID of the associated price set money amount.

#### Defined in

packages/types/dist/pricing/common/price-rule.d.ts:34

___

### priority

 **priority**: `number`

The priority of the price rule in comparison to other applicable price rules.

#### Defined in

packages/types/dist/pricing/common/price-rule.d.ts:33

___

### rule\_type

 **rule\_type**: [`RuleTypeDTO`](RuleTypeDTO.md)

The associated rule type. It may only be available if the relation `rule_type` is expanded.

#### Defined in

packages/types/dist/pricing/common/price-rule.d.ts:24

___

### rule\_type\_id

 **rule\_type\_id**: `string`

The ID of the associated rule type.

#### Defined in

packages/types/dist/pricing/common/price-rule.d.ts:23

___

### value

 **value**: `string`

The value of the price rule.

#### Defined in

packages/types/dist/pricing/common/price-rule.d.ts:32
