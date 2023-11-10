# TaxCalculationContext

 **TaxCalculationContext**: `Object`

Information relevant to a tax calculation, such as the shipping address where
the items are going.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `allocation_map` | [`LineAllocationsMap`](LineAllocationsMap.md) | - |
| `customer` | [`Customer`](../classes/Customer.md) | A customer can make purchases in your store and manage their profile. |
| `is_return` | `boolean` | - |
| `region` | [`Region`](../classes/Region.md) | A region holds settings specific to a geographical location, including the currency, tax rates, and fulfillment and payment providers. A Region can consist of multiple countries to accomodate common shopping settings across countries. |
| `shipping_address` | [`Address`](../classes/Address.md) \| ``null`` | - |
| `shipping_methods` | [`ShippingMethod`](../classes/ShippingMethod.md)[] | - |

#### Defined in

[packages/medusa/src/interfaces/tax-service.ts:33](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/tax-service.ts#L33)
