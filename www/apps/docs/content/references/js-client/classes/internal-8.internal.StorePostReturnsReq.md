---
displayed_sidebar: jsClientSidebar
---

# Class: StorePostReturnsReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).StorePostReturnsReq

**`Schema`**

StorePostReturnsReq
type: object
required:
  - order_id
  - items
properties:
  order_id:
    type: string
    description: The ID of the Order to create the return for.
  items:
    description: "The items to include in the return."
    type: array
    items:
      type: object
      required:
        - item_id
        - quantity
      properties:
        item_id:
          description: The ID of the line item to return.
          type: string
        quantity:
          description: The quantity to return.
          type: integer
        reason_id:
          description: The ID of the return reason. Return reasons can be retrieved from the List Return Reasons endpoint.
          type: string
        note:
          description: A note to add to the item returned.
          type: string
  return_shipping:
    description: The return shipping method used to return the items. If provided, a fulfillment is automatically created for the return.
    type: object
    required:
      - option_id
    properties:
      option_id:
        type: string
        description: The ID of the Shipping Option to create the Shipping Method from.

## Properties

### items

• **items**: [`Item`](internal-8.Item-5.md)[]

#### Defined in

packages/medusa/dist/api/routes/store/returns/create-return.d.ts:122

___

### order\_id

• **order\_id**: `string`

#### Defined in

packages/medusa/dist/api/routes/store/returns/create-return.d.ts:121

___

### return\_shipping

• `Optional` **return\_shipping**: [`ReturnShipping`](internal-8.ReturnShipping-3.md)

#### Defined in

packages/medusa/dist/api/routes/store/returns/create-return.d.ts:123
