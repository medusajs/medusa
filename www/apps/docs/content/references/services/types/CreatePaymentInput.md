# CreatePaymentInput

 **CreatePaymentInput**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `amount` | `number` | - |
| `cart_id?` | `string` | - |
| `currency_code` | `string` | - |
| `payment_session` | [`PaymentSession`](../classes/PaymentSession.md) | A Payment Session is created when a Customer initilizes the checkout flow, and can be used to hold the state of a payment flow. Each Payment Session is controlled by a Payment Provider, which is responsible for the communication with external payment services. Authorized Payment Sessions will eventually get promoted to Payments to indicate that they are authorized for payment processing such as capture or refund. Payment sessions can also be used as part of payment collections. |
| `provider_id?` | `string` | - |
| `resource_id?` | `string` | - |

#### Defined in

[packages/medusa/src/types/payment.ts:30](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/types/payment.ts#L30)
