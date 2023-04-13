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

[medusa/src/services/store.ts:28](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/store.ts#L28)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_moduleDeclaration\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### currencyRepository\_

• `Protected` `Readonly` **currencyRepository\_**: `Repository`<`Currency`\>

#### Defined in

[medusa/src/services/store.ts:25](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/store.ts#L25)

___

### eventBus\_

• `Protected` `Readonly` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[medusa/src/services/store.ts:26](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/store.ts#L26)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

TransactionBaseService.manager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### storeRepository\_

• `Protected` `Readonly` **storeRepository\_**: `Repository`<`Store`\>

#### Defined in

[medusa/src/services/store.ts:24](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/store.ts#L24)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

TransactionBaseService.transactionManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

## Accessors

### activeManager\_

• `Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

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

[medusa/src/services/store.ts:208](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/store.ts#L208)

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

[medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

___

### create

▸ **create**(): `Promise`<`Store`\>

Creates a store if it doesn't already exist.

#### Returns

`Promise`<`Store`\>

The store.

#### Defined in

[medusa/src/services/store.ts:45](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/store.ts#L45)

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

[medusa/src/services/store.ts:100](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/store.ts#L100)

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

[medusa/src/services/store.ts:252](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/store.ts#L252)

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

[medusa/src/services/store.ts:83](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/store.ts#L83)

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

[medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

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

[medusa/src/services/store.ts:116](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/store.ts#L116)

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

[medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
