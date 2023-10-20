---
displayed_sidebar: jsClientSidebar
---

# Class: AdminPostOrdersOrderReturnsReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AdminPostOrdersOrderReturnsReq

**`Schema`**

AdminPostOrdersOrderReturnsReq
type: object
required:
  - items
properties:
  items:
    description: The line items that will be returned.
    type: array
    items:
      type: object
      required:
        - item_id
        - quantity
      properties:
        item_id:
          description: The ID of the Line Item.
          type: string
        reason_id:
          description: The ID of the Return Reason to use.
          type: string
        note:
          description: An optional note with information about the Return.
          type: string
        quantity:
          description: The quantity of the Line Item.
          type: integer
  return_shipping:
    description: The Shipping Method to be used to handle the return shipment.
    type: object
    properties:
      option_id:
        type: string
        description: The ID of the Shipping Option to create the Shipping Method from.
      price:
        type: integer
        description: The price to charge for the Shipping Method.
  note:
    description: An optional note with information about the Return.
    type: string
  receive_now:
    description: A flag to indicate if the Return should be registerd as received immediately.
    type: boolean
    default: false
  no_notification:
    description: If set to `true`, no notification will be sent to the customer related to this Return.
    type: boolean
  refund:
    description: The amount to refund.
    type: integer

## Properties

### items

• **items**: [`OrdersReturnItem`](internal-8.OrdersReturnItem.md)[]

#### Defined in

packages/medusa/dist/api/routes/admin/orders/request-return.d.ts:136

___

### location\_id

• `Optional` **location\_id**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/orders/request-return.d.ts:142

___

### no\_notification

• `Optional` **no\_notification**: `boolean`

#### Defined in

packages/medusa/dist/api/routes/admin/orders/request-return.d.ts:140

___

### note

• `Optional` **note**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/orders/request-return.d.ts:138

___

### receive\_now

• `Optional` **receive\_now**: `boolean`

#### Defined in

packages/medusa/dist/api/routes/admin/orders/request-return.d.ts:139

___

### refund

• `Optional` **refund**: `number`

#### Defined in

packages/medusa/dist/api/routes/admin/orders/request-return.d.ts:141

___

### return\_shipping

• `Optional` **return\_shipping**: [`ReturnShipping`](internal-8.ReturnShipping-2.md)

#### Defined in

packages/medusa/dist/api/routes/admin/orders/request-return.d.ts:137
