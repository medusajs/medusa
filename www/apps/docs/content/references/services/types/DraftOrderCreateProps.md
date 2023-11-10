# DraftOrderCreateProps

 **DraftOrderCreateProps**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `billing_address?` | [`Partial`](Partial.md)<[`AddressPayload`](../classes/AddressPayload.md)\> |
| `billing_address_id?` | `string` |
| `customer_id?` | `string` |
| `discounts?` | [`Discount`](Discount-2.md)[] |
| `email` | `string` |
| `idempotency_key?` | `string` |
| `items?` | [`Item`](Item.md)[] |
| `metadata?` | Record<`string`, `unknown`\> |
| `no_notification_order?` | `boolean` |
| `region_id` | `string` |
| `shipping_address?` | [`Partial`](Partial.md)<[`AddressPayload`](../classes/AddressPayload.md)\> |
| `shipping_address_id?` | `string` |
| `shipping_methods` | [`ShippingMethod`](ShippingMethod-1.md)[] |
| `status?` | `string` |

#### Defined in

[packages/medusa/src/types/draft-orders.ts:5](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/types/draft-orders.ts#L5)
