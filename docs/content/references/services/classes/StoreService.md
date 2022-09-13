# Class: StoreService

Provides layer to manipulate store settings.

## Hierarchy

- `TransactionBaseService`

  ↳ **`StoreService`**

## Constructors

### constructor

• **new StoreService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `InjectedDependencies` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[packages/medusa/src/services/store.ts:32](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/store.ts#L32)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:10](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/interfaces/transaction-base-service.ts#L10)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:9](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/interfaces/transaction-base-service.ts#L9)

___

### currencyRepository\_

• `Protected` `Readonly` **currencyRepository\_**: typeof `CurrencyRepository`

#### Defined in

[packages/medusa/src/services/store.ts:29](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/store.ts#L29)

___

### eventBus\_

• `Protected` `Readonly` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[packages/medusa/src/services/store.ts:30](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/store.ts#L30)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[packages/medusa/src/services/store.ts:25](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/store.ts#L25)

___

### storeRepository\_

• `Protected` `Readonly` **storeRepository\_**: typeof `StoreRepository`

#### Defined in

[packages/medusa/src/services/store.ts:28](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/store.ts#L28)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[packages/medusa/src/services/store.ts:26](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/store.ts#L26)

## Methods

### addCurrency

▸ **addCurrency**(`code`): `Promise`<`Store`\>

Add a currency to the store

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `code` | `string` | 3 character ISO currency code |

#### Returns

`Promise`<`Store`\>

result after update

#### Defined in

[packages/medusa/src/services/store.ts:210](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/store.ts#L210)

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

TransactionBaseService.atomicPhase\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:50](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/interfaces/transaction-base-service.ts#L50)

___

### create

▸ **create**(): `Promise`<`Store`\>

Creates a store if it doesn't already exist.

#### Returns

`Promise`<`Store`\>

The store.

#### Defined in

[packages/medusa/src/services/store.ts:55](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/store.ts#L55)

___

### getDefaultCurrency\_

▸ `Protected` **getDefaultCurrency_**(`code`): `Partial`<`Currency`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `code` | `string` |

#### Returns

`Partial`<`Currency`\>

#### Defined in

[packages/medusa/src/services/store.ts:104](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/store.ts#L104)

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

[packages/medusa/src/services/store.ts:254](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/store.ts#L254)

___

### retrieve

▸ **retrieve**(`config?`): `Promise`<`Store`\>

Retrieve the store settings. There is always a maximum of one store.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | `FindConfig`<`Store`\> | The config object from which the query will be built |

#### Returns

`Promise`<`Store`\>

the store

#### Defined in

[packages/medusa/src/services/store.ts:91](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/store.ts#L91)

___

### shouldRetryTransaction\_

▸ `Protected` **shouldRetryTransaction_**(`err`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `err` | `Record`<`string`, `unknown`\> \| { `code`: `string`  } |

#### Returns

`boolean`

#### Inherited from

TransactionBaseService.shouldRetryTransaction\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:31](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/interfaces/transaction-base-service.ts#L31)

___

### update

▸ **update**(`data`): `Promise`<`Store`\>

Updates a store

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `UpdateStoreInput` | an object with the update values. |

#### Returns

`Promise`<`Store`\>

resolves to the update result.

#### Defined in

[packages/medusa/src/services/store.ts:120](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/store.ts#L120)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`StoreService`](StoreService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`StoreService`](StoreService.md)

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/interfaces/transaction-base-service.ts#L13)
