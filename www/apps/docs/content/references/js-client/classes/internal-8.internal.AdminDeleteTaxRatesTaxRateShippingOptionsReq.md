---
displayed_sidebar: jsClientSidebar
---

# Class: AdminDeleteTaxRatesTaxRateShippingOptionsReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AdminDeleteTaxRatesTaxRateShippingOptionsReq

**`Schema`**

AdminDeleteTaxRatesTaxRateShippingOptionsReq
type: object
required:
  - shipping_options
properties:
  shipping_options:
    type: array
    description: "The IDs of the shipping options to remove their association with this tax rate."
    items:
      type: string

## Properties

### shipping\_options

• **shipping\_options**: `string`[]

#### Defined in

packages/medusa/dist/api/routes/admin/tax-rates/remove-from-shipping-options.d.ts:102
