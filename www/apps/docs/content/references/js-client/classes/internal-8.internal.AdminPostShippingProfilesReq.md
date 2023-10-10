---
displayed_sidebar: jsClientSidebar
---

# Class: AdminPostShippingProfilesReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AdminPostShippingProfilesReq

**`Schema`**

AdminPostShippingProfilesReq
type: object
required:
  - name
  - type
properties:
  name:
    description: The name of the Shipping Profile
    type: string
  type:
    description: The type of the Shipping Profile
    type: string
    enum: [default, gift_card, custom]

## Properties

### metadata

• `Optional` **metadata**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/api/routes/admin/shipping-profiles/create-shipping-profile.d.ts:83

___

### name

• **name**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/shipping-profiles/create-shipping-profile.d.ts:81

___

### type

• **type**: [`ShippingProfileType`](../enums/internal-3.ShippingProfileType.md)

#### Defined in

packages/medusa/dist/api/routes/admin/shipping-profiles/create-shipping-profile.d.ts:82
