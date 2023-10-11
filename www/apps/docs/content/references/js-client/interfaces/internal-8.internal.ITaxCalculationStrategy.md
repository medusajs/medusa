---
displayed_sidebar: jsClientSidebar
---

# Interface: ITaxCalculationStrategy

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).ITaxCalculationStrategy

## Methods

### calculate

▸ **calculate**(`items`, `taxLines`, `calculationContext`): `Promise`<`number`\>

Calculates the tax amount for a given set of line items under applicable
tax conditions and calculation contexts.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `items` | [`LineItem`](../classes/internal-3.LineItem.md)[] | the line items to calculate the tax total for |
| `taxLines` | ([`ShippingMethodTaxLine`](../classes/internal-3.ShippingMethodTaxLine.md) \| [`LineItemTaxLine`](../classes/internal-3.LineItemTaxLine.md))[] | the tax lines that applies to the calculation |
| `calculationContext` | [`TaxCalculationContext`](../modules/internal-8.internal.md#taxcalculationcontext) | other details relevant for the calculation |

#### Returns

`Promise`<`number`\>

the tax total

#### Defined in

packages/medusa/dist/interfaces/tax-calculation-strategy.d.ts:14
