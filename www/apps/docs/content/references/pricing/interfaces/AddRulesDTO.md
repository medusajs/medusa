---
displayed_sidebar: pricingReference
---

# AddRulesDTO

An object used to specify the rules to add to a price set.

## Properties

### priceSetId

 **priceSetId**: `string`

A string indicating the ID of the price set to add the rules to.

#### Defined in

[packages/types/src/pricing/common/price-set.ts:81](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/pricing/common/price-set.ts#L81)

___

### rules

 **rules**: { `attribute`: `string`  }[]

An array of objects, each object holds a property `attribute`, with its value being the `rule_attribute` of the rule to add to the price set.

#### Defined in

[packages/types/src/pricing/common/price-set.ts:82](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/pricing/common/price-set.ts#L82)
