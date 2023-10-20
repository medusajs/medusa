---
displayed_sidebar: jsClientSidebar
---

# Class: AdminPostOrdersOrderFulfillmentsReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AdminPostOrdersOrderFulfillmentsReq

**`Schema`**

AdminPostOrdersOrderFulfillmentsReq
type: object
required:
  - items
properties:
  items:
    description: The Line Items to include in the Fulfillment.
    type: array
    items:
      type: object
      required:
        - item_id
        - quantity
      properties:
        item_id:
          description: The ID of the Line Item to fulfill.
          type: string
        quantity:
          description: The quantity of the Line Item to fulfill.
          type: integer
  no_notification:
    description: If set to `true`, no notification will be sent to the customer related to this fulfillment.
    type: boolean
  metadata:
    description: An optional set of key-value pairs to hold additional information.
    type: object
    externalDocs:
      description: "Learn about the metadata attribute, and how to delete and update it."
      url: "https://docs.medusajs.com/development/entities/overview#metadata-attribute"

## Properties

### items

• **items**: [`Item`](internal-8.Item-2.md)[]

#### Defined in

packages/medusa/dist/api/routes/admin/orders/create-fulfillment.d.ts:121

___

### location\_id

• `Optional` **location\_id**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/orders/create-fulfillment.d.ts:122

___

### metadata

• `Optional` **metadata**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/api/routes/admin/orders/create-fulfillment.d.ts:124

___

### no\_notification

• `Optional` **no\_notification**: `boolean`

#### Defined in

packages/medusa/dist/api/routes/admin/orders/create-fulfillment.d.ts:123
