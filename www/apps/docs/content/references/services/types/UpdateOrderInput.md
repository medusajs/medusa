# UpdateOrderInput

 **UpdateOrderInput**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `billing_address?` | [`AddressPayload`](../classes/AddressPayload.md) | Address fields used when creating/updating an address. |
| `customer_id?` | `string` | - |
| `discounts?` | `object`[] | - |
| `email?` | `string` | - |
| `fulfillment_status?` | [`FulfillmentStatus`](../enums/FulfillmentStatus-1.md) | - |
| `items?` | `object`[] | - |
| `metadata?` | Record<`string`, `unknown`\> | - |
| `no_notification?` | `boolean` | - |
| `payment?` | [`Payment`](../classes/Payment.md) | A payment is originally created from a payment session. Once a payment session is authorized, the payment is created to represent the authorized amount with a given payment method. Payments can be captured, canceled or refunded. Payments can be made towards orders, swaps, order edits, or other resources. |
| `payment_method?` | { `data?`: Record<`string`, `unknown`\> ; `provider_id?`: `string`  } | - |
| `payment_method.data?` | Record<`string`, `unknown`\> | - |
| `payment_method.provider_id?` | `string` | - |
| `payment_status?` | [`PaymentStatus`](../enums/PaymentStatus-1.md) | - |
| `region?` | `string` | - |
| `shipping_address?` | [`AddressPayload`](../classes/AddressPayload.md) | Address fields used when creating/updating an address. |
| `shipping_method?` | { `data?`: Record<`string`, `unknown`\> ; `items?`: Record<`string`, `unknown`\>[] ; `price?`: `number` ; `profile_id?`: `string` ; `provider_id?`: `string`  }[] | - |
| `status?` | [`OrderStatus`](../enums/OrderStatus-1.md) | - |

#### Defined in

[packages/medusa/src/types/orders.ts:156](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/types/orders.ts#L156)
