# TaxedPricing

 **TaxedPricing**: `Object`

Pricing fields related to taxes.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `calculated_price_incl_tax` | `number` \| ``null`` | The price after applying the tax amount on the calculated price. |
| `calculated_tax` | `number` \| ``null`` | The tax amount applied to the calculated price. |
| `original_price_incl_tax` | `number` \| ``null`` | The price after applying the tax amount on the original price. |
| `original_tax` | `number` \| ``null`` | The tax amount applied to the original price. |
| `tax_rates` | [`TaxServiceRate`](TaxServiceRate.md)[] \| ``null`` | The list of tax rates. |

#### Defined in

[packages/medusa/src/types/pricing.ts:43](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/types/pricing.ts#L43)
