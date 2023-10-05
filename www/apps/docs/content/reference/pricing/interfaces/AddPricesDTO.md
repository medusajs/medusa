---
displayed_sidebar: modules
---

# AddPricesDTO

An object used to specify prices to add to a price set.

## Properties

### priceSetId

 **priceSetId**: `string`

A string indicating the ID of the price set to add prices to.

#### Defined in

[packages/types/src/pricing/common/price-set.ts:97](https://github.com/medusajs/medusa/blob/0350eeb0a1/packages/types/src/pricing/common/price-set.ts#L97)

___

### prices

 **prices**: [`CreatePricesDTO`](CreatePricesDTO.md)[]

An array of objects of type [CreatePricesDTO](CreatePricesDTO.md), each being a price to add to the price set.

#### Defined in

[packages/types/src/pricing/common/price-set.ts:98](https://github.com/medusajs/medusa/blob/0350eeb0a1/packages/types/src/pricing/common/price-set.ts#L98)
