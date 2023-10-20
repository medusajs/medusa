---
displayed_sidebar: jsClientSidebar
---

# Class: AdminPostShippingOptionsReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AdminPostShippingOptionsReq

**`Schema`**

AdminPostShippingOptionsReq
type: object
required:
  - name
  - region_id
  - provider_id
  - data
  - price_type
properties:
  name:
    description: "The name of the Shipping Option"
    type: string
  region_id:
    description: "The ID of the Region in which the Shipping Option will be available."
    type: string
  provider_id:
    description: "The ID of the Fulfillment Provider that handles the Shipping Option."
    type: string
  profile_id:
    description: "The ID of the Shipping Profile to add the Shipping Option to."
    type: number
  data:
    description: "The data needed for the Fulfillment Provider to handle shipping with this Shipping Option."
    type: object
  price_type:
    description: "The type of the Shipping Option price. `flat_rate` indicates fixed pricing, whereas `calculated` indicates that the price will be calculated each time by the fulfillment provider."
    type: string
    enum:
      - flat_rate
      - calculated
  amount:
    description: "The amount to charge for the Shipping Option. If the `price_type` is set to `calculated`, this amount will not actually be used."
    type: integer
  requirements:
    description: "The requirements that must be satisfied for the Shipping Option to be available."
    type: array
    items:
      type: object
      required:
        - type
        - amount
      properties:
        type:
          description: The type of the requirement
          type: string
          enum:
            - max_subtotal
            - min_subtotal
        amount:
          description: The amount to compare with.
          type: integer
  is_return:
    description: Whether the Shipping Option can be used for returns or during checkout.
    type: boolean
    default: false
  admin_only:
    description: If set to `true`, the shipping option can only be used when creating draft orders.
    type: boolean
    default: false
  metadata:
    description: An optional set of key-value pairs with additional information.
    type: object
    externalDocs:
      description: "Learn about the metadata attribute, and how to delete and update it."
      url: "https://docs.medusajs.com/development/entities/overview#metadata-attribute"
  includes_tax:
    description: "Tax included in prices of shipping option"
    x-featureFlag: "tax_inclusive_pricing"
    type: boolean

## Properties

### admin\_only

• `Optional` **admin\_only**: `boolean`

#### Defined in

packages/medusa/dist/api/routes/admin/shipping-options/create-shipping-option.d.ts:157

___

### amount

• `Optional` **amount**: `number`

#### Defined in

packages/medusa/dist/api/routes/admin/shipping-options/create-shipping-option.d.ts:155

___

### data

• **data**: `object`

#### Defined in

packages/medusa/dist/api/routes/admin/shipping-options/create-shipping-option.d.ts:153

___

### includes\_tax

• `Optional` **includes\_tax**: `boolean`

#### Defined in

packages/medusa/dist/api/routes/admin/shipping-options/create-shipping-option.d.ts:160

___

### is\_return

• `Optional` **is\_return**: `boolean`

#### Defined in

packages/medusa/dist/api/routes/admin/shipping-options/create-shipping-option.d.ts:158

___

### metadata

• `Optional` **metadata**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/api/routes/admin/shipping-options/create-shipping-option.d.ts:159

___

### name

• **name**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/shipping-options/create-shipping-option.d.ts:149

___

### price\_type

• **price\_type**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/shipping-options/create-shipping-option.d.ts:154

___

### profile\_id

• `Optional` **profile\_id**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/shipping-options/create-shipping-option.d.ts:152

___

### provider\_id

• **provider\_id**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/shipping-options/create-shipping-option.d.ts:151

___

### region\_id

• **region\_id**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/shipping-options/create-shipping-option.d.ts:150

___

### requirements

• `Optional` **requirements**: [`OptionRequirement`](internal-8.OptionRequirement.md)[]

#### Defined in

packages/medusa/dist/api/routes/admin/shipping-options/create-shipping-option.d.ts:156
