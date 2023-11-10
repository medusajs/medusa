# PaymentContext

 **PaymentContext**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `amount` | `number` | - |
| `cart` | { `billing_address?`: [`Address`](../classes/Address.md) \| ``null`` ; `context`: Record<`string`, `unknown`\> ; `email`: `string` ; `id`: `string` ; `shipping_address`: [`Address`](../classes/Address.md) \| ``null`` ; `shipping_methods`: [`ShippingMethod`](../classes/ShippingMethod.md)[]  } | - |
| `cart.billing_address?` | [`Address`](../classes/Address.md) \| ``null`` | - |
| `cart.context` | Record<`string`, `unknown`\> | - |
| `cart.email` | `string` | - |
| `cart.id` | `string` | - |
| `cart.shipping_address` | [`Address`](../classes/Address.md) \| ``null`` | - |
| `cart.shipping_methods` | [`ShippingMethod`](../classes/ShippingMethod.md)[] | - |
| `currency_code` | `string` | - |
| `customer?` | [`Customer`](../classes/Customer.md) | A customer can make purchases in your store and manage their profile. |
| `paymentSessionData` | Record<`string`, `unknown`\> | - |
| `resource_id` | `string` | - |

#### Defined in

[packages/medusa/src/interfaces/payment-service.ts:17](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/payment-service.ts#L17)
