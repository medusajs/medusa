---
displayed_sidebar: pricingReference
---

# AddPricesDTO

An object used to specify prices to add to a price set.

## Properties

### priceSetId

 **priceSetId**: `string`

A string indicating the ID of the price set to add prices to.

#### Defined in

[packages/types/src/pricing/common/price-set.ts:105](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/pricing/common/price-set.ts#L105)

___

### prices

 **prices**: [`CreatePricesDTO`](CreatePricesDTO.md)[]

An array of objects of type [CreatePricesDTO](CreatePricesDTO.md), each being a price to add to the price set.

#### Defined in

[packages/types/src/pricing/common/price-set.ts:106](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/pricing/common/price-set.ts#L106)
