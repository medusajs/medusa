---
displayed_sidebar: jsClientSidebar
---

# Class: AdminPostPriceListsPriceListPriceListReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AdminPostPriceListsPriceListPriceListReq

**`Schema`**

AdminPostPriceListsPriceListPriceListReq
type: object
properties:
  name:
    description: "The name of the Price List"
    type: string
  description:
    description: "The description of the Price List."
    type: string
  starts_at:
    description: "The date with timezone that the Price List starts being valid."
    type: string
    format: date
  ends_at:
    description: "The date with timezone that the Price List ends being valid."
    type: string
    format: date
  type:
    description: The type of the Price List.
    type: string
    enum:
     - sale
     - override
  status:
    description: "The status of the Price List. If the status is set to `draft`, the prices created in the price list will not be available of the customer."
    type: string
    enum:
     - active
     - draft
  prices:
    description: The prices of the Price List.
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
  customer_groups:
    type: array
    description: An array of customer groups that the Price List applies to.
    items:
      type: object
      required:
        - id
      properties:
        id:
          description: The ID of a customer group
          type: string
  includes_tax:
    description: "Tax included in prices of price list"
    x-featureFlag: "tax_inclusive_pricing"
    type: boolean

## Properties

### customer\_groups

• `Optional` **customer\_groups**: [`CustomerGroup`](internal-8.CustomerGroup-1.md)[]

#### Defined in

packages/medusa/dist/api/routes/admin/price-lists/update-price-list.d.ts:157

___

### description

• `Optional` **description**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/price-lists/update-price-list.d.ts:151

___

### ends\_at

• `Optional` **ends\_at**: ``null`` \| `Date`

#### Defined in

packages/medusa/dist/api/routes/admin/price-lists/update-price-list.d.ts:153

___

### includes\_tax

• `Optional` **includes\_tax**: `boolean`

#### Defined in

packages/medusa/dist/api/routes/admin/price-lists/update-price-list.d.ts:158

___

### name

• `Optional` **name**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/price-lists/update-price-list.d.ts:150

___

### prices

• `Optional` **prices**: [`AdminPriceListPricesUpdateReq`](internal-8.internal.AdminPriceListPricesUpdateReq.md)[]

#### Defined in

packages/medusa/dist/api/routes/admin/price-lists/update-price-list.d.ts:156

___

### starts\_at

• `Optional` **starts\_at**: ``null`` \| `Date`

#### Defined in

packages/medusa/dist/api/routes/admin/price-lists/update-price-list.d.ts:152

___

### status

• `Optional` **status**: [`PriceListStatus`](../enums/internal-3.PriceListStatus.md)

#### Defined in

packages/medusa/dist/api/routes/admin/price-lists/update-price-list.d.ts:154

___

### type

• `Optional` **type**: [`PriceListType`](../enums/internal-3.PriceListType.md)

#### Defined in

packages/medusa/dist/api/routes/admin/price-lists/update-price-list.d.ts:155
