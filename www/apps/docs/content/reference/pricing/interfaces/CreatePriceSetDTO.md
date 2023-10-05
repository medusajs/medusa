---
displayed_sidebar: modules
---

# CreatePriceSetDTO

An object of expected properties when creating a price set.

## Properties

### prices

 `Optional` **prices**: [`CreatePricesDTO`](CreatePricesDTO.md)[]

An array of objects of type [CreatePricesDTO](CreatePricesDTO.md), each being a price to associate with the price set.

#### Defined in

[packages/types/src/pricing/common/price-set.ts:126](https://github.com/medusajs/medusa/blob/0350eeb0a1/packages/types/src/pricing/common/price-set.ts#L126)

___

### rules

 `Optional` **rules**: { `rule_attribute`: `string`  }[]

An array of objects, each object accepts a property `rule_attribute`, whose value is a string indicating the `rule_attribute` value of a rule type. 
This property is used to specify the rule types associated with the price set.

#### Defined in

[packages/types/src/pricing/common/price-set.ts:125](https://github.com/medusajs/medusa/blob/0350eeb0a1/packages/types/src/pricing/common/price-set.ts#L125)
