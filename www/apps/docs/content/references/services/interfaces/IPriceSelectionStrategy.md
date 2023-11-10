# IPriceSelectionStrategy

## Hierarchy

- [`ITransactionBaseService`](ITransactionBaseService.md)

  ↳ **`IPriceSelectionStrategy`**

## Methods

### calculateVariantPrice

**calculateVariantPrice**(`data`, `context`): `Promise`<`Map`<`string`, [`PriceSelectionResult`](../types/PriceSelectionResult.md)\>\>

Calculate the original and discount price for a given variant in a set of
circumstances described in the context.

#### Parameters

| Name | Description |
| :------ | :------ |
| `data` | { `quantity?`: `number` ; `variantId`: `string`  }[] |
| `context` | [`PriceSelectionContext`](../types/PriceSelectionContext.md) | Details relevant to determine the correct pricing of the variant |

#### Returns

`Promise`<`Map`<`string`, [`PriceSelectionResult`](../types/PriceSelectionResult.md)\>\>

-`Promise`: pricing details in an object containing the calculated lowest price,
the default price an all valid prices for the given variant
	-`Map`: 
		-`string`: (optional) 
		-`PriceSelectionResult`: 

#### Defined in

[packages/medusa/src/interfaces/price-selection-strategy.ts:16](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/price-selection-strategy.ts#L16)

___

### onVariantsPricesUpdate

**onVariantsPricesUpdate**(`variantIds`): `Promise`<`void`\>

Notify price selection strategy that variants prices have been updated.

#### Parameters

| Name | Description |
| :------ | :------ |
| `variantIds` | `string`[] | The ids of the updated variants |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

[packages/medusa/src/interfaces/price-selection-strategy.ts:28](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/price-selection-strategy.ts#L28)

___

### withTransaction

**withTransaction**(`transactionManager?`): [`IPriceSelectionStrategy`](IPriceSelectionStrategy.md)

#### Parameters

| Name |
| :------ |
| `transactionManager?` | [`EntityManager`](../classes/EntityManager.md) |

#### Returns

[`IPriceSelectionStrategy`](IPriceSelectionStrategy.md)

-`IPriceSelectionStrategy`: 

#### Inherited from

[ITransactionBaseService](ITransactionBaseService.md).[withTransaction](ITransactionBaseService.md#withtransaction)

#### Defined in

packages/types/dist/transaction-base/transaction-base.d.ts:3
