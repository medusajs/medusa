# CartUpdateProps

 **CartUpdateProps**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `billing_address?` | [`AddressPayload`](../classes/AddressPayload.md) \| `string` |
| `billing_address_id?` | `string` |
| `completed_at?` | `Date` |
| `context?` | `object` |
| `country_code?` | `string` |
| `customer_id?` | `string` |
| `discounts?` | [`Discount`](../classes/Discount-1.md)[] |
| `email?` | `string` |
| `gift_cards?` | [`GiftCard`](../classes/GiftCard-1.md)[] |
| `metadata?` | Record<`string`, `unknown`\> |
| `payment_authorized_at?` | `Date` \| ``null`` |
| `region_id?` | `string` |
| `sales_channel_id?` | `string` |
| `shipping_address?` | [`AddressPayload`](../classes/AddressPayload.md) \| `string` |
| `shipping_address_id?` | `string` |

#### Defined in

[packages/medusa/src/types/cart.ts:71](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/types/cart.ts#L71)
