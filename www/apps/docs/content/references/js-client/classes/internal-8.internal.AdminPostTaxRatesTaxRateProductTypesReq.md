---
displayed_sidebar: jsClientSidebar
---

# Class: AdminPostTaxRatesTaxRateProductTypesReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AdminPostTaxRatesTaxRateProductTypesReq

**`Schema`**

AdminPostTaxRatesTaxRateProductTypesReq
type: object
required:
  - product_types
properties:
  product_types:
    type: array
    description: "The IDs of the types of products to associate with this tax rate"
    items:
      type: string

## Properties

### product\_types

• **product\_types**: `string`[]

#### Defined in

packages/medusa/dist/api/routes/admin/tax-rates/add-to-product-types.d.ts:102
