---
displayed_sidebar: jsClientSidebar
---

# Class: StoreService

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).StoreService

Provides layer to manipulate store settings.

## Hierarchy

- [`TransactionBaseService`](internal-8.internal.TransactionBaseService.md)

  ↳ **`StoreService`**

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

### currencyRepository\_

• `Protected` `Readonly` **currencyRepository\_**: `Repository`<[`Currency`](internal-3.Currency.md)\>

#### Defined in

packages/medusa/dist/services/store.d.ts:20

___

### eventBus\_

• `Protected` `Readonly` **eventBus\_**: [`EventBusService`](internal-8.internal.EventBusService.md)

#### Defined in

packages/medusa/dist/services/store.d.ts:21

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[manager_](internal-8.internal.TransactionBaseService.md#manager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:7

___

### storeRepository\_

• `Protected` `Readonly` **storeRepository\_**: `Repository`<[`Store`](internal-8.internal.Store.md)\>

#### Defined in

packages/medusa/dist/services/store.d.ts:19

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

### addCurrency

▸ **addCurrency**(`code`): `Promise`<[`Store`](internal-8.internal.Store.md)\>

Add a currency to the store

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `code` | `string` | 3 character ISO currency code |

#### Returns

`Promise`<[`Store`](internal-8.internal.Store.md)\>

result after update

#### Defined in

packages/medusa/dist/services/store.d.ts:46

___

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

### create

▸ **create**(): `Promise`<[`Store`](internal-8.internal.Store.md)\>

Creates a store if it doesn't already exist.

#### Returns

`Promise`<[`Store`](internal-8.internal.Store.md)\>

The store.

#### Defined in

packages/medusa/dist/services/store.d.ts:27

___

### getDefaultCurrency\_

▸ `Protected` **getDefaultCurrency_**(`code`): [`Partial`](../modules/internal-8.md#partial)<[`Currency`](internal-3.Currency.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `code` | `string` |

#### Returns

[`Partial`](../modules/internal-8.md#partial)<[`Currency`](internal-3.Currency.md)\>

#### Defined in

packages/medusa/dist/services/store.d.ts:34

___

### removeCurrency

▸ **removeCurrency**(`code`): `Promise`<`any`\>

Removes a currency from the store

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `code` | `string` | 3 character ISO currency code |

#### Returns

`Promise`<`any`\>

result after update

#### Defined in

packages/medusa/dist/services/store.d.ts:52

___

### retrieve

▸ **retrieve**(`config?`): `Promise`<[`Store`](internal-8.internal.Store.md)\>

Retrieve the store settings. There is always a maximum of one store.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`Store`](internal-8.internal.Store.md)\> | The config object from which the query will be built |

#### Returns

`Promise`<[`Store`](internal-8.internal.Store.md)\>

the store

#### Defined in

packages/medusa/dist/services/store.d.ts:33

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

### update

▸ **update**(`data`): `Promise`<[`Store`](internal-8.internal.Store.md)\>

Updates a store

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | [`UpdateStoreInput`](../modules/internal-8.md#updatestoreinput) | an object with the update values. |

#### Returns

`Promise`<[`Store`](internal-8.internal.Store.md)\>

resolves to the update result.

#### Defined in

packages/medusa/dist/services/store.d.ts:40

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`StoreService`](internal-8.internal.StoreService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`StoreService`](internal-8.internal.StoreService.md)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[withTransaction](internal-8.internal.TransactionBaseService.md#withtransaction)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:11
