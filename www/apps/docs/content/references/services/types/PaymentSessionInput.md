# PaymentSessionInput

 **PaymentSessionInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `amount` | `number` |
| `cart` | [`Cart`](../classes/Cart.md) \| { `billing_address?`: [`Address`](../classes/Address.md) \| ``null`` ; `context`: Record<`string`, `unknown`\> ; `email`: `string` ; `id`: `string` ; `shipping_address`: [`Address`](../classes/Address.md) \| ``null`` ; `shipping_methods`: [`ShippingMethod`](../classes/ShippingMethod.md)[]  } |
| `currency_code` | `string` |
| `customer?` | [`Customer`](../classes/Customer.md) \| ``null`` |
| `paymentSessionData?` | Record<`string`, `unknown`\> |
| `payment_session_id?` | `string` |
| `provider_id` | `string` |
| `resource_id?` | `string` |

#### Defined in

[packages/medusa/src/types/payment.ts:9](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/types/payment.ts#L9)
