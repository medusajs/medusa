---
displayed_sidebar: jsClientSidebar
---

# Class: AdminPostPriceListPricesPricesReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AdminPostPriceListPricesPricesReq

**`Schema`**

AdminPostPriceListPricesPricesReq
type: object
properties:
  prices:
    description: The prices to update or add.
    type: array
    items:
      type: object
      required:
        - amount
        - variant_id
      properties:
        id:
          description: The ID of the price.
          type: string
        region_id:
          description: The ID of the Region for which the price is used. This is only required if `currecny_code` is not provided.
          type: string
        currency_code:
          description: The 3 character ISO currency code for which the price will be used. This is only required if `region_id` is not provided.
          type: string
          externalDocs:
            url: https://en.wikipedia.org/wiki/ISO_4217#Active_codes
            description: See a list of codes.
        variant_id:
          description: The ID of the Variant for which the price is used.
          type: string
        amount:
          description: The amount to charge for the Product Variant.
          type: integer
        min_quantity:
          description: The minimum quantity for which the price will be used.
          type: integer
        max_quantity:
          description: The maximum quantity for which the price will be used.
          type: integer
  override:
    description: "If set to `true`, the prices will replace all existing prices associated with the Price List."
    type: boolean

## Properties

### override

• `Optional` **override**: `boolean`

#### Defined in

packages/medusa/dist/api/routes/admin/price-lists/add-prices-batch.d.ts:122

___

### prices

• **prices**: [`AdminPriceListPricesUpdateReq`](internal-8.internal.AdminPriceListPricesUpdateReq.md)[]

#### Defined in

packages/medusa/dist/api/routes/admin/price-lists/add-prices-batch.d.ts:121
