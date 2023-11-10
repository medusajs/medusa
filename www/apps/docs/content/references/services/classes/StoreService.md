# StoreService

Provides layer to manipulate store settings.

## Hierarchy

- [`TransactionBaseService`](TransactionBaseService.md)

  ↳ **`StoreService`**

## Constructors

### constructor

**new StoreService**(`«destructured»`)

#### Parameters

| Name |
| :------ |
| `«destructured»` | [`InjectedDependencies`](../index.md#injecteddependencies-39) |

#### Overrides

[TransactionBaseService](TransactionBaseService.md).[constructor](TransactionBaseService.md#constructor)

#### Defined in

[packages/medusa/src/services/store.ts:29](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/store.ts#L29)

## Properties

### \_\_configModule\_\_

 `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: Record<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__configModule__](TransactionBaseService.md#__configmodule__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

 `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__container__](TransactionBaseService.md#__container__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

 `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: Record<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__moduleDeclaration__](TransactionBaseService.md#__moduledeclaration__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### currencyRepository\_

 `Protected` `Readonly` **currencyRepository\_**: [`Repository`](Repository.md)<[`Currency`](Currency.md)\>

#### Defined in

[packages/medusa/src/services/store.ts:26](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/store.ts#L26)

___

### eventBus\_

 `Protected` `Readonly` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[packages/medusa/src/services/store.ts:27](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/store.ts#L27)

___

### manager\_

 `Protected` **manager\_**: [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[manager_](TransactionBaseService.md#manager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### storeRepository\_

 `Protected` `Readonly` **storeRepository\_**: [`Repository`](Repository.md)<[`Store`](Store.md)\>

#### Defined in

[packages/medusa/src/services/store.ts:25](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/store.ts#L25)

___

### transactionManager\_

 `Protected` **transactionManager\_**: `undefined` \| [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[transactionManager_](TransactionBaseService.md#transactionmanager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

## Accessors

### activeManager\_

`Protected` `get` **activeManager_**(): [`EntityManager`](EntityManager.md)

#### Returns

[`EntityManager`](EntityManager.md)

-`EntityManager`: 

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

## Methods

### addCurrency

**addCurrency**(`code`): `Promise`<[`Store`](Store.md)\>

Add a currency to the store

#### Parameters

| Name | Description |
| :------ | :------ |
| `code` | `string` | 3 character ISO currency code |

#### Returns

`Promise`<[`Store`](Store.md)\>

-`Promise`: result after update
	-`Store`: 

#### Defined in

[packages/medusa/src/services/store.ts:209](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/store.ts#L209)

___

### atomicPhase\_

`Protected` **atomicPhase_**<`TResult`, `TError`\>(`work`, `isolationOrErrorHandler?`, `maybeErrorHandlerOrDontFail?`): `Promise`<`TResult`\>

Wraps some work within a transactional block. If the service already has
a transaction manager attached this will be reused, otherwise a new
transaction manager is created.

| Name |
| :------ |
| `TResult` | `object` |
| `TError` | `object` |

#### Parameters

| Name | Description |
| :------ | :------ |
| `work` | (`transactionManager`: [`EntityManager`](EntityManager.md)) => `Promise`<`TResult`\> | the transactional work to be done |
| `isolationOrErrorHandler?` | [`IsolationLevel`](../index.md#isolationlevel) \| (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | the isolation level to be used for the work. |
| `maybeErrorHandlerOrDontFail?` | (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | Potential error handler |

#### Returns

`Promise`<`TResult`\>

-`Promise`: the result of the transactional work

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[atomicPhase_](TransactionBaseService.md#atomicphase_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

___

### create

**create**(): `Promise`<[`Store`](Store.md)\>

Creates a store if it doesn't already exist.

#### Returns

`Promise`<[`Store`](Store.md)\>

-`Promise`: The store.
	-`Store`: 

#### Defined in

[packages/medusa/src/services/store.ts:46](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/store.ts#L46)

___

### getDefaultCurrency\_

`Protected` **getDefaultCurrency_**(`code`): [`Partial`](../index.md#partial)<[`Currency`](Currency.md)\>

#### Parameters

| Name |
| :------ |
| `code` | `string` |

#### Returns

[`Partial`](../index.md#partial)<[`Currency`](Currency.md)\>

-`Partial`: 
	-`Currency`: 

#### Defined in

[packages/medusa/src/services/store.ts:101](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/store.ts#L101)

___

### removeCurrency

**removeCurrency**(`code`): `Promise`<`any`\>

Removes a currency from the store

#### Parameters

| Name | Description |
| :------ | :------ |
| `code` | `string` | 3 character ISO currency code |

#### Returns

`Promise`<`any`\>

-`Promise`: result after update
	-`any`: (optional) 

#### Defined in

[packages/medusa/src/services/store.ts:253](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/store.ts#L253)

___

### retrieve

**retrieve**(`config?`): `Promise`<[`Store`](Store.md)\>

Retrieve the store settings. There is always a maximum of one store.

#### Parameters

| Name | Description |
| :------ | :------ |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`Store`](Store.md)\> | The config object from which the query will be built |

#### Returns

`Promise`<[`Store`](Store.md)\>

-`Promise`: the store
	-`Store`: 

#### Defined in

[packages/medusa/src/services/store.ts:84](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/store.ts#L84)

___

### shouldRetryTransaction\_

`Protected` **shouldRetryTransaction_**(`err`): `boolean`

#### Parameters

| Name |
| :------ |
| `err` | Record<`string`, `unknown`\> \| { `code`: `string`  } |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[shouldRetryTransaction_](TransactionBaseService.md#shouldretrytransaction_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

___

### update

**update**(`data`): `Promise`<[`Store`](Store.md)\>

Updates a store

#### Parameters

| Name | Description |
| :------ | :------ |
| `data` | [`UpdateStoreInput`](../index.md#updatestoreinput) | an object with the update values. |

#### Returns

`Promise`<[`Store`](Store.md)\>

-`Promise`: resolves to the update result.
	-`Store`: 

#### Defined in

[packages/medusa/src/services/store.ts:117](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/store.ts#L117)

___

### withTransaction

**withTransaction**(`transactionManager?`): [`StoreService`](StoreService.md)

#### Parameters

| Name |
| :------ |
| `transactionManager?` | [`EntityManager`](EntityManager.md) |

#### Returns

[`StoreService`](StoreService.md)

-`StoreService`: 

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[withTransaction](TransactionBaseService.md#withtransaction)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
