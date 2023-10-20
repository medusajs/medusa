---
displayed_sidebar: jsClientSidebar
---

# Class: AdminDeleteTaxRatesTaxRateProductTypesReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AdminDeleteTaxRatesTaxRateProductTypesReq

**`Schema`**

AdminDeleteTaxRatesTaxRateProductTypesReq
type: object
required:
  - product_types
properties:
  product_types:
    type: array
    description: "The IDs of the product types to remove their association with this tax rate."
    items:
      type: string

## Properties

### product\_types

• **product\_types**: `string`[]

#### Defined in

packages/medusa/dist/api/routes/admin/tax-rates/remove-from-product-types.d.ts:102
