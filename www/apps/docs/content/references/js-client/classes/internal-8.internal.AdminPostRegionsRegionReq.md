---
displayed_sidebar: jsClientSidebar
---

# Class: AdminPostRegionsRegionReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AdminPostRegionsRegionReq

**`Schema`**

AdminPostRegionsRegionReq
type: object
properties:
  name:
    description: "The name of the Region"
    type: string
  currency_code:
    description: "The 3 character ISO currency code to use in the Region."
    type: string
    externalDocs:
      url: https://en.wikipedia.org/wiki/ISO_4217#Active_codes
      description: See a list of codes.
  automatic_taxes:
    description: "If set to `true`, the Medusa backend will automatically calculate taxes for carts in this region. If set to `false`, the taxes must be calculated manually."
    externalDocs:
      url: https://docs.medusajs.com/modules/taxes/storefront/manual-calculation
      description: How to calculate taxes in a storefront.
    type: boolean
  gift_cards_taxable:
    description: "If set to `true`, taxes will be applied on gift cards."
    type: boolean
  tax_provider_id:
    description: "The ID of the tax provider to use. If none provided, the system tax provider is used."
    type: string
  tax_code:
    description: "The tax code of the Region."
    type: string
  tax_rate:
    description: "The tax rate to use in the Region."
    type: number
  includes_tax:
    x-featureFlag: "tax_inclusive_pricing"
    description: "Whether taxes are included in the prices of the region."
    type: boolean
  payment_providers:
    description: "A list of Payment Provider IDs that can be used in the Region"
    type: array
    items:
      type: string
  fulfillment_providers:
    description: "A list of Fulfillment Provider IDs that can be used in the Region"
    type: array
    items:
      type: string
  countries:
    description: "A list of countries' 2 ISO characters that should be included in the Region."
    type: array
    items:
      type: string

## Properties

### automatic\_taxes

• `Optional` **automatic\_taxes**: `boolean`

#### Defined in

packages/medusa/dist/api/routes/admin/regions/update-region.d.ts:123

___

### countries

• `Optional` **countries**: `string`[]

#### Defined in

packages/medusa/dist/api/routes/admin/regions/update-region.d.ts:127

___

### currency\_code

• `Optional` **currency\_code**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/regions/update-region.d.ts:119

___

### fulfillment\_providers

• `Optional` **fulfillment\_providers**: `string`[]

#### Defined in

packages/medusa/dist/api/routes/admin/regions/update-region.d.ts:126

___

### gift\_cards\_taxable

• `Optional` **gift\_cards\_taxable**: `boolean`

#### Defined in

packages/medusa/dist/api/routes/admin/regions/update-region.d.ts:122

___

### includes\_tax

• `Optional` **includes\_tax**: `boolean`

#### Defined in

packages/medusa/dist/api/routes/admin/regions/update-region.d.ts:128

___

### metadata

• `Optional` **metadata**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/api/routes/admin/regions/update-region.d.ts:129

___

### name

• `Optional` **name**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/regions/update-region.d.ts:118

___

### payment\_providers

• `Optional` **payment\_providers**: `string`[]

#### Defined in

packages/medusa/dist/api/routes/admin/regions/update-region.d.ts:125

___

### tax\_code

• `Optional` **tax\_code**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/regions/update-region.d.ts:120

___

### tax\_provider\_id

• `Optional` **tax\_provider\_id**: ``null`` \| `string`

#### Defined in

packages/medusa/dist/api/routes/admin/regions/update-region.d.ts:124

___

### tax\_rate

• `Optional` **tax\_rate**: `number`

#### Defined in

packages/medusa/dist/api/routes/admin/regions/update-region.d.ts:121
