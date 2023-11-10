# CalculationContextData

 **CalculationContextData**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `claims?` | [`ClaimOrder`](../classes/ClaimOrder.md)[] | - |
| `customer` | [`Customer`](../classes/Customer.md) | A customer can make purchases in your store and manage their profile. |
| `discounts` | [`Discount`](../classes/Discount.md)[] | - |
| `items` | [`LineItem`](../classes/LineItem.md)[] | - |
| `region` | [`Region`](../classes/Region.md) | A region holds settings specific to a geographical location, including the currency, tax rates, and fulfillment and payment providers. A Region can consist of multiple countries to accomodate common shopping settings across countries. |
| `shipping_address` | [`Address`](../classes/Address.md) \| ``null`` | - |
| `shipping_methods?` | [`ShippingMethod`](../classes/ShippingMethod.md)[] | - |
| `swaps?` | [`Swap`](../classes/Swap.md)[] | - |

#### Defined in

[packages/medusa/src/types/totals.ts:12](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/types/totals.ts#L12)
