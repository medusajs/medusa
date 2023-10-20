---
displayed_sidebar: jsClientSidebar
---

# Class: AbstractTaxService

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AbstractTaxService

Interface to be implemented by tax provider plugins. The interface defines a
single method `getTaxLines` that returns numerical rates to apply to line
items and shipping methods.

## Hierarchy

- `unknown`

  ↳ **`AbstractTaxService`**

## Implements

- [`ITaxService`](../interfaces/internal-8.internal.ITaxService.md)

## Properties

### identifier

▪ `Static` `Protected` **identifier**: `string`

#### Defined in

packages/medusa/dist/interfaces/tax-service.d.ts:54

## Methods

### getIdentifier

▸ **getIdentifier**(): `string`

#### Returns

`string`

#### Defined in

packages/medusa/dist/interfaces/tax-service.d.ts:55

___

### getTaxLines

▸ `Abstract` **getTaxLines**(`itemLines`, `shippingLines`, `context`): `Promise`<[`ProviderTaxLine`](../modules/internal-8.md#providertaxline)[]\>

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

#### Implementation of

[ITaxService](../interfaces/internal-8.internal.ITaxService.md).[getTaxLines](../interfaces/internal-8.internal.ITaxService.md#gettaxlines)

#### Defined in

packages/medusa/dist/interfaces/tax-service.d.ts:56
