---
displayed_sidebar: jsClientSidebar
---

# Class: AdminPostOrdersOrderRefundsReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AdminPostOrdersOrderRefundsReq

**`Schema`**

AdminPostOrdersOrderRefundsReq
type: object
required:
  - amount
  - reason
properties:
  amount:
    description: The amount to refund. It should be less than or equal the `refundable_amount` of the order.
    type: integer
  reason:
    description: The reason for the Refund.
    type: string
  note:
    description: A note with additional details about the Refund.
    type: string
  no_notification:
    description: If set to `true`, no notification will be sent to the customer related to this Refund.
    type: boolean

## Properties

### amount

• **amount**: `number`

#### Defined in

packages/medusa/dist/api/routes/admin/orders/refund-payment.d.ts:93

___

### no\_notification

• `Optional` **no\_notification**: `boolean`

#### Defined in

packages/medusa/dist/api/routes/admin/orders/refund-payment.d.ts:96

___

### note

• `Optional` **note**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/orders/refund-payment.d.ts:95

___

### reason

• **reason**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/orders/refund-payment.d.ts:94
