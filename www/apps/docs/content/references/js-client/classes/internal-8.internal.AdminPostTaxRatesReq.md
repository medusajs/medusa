---
displayed_sidebar: jsClientSidebar
---

# Class: AdminPostTaxRatesReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AdminPostTaxRatesReq

**`Schema`**

AdminPostTaxRatesReq
type: object
required:
  - code
  - name
  - region_id
properties:
  code:
    type: string
    description: "The code of the tax rate."
  name:
    type: string
    description: "The name of the tax rate."
  region_id:
    type: string
    description: "The ID of the Region that the tax rate belongs to."
  rate:
    type: number
    description: "The numeric rate to charge."
  products:
    type: array
    description: "The IDs of the products associated with this tax rate."
    items:
      type: string
  shipping_options:
    type: array
    description: "The IDs of the shipping options associated with this tax rate"
    items:
      type: string
  product_types:
    type: array
    description: "The IDs of the types of products associated with this tax rate"
    items:
      type: string

## Properties

### code

• **code**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/tax-rates/create-tax-rate.d.ts:125

___

### name

• **name**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/tax-rates/create-tax-rate.d.ts:126

___

### product\_types

• `Optional` **product\_types**: `string`[]

#### Defined in

packages/medusa/dist/api/routes/admin/tax-rates/create-tax-rate.d.ts:131

___

### products

• `Optional` **products**: `string`[]

#### Defined in

packages/medusa/dist/api/routes/admin/tax-rates/create-tax-rate.d.ts:129

___

### rate

• `Optional` **rate**: ``null`` \| `number`

#### Defined in

packages/medusa/dist/api/routes/admin/tax-rates/create-tax-rate.d.ts:128

___

### region\_id

• **region\_id**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/tax-rates/create-tax-rate.d.ts:127

___

### shipping\_options

• `Optional` **shipping\_options**: `string`[]

#### Defined in

packages/medusa/dist/api/routes/admin/tax-rates/create-tax-rate.d.ts:130
