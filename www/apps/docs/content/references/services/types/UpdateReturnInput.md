# UpdateReturnInput

 **UpdateReturnInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `items?` | [`OrdersReturnItem`](OrdersReturnItem-1.md)[] |
| `metadata?` | Record<`string`, `unknown`\> |
| `no_notification?` | `boolean` |
| `shipping_method?` | { `option_id`: `string` ; `price?`: `number`  } |
| `shipping_method.option_id` | `string` |
| `shipping_method.price?` | `number` |

#### Defined in

[packages/medusa/src/types/return.ts:23](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/types/return.ts#L23)
