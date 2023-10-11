---
displayed_sidebar: jsClientSidebar
---

# Class: AdminPostOrdersOrderClaimsReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AdminPostOrdersOrderClaimsReq

**`Schema`**

AdminPostOrdersOrderClaimsReq
type: object
required:
  - type
  - claim_items
properties:
  type:
    description: "The type of the Claim. This will determine how the Claim is treated: `replace` Claims will result in a Fulfillment with new items being created, while a `refund` Claim will refund the amount paid for the claimed items."
    type: string
    enum:
      - replace
      - refund
  claim_items:
    description: The Claim Items that the Claim will consist of.
    type: array
    items:
      type: object
      required:
        - item_id
        - quantity
      properties:
        item_id:
          description: The ID of the Line Item that will be claimed.
          type: string
        quantity:
          description: The number of items that will be returned
          type: integer
        note:
          description: Short text describing the Claim Item in further detail.
          type: string
        reason:
          description: The reason for the Claim
          type: string
          enum:
            - missing_item
            - wrong_item
            - production_failure
            - other
        tags:
          description: A list of tags to add to the Claim Item
          type: array
          items:
            type: string
        images:
          description: A list of image URL's that will be associated with the Claim
          items:
            type: string
  return_shipping:
     description: Optional details for the Return Shipping Method, if the items are to be sent back. Providing this field will result in a return being created and associated with the claim.
     type: object
     properties:
       option_id:
         type: string
         description: The ID of the Shipping Option to create the Shipping Method from.
       price:
         type: integer
         description: The price to charge for the Shipping Method.
  additional_items:
     description: The new items to send to the Customer. This is only used if the claim's type is `replace`.
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
           description: The quantity of the Product Variant.
           type: integer
  shipping_methods:
     description: The Shipping Methods to send the additional Line Items with. This is only used if the claim's type is `replace`.
     type: array
     items:
        type: object
        properties:
          id:
            description: The ID of an existing Shipping Method
            type: string
          option_id:
            description: The ID of the Shipping Option to create a Shipping Method from
            type: string
          price:
            description: The price to charge for the Shipping Method
            type: integer
          data:
            description: An optional set of key-value pairs to hold additional information.
            type: object
  shipping_address:
     description: "An optional shipping address to send the claimed items to. If not provided, the parent order's shipping address will be used."
     $ref: "#/components/schemas/AddressPayload"
  refund_amount:
     description: The amount to refund the customer. This is used when the claim's type is `refund`.
     type: integer
  no_notification:
     description: If set to true no notification will be send related to this Claim.
     type: boolean
  metadata:
     description: An optional set of key-value pairs to hold additional information.
     type: object
     externalDocs:
       description: "Learn about the metadata attribute, and how to delete and update it."
       url: "https://docs.medusajs.com/development/entities/overview#metadata-attribute"

## Properties

### additional\_items

• `Optional` **additional\_items**: [`AdditionalItem`](internal-8.AdditionalItem.md)[]

#### Defined in

packages/medusa/dist/api/routes/admin/orders/create-claim.d.ts:199

___

### claim\_items

• **claim\_items**: [`Item`](internal-8.Item-1.md)[]

#### Defined in

packages/medusa/dist/api/routes/admin/orders/create-claim.d.ts:197

___

### metadata

• `Optional` **metadata**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/api/routes/admin/orders/create-claim.d.ts:205

___

### no\_notification

• `Optional` **no\_notification**: `boolean`

#### Defined in

packages/medusa/dist/api/routes/admin/orders/create-claim.d.ts:203

___

### refund\_amount

• `Optional` **refund\_amount**: `number`

#### Defined in

packages/medusa/dist/api/routes/admin/orders/create-claim.d.ts:201

___

### return\_location\_id

• `Optional` **return\_location\_id**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/orders/create-claim.d.ts:204

___

### return\_shipping

• `Optional` **return\_shipping**: [`ReturnShipping`](internal-8.ReturnShipping.md)

#### Defined in

packages/medusa/dist/api/routes/admin/orders/create-claim.d.ts:198

___

### shipping\_address

• `Optional` **shipping\_address**: [`AddressPayload`](internal.AddressPayload.md)

#### Defined in

packages/medusa/dist/api/routes/admin/orders/create-claim.d.ts:202

___

### shipping\_methods

• `Optional` **shipping\_methods**: [`ShippingMethod`](internal-8.ShippingMethod-1.md)[]

#### Defined in

packages/medusa/dist/api/routes/admin/orders/create-claim.d.ts:200

___

### type

• **type**: ``"refund"`` \| ``"replace"``

#### Defined in

packages/medusa/dist/api/routes/admin/orders/create-claim.d.ts:196
