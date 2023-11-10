# CreateReturnInput

 **CreateReturnInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `claim_order_id?` | `string` |
| `items?` | [`OrdersReturnItem`](OrdersReturnItem-1.md)[] |
| `location_id?` | `string` |
| `metadata?` | Record<`string`, `unknown`\> |
| `no_notification?` | `boolean` |
| `order_id` | `string` |
| `refund_amount?` | `number` |
| `shipping_method?` | { `option_id?`: `string` ; `price?`: `number`  } |
| `shipping_method.option_id?` | `string` |
| `shipping_method.price?` | `number` |
| `swap_id?` | `string` |

#### Defined in

[packages/medusa/src/types/return.ts:8](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/types/return.ts#L8)
