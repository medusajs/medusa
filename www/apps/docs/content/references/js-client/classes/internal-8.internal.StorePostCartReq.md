---
displayed_sidebar: jsClientSidebar
---

# Class: StorePostCartReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).StorePostCartReq

**`Schema`**

StorePostCartReq
type: object
properties:
  region_id:
    type: string
    description: "The ID of the Region to create the Cart in. Setting the cart's region can affect the pricing of the items in the cart as well as the used currency.
     If this parameter is not provided, the first region in the store is used by default."
  sales_channel_id:
    type: string
    description: "The ID of the Sales channel to create the Cart in. The cart's sales channel affects which products can be added to the cart. If a product does not
     exist in the cart's sales channel, it cannot be added to the cart. If you add a publishable API key in the header of this request and specify a sales channel ID,
     the specified sales channel must be within the scope of the publishable API key's resources. If you add a publishable API key in the header of this request,
     you don't specify a sales channel ID, and the publishable API key is associated with one sales channel, that sales channel will be attached to the cart.
     If no sales channel is passed and no publishable API key header is passed or the publishable API key isn't associated with any sales channel,
     the cart will not be associated with any sales channel."
  country_code:
    type: string
    description: "The 2 character ISO country code to create the Cart in. Setting this parameter will set the country code of the shipping address."
    externalDocs:
     url: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Officially_assigned_code_elements
     description: See a list of codes.
  items:
    description: "An array of product variants to generate line items from."
    type: array
    items:
      type: object
      required:
        - variant_id
        - quantity
      properties:
        variant_id:
          description: The ID of the Product Variant.
          type: string
        quantity:
          description: The quantity to add into the cart.
          type: integer
  context:
    description: "An object to provide context to the Cart. The `context` field is automatically populated with `ip` and `user_agent`"
    type: object
    example:
      ip: "::1"
      user_agent: "Chrome"

## Properties

### context

• `Optional` **context**: `object`

#### Defined in

packages/medusa/dist/api/routes/store/carts/create-cart.d.ts:105

___

### country\_code

• `Optional` **country\_code**: `string`

#### Defined in

packages/medusa/dist/api/routes/store/carts/create-cart.d.ts:103

___

### items

• `Optional` **items**: [`Item`](internal-8.internal.Item.md)[]

#### Defined in

packages/medusa/dist/api/routes/store/carts/create-cart.d.ts:104

___

### region\_id

• `Optional` **region\_id**: `string`

#### Defined in

packages/medusa/dist/api/routes/store/carts/create-cart.d.ts:102

___

### sales\_channel\_id

• `Optional` **sales\_channel\_id**: `string`

#### Defined in

packages/medusa/dist/api/routes/store/carts/create-cart.d.ts:106
