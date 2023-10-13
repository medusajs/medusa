---
displayed_sidebar: jsClientSidebar
---

# Class: AdminPostDraftOrdersReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AdminPostDraftOrdersReq

**`Schema`**

AdminPostDraftOrdersReq
type: object
required:
  - email
  - region_id
  - shipping_methods
properties:
  status:
    description: "The status of the draft order. The draft order's default status is `open`. It's changed to `completed` when its payment is marked as paid."
    type: string
    enum: [open, completed]
  email:
    description: "The email of the customer of the draft order"
    type: string
    format: email
  billing_address:
    description: "The Address to be used for billing purposes."
    anyOf:
      - $ref: "#/components/schemas/AddressPayload"
      - type: string
  shipping_address:
    description: "The Address to be used for shipping purposes."
    anyOf:
      - $ref: "#/components/schemas/AddressPayload"
      - type: string
  items:
    description: The draft order's line items.
    type: array
    items:
      type: object
      required:
        - quantity
      properties:
        variant_id:
          description: The ID of the Product Variant associated with the line item. If the line item is custom, the `variant_id` should be omitted.
          type: string
        unit_price:
          description: The custom price of the line item. If a `variant_id` is supplied, the price provided here will override the variant's price.
          type: integer
        title:
          description: The title of the line item if `variant_id` is not provided.
          type: string
        quantity:
          description: The quantity of the line item.
          type: integer
        metadata:
          description: The optional key-value map with additional details about the line item.
          type: object
          externalDocs:
            description: "Learn about the metadata attribute, and how to delete and update it."
            url: "https://docs.medusajs.com/development/entities/overview#metadata-attribute"
  region_id:
    description: The ID of the region for the draft order
    type: string
  discounts:
    description: The discounts to add to the draft order
    type: array
    items:
      type: object
      required:
        - code
      properties:
        code:
          description: The code of the discount to apply
          type: string
  customer_id:
    description: The ID of the customer this draft order is associated with.
    type: string
  no_notification_order:
    description: An optional flag passed to the resulting order that indicates whether the customer should receive notifications about order updates.
    type: boolean
  shipping_methods:
    description: The shipping methods for the draft order
    type: array
    items:
      type: object
      required:
         - option_id
      properties:
        option_id:
          description: The ID of the shipping option in use
          type: string
        data:
          description: The optional additional data needed for the shipping method
          type: object
        price:
          description: The price of the shipping method.
          type: integer
  metadata:
    description: The optional key-value map with additional details about the Draft Order.
    type: object
    externalDocs:
      description: "Learn about the metadata attribute, and how to delete and update it."
      url: "https://docs.medusajs.com/development/entities/overview#metadata-attribute"

## Properties

### billing\_address

• `Optional` **billing\_address**: `string` \| [`AddressPayload`](internal.AddressPayload.md)

#### Defined in

packages/medusa/dist/api/routes/admin/draft-orders/create-draft-order.d.ts:186

___

### customer\_id

• `Optional` **customer\_id**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/draft-orders/create-draft-order.d.ts:191

___

### discounts

• `Optional` **discounts**: [`Discount`](internal-8.Discount.md)[]

#### Defined in

packages/medusa/dist/api/routes/admin/draft-orders/create-draft-order.d.ts:190

___

### email

• **email**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/draft-orders/create-draft-order.d.ts:185

___

### items

• `Optional` **items**: [`Item`](internal-8.Item.md)[]

#### Defined in

packages/medusa/dist/api/routes/admin/draft-orders/create-draft-order.d.ts:188

___

### metadata

• `Optional` **metadata**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/api/routes/admin/draft-orders/create-draft-order.d.ts:194

___

### no\_notification\_order

• `Optional` **no\_notification\_order**: `boolean`

#### Defined in

packages/medusa/dist/api/routes/admin/draft-orders/create-draft-order.d.ts:192

___

### region\_id

• **region\_id**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/draft-orders/create-draft-order.d.ts:189

___

### shipping\_address

• `Optional` **shipping\_address**: `string` \| [`AddressPayload`](internal.AddressPayload.md)

#### Defined in

packages/medusa/dist/api/routes/admin/draft-orders/create-draft-order.d.ts:187

___

### shipping\_methods

• **shipping\_methods**: [`ShippingMethod`](internal-8.ShippingMethod.md)[]

#### Defined in

packages/medusa/dist/api/routes/admin/draft-orders/create-draft-order.d.ts:193

___

### status

• `Optional` **status**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/draft-orders/create-draft-order.d.ts:184
