# Transformer

 **Transformer**: (`item?`: [`LineItem`](../classes/LineItem.md), `quantity?`: `number`, `additional?`: [`OrdersReturnItem`](../classes/OrdersReturnItem.md)) => `Promise`<[`DeepPartial`](DeepPartial.md)<[`LineItem`](../classes/LineItem.md)\>\> \| [`DeepPartial`](DeepPartial.md)<[`LineItem`](../classes/LineItem.md)\>

#### Type declaration

(`item?`, `quantity?`, `additional?`): `Promise`<[`DeepPartial`](DeepPartial.md)<[`LineItem`](../classes/LineItem.md)\>\> \| [`DeepPartial`](DeepPartial.md)<[`LineItem`](../classes/LineItem.md)\>

##### Parameters

| Name | Description |
| :------ | :------ |
| `item?` | [`LineItem`](../classes/LineItem.md) | Line Items are created when a product is added to a Cart. When Line Items are purchased they will get copied to the resulting order, swap, or claim, and can eventually be referenced in Fulfillments and Returns. Line items may also be used for order edits. |
| `quantity?` | `number` |
| `additional?` | [`OrdersReturnItem`](../classes/OrdersReturnItem.md) |

##### Returns

`Promise`<[`DeepPartial`](DeepPartial.md)<[`LineItem`](../classes/LineItem.md)\>\> \| [`DeepPartial`](DeepPartial.md)<[`LineItem`](../classes/LineItem.md)\>

-`Promise<DeepPartial<LineItem\>\> \| DeepPartial<LineItem\>`: (optional) 

#### Defined in

[packages/medusa/src/services/return.ts:48](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/return.ts#L48)
