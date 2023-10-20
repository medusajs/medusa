---
displayed_sidebar: jsClientSidebar
---

# Class: AdminPostTaxRatesTaxRateReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AdminPostTaxRatesTaxRateReq

**`Schema`**

AdminPostTaxRatesTaxRateReq
type: object
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
    description: "The IDs of the products associated with this tax rate"
    items:
      type: string
  shipping_options:
    type: array
    description: "The IDs of the shipping options associated with this tax rate"
    items:
      type: string
  product_types:
    type: array
    description: "The IDs of the types of product types associated with this tax rate"
    items:
      type: string

## Properties

### code

• `Optional` **code**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/tax-rates/update-tax-rate.d.ts:118

___

### name

• `Optional` **name**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/tax-rates/update-tax-rate.d.ts:119

___

### product\_types

• `Optional` **product\_types**: `string`[]

#### Defined in

packages/medusa/dist/api/routes/admin/tax-rates/update-tax-rate.d.ts:124

___

### products

• `Optional` **products**: `string`[]

#### Defined in

packages/medusa/dist/api/routes/admin/tax-rates/update-tax-rate.d.ts:122

___

### rate

• `Optional` **rate**: ``null`` \| `number`

#### Defined in

packages/medusa/dist/api/routes/admin/tax-rates/update-tax-rate.d.ts:121

___

### region\_id

• `Optional` **region\_id**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/tax-rates/update-tax-rate.d.ts:120

___

### shipping\_options

• `Optional` **shipping\_options**: `string`[]

#### Defined in

packages/medusa/dist/api/routes/admin/tax-rates/update-tax-rate.d.ts:123
