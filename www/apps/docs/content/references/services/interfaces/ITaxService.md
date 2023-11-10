# ITaxService

Interface to be implemented by tax provider plugins. The interface defines a
single method `getTaxLines` that returns numerical rates to apply to line
items and shipping methods.

## Methods

### getTaxLines

**getTaxLines**(`itemLines`, `shippingLines`, `context`): `Promise`<[`ProviderTaxLine`](../index.md#providertaxline)[]\>

Retrieves the numerical tax lines for a calculation context.

#### Parameters

| Name | Description |
| :------ | :------ |
| `itemLines` | [`ItemTaxCalculationLine`](../index.md#itemtaxcalculationline)[] | the line item calculation lines |
| `shippingLines` | [`ShippingTaxCalculationLine`](../index.md#shippingtaxcalculationline)[] |
| `context` | [`TaxCalculationContext`](../index.md#taxcalculationcontext) | other details relevant to the tax determination |

#### Returns

`Promise`<[`ProviderTaxLine`](../index.md#providertaxline)[]\>

-`Promise`: numerical tax rates that should apply to the provided calculation
  lines
	-`ProviderTaxLine[]`: 
		-`ProviderTaxLine`: A union type of the possible provider tax lines.

#### Defined in

[packages/medusa/src/interfaces/tax-service.ts:56](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/tax-service.ts#L56)
