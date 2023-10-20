---
displayed_sidebar: jsClientSidebar
---

# Interface: ITaxService

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).ITaxService

Interface to be implemented by tax provider plugins. The interface defines a
single method `getTaxLines` that returns numerical rates to apply to line
items and shipping methods.

## Implemented by

- [`AbstractTaxService`](../classes/internal-8.internal.AbstractTaxService.md)

## Methods

### getTaxLines

▸ **getTaxLines**(`itemLines`, `shippingLines`, `context`): `Promise`<[`ProviderTaxLine`](../modules/internal-8.md#providertaxline)[]\>

Retrieves the numerical tax lines for a calculation context.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `itemLines` | [`ItemTaxCalculationLine`](../modules/internal-8.internal.md#itemtaxcalculationline)[] | the line item calculation lines |
| `shippingLines` | [`ShippingTaxCalculationLine`](../modules/internal-8.internal.md#shippingtaxcalculationline)[] | - |
| `context` | [`TaxCalculationContext`](../modules/internal-8.internal.md#taxcalculationcontext) | other details relevant to the tax determination |

#### Returns

`Promise`<[`ProviderTaxLine`](../modules/internal-8.md#providertaxline)[]\>

numerical tax rates that should apply to the provided calculation
  lines

#### Defined in

packages/medusa/dist/interfaces/tax-service.d.ts:51
