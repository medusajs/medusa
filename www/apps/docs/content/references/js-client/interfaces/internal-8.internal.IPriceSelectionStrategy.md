---
displayed_sidebar: jsClientSidebar
---

# Interface: IPriceSelectionStrategy

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).IPriceSelectionStrategy

## Hierarchy

- [`ITransactionBaseService`](internal-8.ITransactionBaseService.md)

  ↳ **`IPriceSelectionStrategy`**

## Implemented by

- [`AbstractPriceSelectionStrategy`](../classes/internal-8.internal.AbstractPriceSelectionStrategy.md)

## Methods

### calculateVariantPrice

▸ **calculateVariantPrice**(`data`, `context`): `Promise`<`Map`<`string`, [`PriceSelectionResult`](../modules/internal-8.internal.md#priceselectionresult)\>\>

Calculate the original and discount price for a given variant in a set of
circumstances described in the context.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | { `quantity?`: `number` ; `variantId`: `string`  }[] | - |
| `context` | [`PriceSelectionContext`](../modules/internal-8.internal.md#priceselectioncontext) | Details relevant to determine the correct pricing of the variant |

#### Returns

`Promise`<`Map`<`string`, [`PriceSelectionResult`](../modules/internal-8.internal.md#priceselectionresult)\>\>

pricing details in an object containing the calculated lowest price,
the default price an all valid prices for the given variant

#### Defined in

packages/medusa/dist/interfaces/price-selection-strategy.d.ts:15

___

### onVariantsPricesUpdate

▸ **onVariantsPricesUpdate**(`variantIds`): `Promise`<`void`\>

Notify price selection strategy that variants prices have been updated.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variantIds` | `string`[] | The ids of the updated variants |

#### Returns

`Promise`<`void`\>

#### Defined in

packages/medusa/dist/interfaces/price-selection-strategy.d.ts:23

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`IPriceSelectionStrategy`](internal-8.internal.IPriceSelectionStrategy.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`IPriceSelectionStrategy`](internal-8.internal.IPriceSelectionStrategy.md)

#### Inherited from

[ITransactionBaseService](internal-8.ITransactionBaseService.md).[withTransaction](internal-8.ITransactionBaseService.md#withtransaction)

#### Defined in

packages/types/dist/transaction-base/transaction-base.d.ts:3
