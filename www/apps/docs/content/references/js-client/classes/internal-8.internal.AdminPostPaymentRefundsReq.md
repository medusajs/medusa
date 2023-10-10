---
displayed_sidebar: jsClientSidebar
---

# Class: AdminPostPaymentRefundsReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AdminPostPaymentRefundsReq

**`Schema`**

AdminPostPaymentRefundsReq
type: object
required:
  - amount
  - reason
properties:
  amount:
    description: The amount to refund.
    type: integer
  reason:
    description: The reason for the Refund.
    type: string
  note:
    description: A note with additional details about the Refund.
    type: string

## Properties

### amount

• **amount**: `number`

#### Defined in

packages/medusa/dist/api/routes/admin/payments/refund-payment.d.ts:89

___

### note

• `Optional` **note**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/payments/refund-payment.d.ts:91

___

### reason

• **reason**: [`RefundReason`](../enums/internal-8.internal.RefundReason.md)

#### Defined in

packages/medusa/dist/api/routes/admin/payments/refund-payment.d.ts:90
