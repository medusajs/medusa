---
displayed_sidebar: jsClientSidebar
---

# Class: AdminPostShippingOptionsOptionReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AdminPostShippingOptionsOptionReq

**`Schema`**

AdminPostShippingOptionsOptionReq
type: object
required:
  - requirements
properties:
  name:
    description: "The name of the Shipping Option"
    type: string
  amount:
    description: "The amount to charge for the Shipping Option. If the `price_type` of the shipping option is `calculated`, this amount will not actually be used."
    type: integer
  admin_only:
    description: If set to `true`, the shipping option can only be used when creating draft orders.
    type: boolean
  metadata:
    description: "An optional set of key-value pairs with additional information."
    type: object
    externalDocs:
      description: "Learn about the metadata attribute, and how to delete and update it."
      url: "https://docs.medusajs.com/development/entities/overview#metadata-attribute"
  requirements:
    description: "The requirements that must be satisfied for the Shipping Option to be available."
    type: array
    items:
      type: object
      required:
        - type
        - amount
      properties:
        id:
          description: The ID of an existing requirement. If an ID is passed, the existing requirement's details are updated. Otherwise, a new requirement is created.
          type: string
        type:
          description: The type of the requirement
          type: string
          enum:
            - max_subtotal
            - min_subtotal
        amount:
          description: The amount to compare with.
          type: integer
  includes_tax:
    description: "Tax included in prices of shipping option"
    x-featureFlag: "tax_inclusive_pricing"
    type: boolean

## Properties

### admin\_only

• `Optional` **admin\_only**: `boolean`

#### Defined in

packages/medusa/dist/api/routes/admin/shipping-options/update-shipping-option.d.ts:134

___

### amount

• `Optional` **amount**: `number`

#### Defined in

packages/medusa/dist/api/routes/admin/shipping-options/update-shipping-option.d.ts:132

___

### includes\_tax

• `Optional` **includes\_tax**: `boolean`

#### Defined in

packages/medusa/dist/api/routes/admin/shipping-options/update-shipping-option.d.ts:136

___

### metadata

• `Optional` **metadata**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/api/routes/admin/shipping-options/update-shipping-option.d.ts:135

___

### name

• **name**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/shipping-options/update-shipping-option.d.ts:131

___

### requirements

• **requirements**: [`OptionRequirement`](internal-8.OptionRequirement-1.md)[]

#### Defined in

packages/medusa/dist/api/routes/admin/shipping-options/update-shipping-option.d.ts:133
