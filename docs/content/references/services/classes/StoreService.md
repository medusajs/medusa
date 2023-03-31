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

[packages/medusa/src/services/store.ts:31](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/store.ts#L31)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:10](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L10)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:9](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L9)

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_moduleDeclaration\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:11](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L11)

___

### currencyRepository\_

• `Protected` `Readonly` **currencyRepository\_**: typeof `CurrencyRepository`

#### Defined in

[packages/medusa/src/services/store.ts:28](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/store.ts#L28)

___

### eventBus\_

• `Protected` `Readonly` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[packages/medusa/src/services/store.ts:29](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/store.ts#L29)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[packages/medusa/src/services/store.ts:24](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/store.ts#L24)

___

### storeRepository\_

• `Protected` `Readonly` **storeRepository\_**: typeof `StoreRepository`

#### Defined in

[packages/medusa/src/services/store.ts:27](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/store.ts#L27)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[packages/medusa/src/services/store.ts:25](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/store.ts#L25)

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

[packages/medusa/src/services/store.ts:204](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/store.ts#L204)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:50](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L50)

___

### create

▸ **create**(): `Promise`<`Store`\>

Creates a store if it doesn't already exist.

#### Returns

`Promise`<`Store`\>

The store.

#### Defined in

[packages/medusa/src/services/store.ts:49](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/store.ts#L49)

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

[packages/medusa/src/services/store.ts:98](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/store.ts#L98)

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

[packages/medusa/src/services/store.ts:248](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/store.ts#L248)

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

[packages/medusa/src/services/store.ts:85](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/store.ts#L85)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:31](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L31)

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

[packages/medusa/src/services/store.ts:114](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/store.ts#L114)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L14)
