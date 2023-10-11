---
displayed_sidebar: jsClientSidebar
---

# Class: AdminPostTaxRatesTaxRateShippingOptionsReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AdminPostTaxRatesTaxRateShippingOptionsReq

**`Schema`**

AdminPostTaxRatesTaxRateShippingOptionsReq
type: object
required:
  - shipping_options
properties:
  shipping_options:
    type: array
    description: "The IDs of the shipping options to associate with this tax rate"
    items:
      type: string

## Properties

### shipping\_options

• **shipping\_options**: `string`[]

#### Defined in

packages/medusa/dist/api/routes/admin/tax-rates/add-to-shipping-options.d.ts:102
