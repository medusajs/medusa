# FulfillmentItemPartition

 **FulfillmentItemPartition**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `items` | [`LineItem`](../classes/LineItem.md)[] | - |
| `shipping_method` | [`ShippingMethod`](../classes/ShippingMethod.md) | A Shipping Method represents a way in which an Order or Return can be shipped. Shipping Methods are created from a Shipping Option, but may contain additional details that can be necessary for the Fulfillment Provider to handle the shipment. If the shipping method is created for a return, it may be associated with a claim or a swap that the return is part of. |

#### Defined in

[packages/medusa/src/types/fulfillment.ts:16](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/types/fulfillment.ts#L16)
