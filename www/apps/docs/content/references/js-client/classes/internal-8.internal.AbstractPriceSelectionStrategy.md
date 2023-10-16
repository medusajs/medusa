---
displayed_sidebar: jsClientSidebar
---

# Class: AbstractPriceSelectionStrategy

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AbstractPriceSelectionStrategy

## Hierarchy

- [`TransactionBaseService`](internal-8.internal.TransactionBaseService.md)

  ↳ **`AbstractPriceSelectionStrategy`**

## Implements

- [`IPriceSelectionStrategy`](../interfaces/internal-8.internal.IPriceSelectionStrategy.md)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[__configModule__](internal-8.internal.TransactionBaseService.md#__configmodule__)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:5

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[__container__](internal-8.internal.TransactionBaseService.md#__container__)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:4

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[__moduleDeclaration__](internal-8.internal.TransactionBaseService.md#__moduledeclaration__)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:6

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[manager_](internal-8.internal.TransactionBaseService.md#manager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:7

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[transactionManager_](internal-8.internal.TransactionBaseService.md#transactionmanager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:8

## Accessors

### activeManager\_

• `Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:9

## Methods

### atomicPhase\_

▸ `Protected` **atomicPhase_**<`TResult`, `TError`\>(`work`, `isolationOrErrorHandler?`, `maybeErrorHandlerOrDontFail?`): `Promise`<`TResult`\>

Wraps some work within a transactional block. If the service already has
a transaction manager attached this will be reused, otherwise a new
transaction manager is created.

#### Type parameters

| Name |
| :------ |
| `TResult` |
| `TError` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `work` | (`transactionManager`: `EntityManager`) => `Promise`<`TResult`\> | the transactional work to be done |
| `isolationOrErrorHandler?` | `IsolationLevel` \| (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | the isolation level to be used for the work. |
| `maybeErrorHandlerOrDontFail?` | (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | Potential error handler |

#### Returns

`Promise`<`TResult`\>

the result of the transactional work

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[atomicPhase_](internal-8.internal.TransactionBaseService.md#atomicphase_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:24

___

### calculateVariantPrice

▸ `Abstract` **calculateVariantPrice**(`data`, `context`): `Promise`<`Map`<`string`, [`PriceSelectionResult`](../modules/internal-8.internal.md#priceselectionresult)\>\>

Calculate the original and discount price for a given variant in a set of
circumstances described in the context.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | { `quantity?`: `number` ; `taxRates`: [`TaxServiceRate`](../modules/internal-8.md#taxservicerate)[] ; `variantId`: `string`  }[] | - |
| `context` | [`PriceSelectionContext`](../modules/internal-8.internal.md#priceselectioncontext) | Details relevant to determine the correct pricing of the variant |

#### Returns

`Promise`<`Map`<`string`, [`PriceSelectionResult`](../modules/internal-8.internal.md#priceselectionresult)\>\>

pricing details in an object containing the calculated lowest price,
the default price an all valid prices for the given variant

#### Implementation of

[IPriceSelectionStrategy](../interfaces/internal-8.internal.IPriceSelectionStrategy.md).[calculateVariantPrice](../interfaces/internal-8.internal.IPriceSelectionStrategy.md#calculatevariantprice)

#### Defined in

packages/medusa/dist/interfaces/price-selection-strategy.d.ts:26

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

#### Implementation of

[IPriceSelectionStrategy](../interfaces/internal-8.internal.IPriceSelectionStrategy.md).[onVariantsPricesUpdate](../interfaces/internal-8.internal.IPriceSelectionStrategy.md#onvariantspricesupdate)

#### Defined in

packages/medusa/dist/interfaces/price-selection-strategy.d.ts:31

___

### shouldRetryTransaction\_

▸ `Protected` **shouldRetryTransaction_**(`err`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `err` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> \| { `code`: `string`  } |

#### Returns

`boolean`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[shouldRetryTransaction_](internal-8.internal.TransactionBaseService.md#shouldretrytransaction_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:12

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`AbstractPriceSelectionStrategy`](internal-8.internal.AbstractPriceSelectionStrategy.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`AbstractPriceSelectionStrategy`](internal-8.internal.AbstractPriceSelectionStrategy.md)

#### Implementation of

[IPriceSelectionStrategy](../interfaces/internal-8.internal.IPriceSelectionStrategy.md).[withTransaction](../interfaces/internal-8.internal.IPriceSelectionStrategy.md#withtransaction)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[withTransaction](internal-8.internal.TransactionBaseService.md#withtransaction)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:11
