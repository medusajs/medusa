# ShippingMethod

 **ShippingMethod**: `Object`

A Shipping Method represents a way in which an Order or Return can be shipped. Shipping Methods are created from a Shipping Option, but may contain additional details that can be necessary for the Fulfillment Provider to handle the shipment. If the shipping method is created for a return, it may be associated with a claim or a swap that the return is part of.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `data?` | Record<`string`, `unknown`\> | Additional data that the Fulfillment Provider needs to fulfill the shipment. This is used in combination with the Shipping Options data, and may contain information such as a drop point id. |
| `option_id` | `string` | - |
| `price?` | `number` | The amount to charge for the Shipping Method. The currency of the price is defined by the Region that the Order that the Shipping Method belongs to is a part of. |

#### Defined in

[packages/medusa/src/types/draft-orders.ts:22](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/types/draft-orders.ts#L22)
