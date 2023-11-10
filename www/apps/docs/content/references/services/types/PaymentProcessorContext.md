# PaymentProcessorContext

 **PaymentProcessorContext**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `amount` | `number` | - |
| `billing_address?` | [`Address`](../classes/Address.md) \| ``null`` | - |
| `context` | Record<`string`, `unknown`\> | - |
| `currency_code` | `string` | - |
| `customer?` | [`Customer`](../classes/Customer.md) | A customer can make purchases in your store and manage their profile. |
| `email` | `string` | - |
| `paymentSessionData` | Record<`string`, `unknown`\> | - |
| `resource_id` | `string` | - |

#### Defined in

[packages/medusa/src/interfaces/payment-processor.ts:4](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/payment-processor.ts#L4)
