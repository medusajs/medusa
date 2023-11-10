# ITaxService

Interface to be implemented by tax provider plugins. The interface defines a
single method `getTaxLines` that returns numerical rates to apply to line
items and shipping methods.

## Methods

### getTaxLines

**getTaxLines**(`itemLines`, `shippingLines`, `context`): `Promise`<[`ProviderTaxLine`](../types/ProviderTaxLine.md)[]\>

Retrieves the numerical tax lines for a calculation context.

#### Parameters

| Name | Description |
| :------ | :------ |
| `itemLines` | [`ItemTaxCalculationLine`](../types/ItemTaxCalculationLine.md)[] | the line item calculation lines |
| `shippingLines` | [`ShippingTaxCalculationLine`](../types/ShippingTaxCalculationLine.md)[] |
| `context` | [`TaxCalculationContext`](../types/TaxCalculationContext.md) | other details relevant to the tax determination |

#### Returns

`Promise`<[`ProviderTaxLine`](../types/ProviderTaxLine.md)[]\>

-`Promise`: numerical tax rates that should apply to the provided calculation
  lines
	-`ProviderTaxLine[]`: 
		-`ProviderTaxLine`: A union type of the possible provider tax lines.

#### Defined in

[packages/medusa/src/interfaces/tax-service.ts:56](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/tax-service.ts#L56)
