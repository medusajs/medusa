---
displayed_sidebar: jsClientSidebar
---

# Class: AdminPostTaxRatesTaxRateProductsReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AdminPostTaxRatesTaxRateProductsReq

**`Schema`**

AdminPostTaxRatesTaxRateProductsReq
type: object
required:
  - products
properties:
  products:
    type: array
    description: "The IDs of the products to associate with this tax rate"
    items:
      type: string

## Properties

### products

• **products**: `string`[]

#### Defined in

packages/medusa/dist/api/routes/admin/tax-rates/add-to-products.d.ts:102
