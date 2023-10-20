---
displayed_sidebar: jsClientSidebar
---

# Class: AdminPostShippingProfilesProfileReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AdminPostShippingProfilesProfileReq

**`Schema`**

AdminPostShippingProfilesProfileReq
type: object
properties:
  name:
    description: The name of the Shipping Profile
    type: string
  metadata:
    description: An optional set of key-value pairs with additional information.
    type: object
    externalDocs:
      description: "Learn about the metadata attribute, and how to delete and update it."
      url: "https://docs.medusajs.com/development/entities/overview#metadata-attribute"
  type:
    description: The type of the Shipping Profile
    type: string
    enum: [default, gift_card, custom]
  products:
    description: product IDs to associate with the Shipping Profile
    type: array
  shipping_options:
    description: Shipping option IDs to associate with the Shipping Profile
    type: array

## Properties

### metadata

• `Optional` **metadata**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/api/routes/admin/shipping-profiles/update-shipping-profile.d.ts:92

___

### name

• `Optional` **name**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/shipping-profiles/update-shipping-profile.d.ts:91

___

### products

• `Optional` **products**: `string`[]

#### Defined in

packages/medusa/dist/api/routes/admin/shipping-profiles/update-shipping-profile.d.ts:94

___

### shipping\_options

• `Optional` **shipping\_options**: `string`[]

#### Defined in

packages/medusa/dist/api/routes/admin/shipping-profiles/update-shipping-profile.d.ts:95

___

### type

• `Optional` **type**: [`ShippingProfileType`](../enums/internal-3.ShippingProfileType.md)

#### Defined in

packages/medusa/dist/api/routes/admin/shipping-profiles/update-shipping-profile.d.ts:93
