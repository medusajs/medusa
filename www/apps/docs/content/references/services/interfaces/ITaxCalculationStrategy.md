# ITaxCalculationStrategy

## Methods

### calculate

**calculate**(`items`, `taxLines`, `calculationContext`): `Promise`<`number`\>

Calculates the tax amount for a given set of line items under applicable
tax conditions and calculation contexts.

#### Parameters

| Name | Description |
| :------ | :------ |
| `items` | [`LineItem`](../classes/LineItem.md)[] | the line items to calculate the tax total for |
| `taxLines` | ([`LineItemTaxLine`](../classes/LineItemTaxLine.md) \| [`ShippingMethodTaxLine`](../classes/ShippingMethodTaxLine.md))[] | the tax lines that applies to the calculation |
| `calculationContext` | [`TaxCalculationContext`](../types/TaxCalculationContext.md) | other details relevant for the calculation |

#### Returns

`Promise`<`number`\>

-`Promise`: the tax total
	-`number`: (optional) 

#### Defined in

[packages/medusa/src/interfaces/tax-calculation-strategy.ts:15](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/tax-calculation-strategy.ts#L15)
