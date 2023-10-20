---
displayed_sidebar: jsClientSidebar
---

# Class: AdminPostRegionsReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AdminPostRegionsReq

**`Schema`**

AdminPostRegionsReq
type: object
required:
  - name
  - currency_code
  - tax_rate
  - payment_providers
  - fulfillment_providers
  - countries
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
  tax_code:
    description: "The tax code of the Region."
    type: string
  tax_rate:
    description: "The tax rate to use in the Region."
    type: number
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
    example: ["US"]
    type: array
    items:
      type: string
  includes_tax:
    x-featureFlag: "tax_inclusive_pricing"
    description: "Whether taxes are included in the prices of the region."
    type: boolean

## Properties

### countries

• **countries**: `string`[]

#### Defined in

packages/medusa/dist/api/routes/admin/regions/create-region.d.ts:140

___

### currency\_code

• **currency\_code**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/regions/create-region.d.ts:135

___

### fulfillment\_providers

• **fulfillment\_providers**: `string`[]

#### Defined in

packages/medusa/dist/api/routes/admin/regions/create-region.d.ts:139

___

### includes\_tax

• `Optional` **includes\_tax**: `boolean`

#### Defined in

packages/medusa/dist/api/routes/admin/regions/create-region.d.ts:141

___

### metadata

• `Optional` **metadata**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/api/routes/admin/regions/create-region.d.ts:142

___

### name

• **name**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/regions/create-region.d.ts:134

___

### payment\_providers

• **payment\_providers**: `string`[]

#### Defined in

packages/medusa/dist/api/routes/admin/regions/create-region.d.ts:138

___

### tax\_code

• `Optional` **tax\_code**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/regions/create-region.d.ts:136

___

### tax\_rate

• **tax\_rate**: `number`

#### Defined in

packages/medusa/dist/api/routes/admin/regions/create-region.d.ts:137
