# ShippingTaxCalculationLine

 **ShippingTaxCalculationLine**: `Object`

A shipping method and the tax rates that have been configured to apply to the
shipping method.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `rates` | [`TaxServiceRate`](TaxServiceRate.md)[] | - |
| `shipping_method` | [`ShippingMethod`](../classes/ShippingMethod.md) | A Shipping Method represents a way in which an Order or Return can be shipped. Shipping Methods are created from a Shipping Option, but may contain additional details that can be necessary for the Fulfillment Provider to handle the shipment. If the shipping method is created for a return, it may be associated with a claim or a swap that the return is part of. |

#### Defined in

[packages/medusa/src/interfaces/tax-service.ts:15](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/tax-service.ts#L15)
