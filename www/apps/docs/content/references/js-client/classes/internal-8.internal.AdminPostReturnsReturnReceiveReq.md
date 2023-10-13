---
displayed_sidebar: jsClientSidebar
---

# Class: AdminPostReturnsReturnReceiveReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AdminPostReturnsReturnReceiveReq

**`Schema`**

AdminPostReturnsReturnReceiveReq
type: object
required:
  - items
properties:
  items:
    description: The Line Items that have been received.
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
        quantity:
          description: The quantity of the Line Item.
          type: integer
  refund:
    description: The amount to refund.
    type: number

## Properties

### items

• **items**: [`Item`](internal-8.Item-4.md)[]

#### Defined in

packages/medusa/dist/api/routes/admin/returns/receive-return.d.ts:105

___

### location\_id

• `Optional` **location\_id**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/returns/receive-return.d.ts:107

___

### refund

• `Optional` **refund**: `number`

#### Defined in

packages/medusa/dist/api/routes/admin/returns/receive-return.d.ts:106
