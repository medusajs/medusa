---
displayed_sidebar: jsClientSidebar
---

# Class: AdminDeleteTaxRatesTaxRateProductsReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AdminDeleteTaxRatesTaxRateProductsReq

**`Schema`**

AdminDeleteTaxRatesTaxRateProductsReq
type: object
required:
  - products
properties:
  products:
    type: array
    description: "The IDs of the products to remove their association with this tax rate."
    items:
      type: string

## Properties

### products

• **products**: `string`[]

#### Defined in

packages/medusa/dist/api/routes/admin/tax-rates/remove-from-products.d.ts:102
