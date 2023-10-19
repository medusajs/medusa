# Class: IdempotencyKeyService

## Hierarchy

- `TransactionBaseService`

  ↳ **`IdempotencyKeyService`**

## Constructors

### constructor

• **new IdempotencyKeyService**(`«destructured»`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `InjectedDependencies` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[medusa/src/services/idempotency-key.ts:25](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/idempotency-key.ts#L25)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_moduleDeclaration\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### idempotencyKeyRepository\_

• `Protected` `Readonly` **idempotencyKeyRepository\_**: `Repository`<`IdempotencyKey`\>

#### Defined in

[medusa/src/services/idempotency-key.ts:23](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/idempotency-key.ts#L23)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

TransactionBaseService.manager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

TransactionBaseService.transactionManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

## Accessors

### activeManager\_

• `Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

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

TransactionBaseService.atomicPhase\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

___

### create

▸ **create**(`payload`): `Promise`<`IdempotencyKey`\>

Creates an idempotency key for a request.
If no idempotency key is provided in request, we will create a unique
identifier.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | `CreateIdempotencyKeyInput` | payload of request to create idempotency key for |

#### Returns

`Promise`<`IdempotencyKey`\>

the created idempotency key

#### Defined in

[medusa/src/services/idempotency-key.ts:68](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/idempotency-key.ts#L68)

___

### initializeRequest

▸ **initializeRequest**(`headerKey`, `reqMethod`, `reqParams`, `reqPath`): `Promise`<`IdempotencyKey`\>

Execute the initial steps in a idempotent request.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `headerKey` | `string` | potential idempotency key from header |
| `reqMethod` | `string` | method of request |
| `reqParams` | `Record`<`string`, `unknown`\> | params of request |
| `reqPath` | `string` | path of request |

#### Returns

`Promise`<`IdempotencyKey`\>

the existing or created idempotency key

#### Defined in

[medusa/src/services/idempotency-key.ts:40](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/idempotency-key.ts#L40)

___

### lock

▸ **lock**(`idempotencyKey`): `Promise`<`IdempotencyKey`\>

Locks an idempotency.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `idempotencyKey` | `string` | key to lock |

#### Returns

`Promise`<`IdempotencyKey`\>

result of the update operation

#### Defined in

[medusa/src/services/idempotency-key.ts:138](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/idempotency-key.ts#L138)

___

### retrieve

▸ **retrieve**(`idempotencyKeyOrSelector`): `Promise`<`IdempotencyKey`\>

Retrieves an idempotency key

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `idempotencyKeyOrSelector` | `string` \| `Selector`<`IdempotencyKey`\> | key or selector to retrieve |

#### Returns

`Promise`<`IdempotencyKey`\>

idempotency key

#### Defined in

[medusa/src/services/idempotency-key.ts:86](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/idempotency-key.ts#L86)

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

[medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

___

### update

▸ **update**(`idempotencyKey`, `update`): `Promise`<`IdempotencyKey`\>

Locks an idempotency.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `idempotencyKey` | `string` | key to update |
| `update` | `DeepPartial`<`IdempotencyKey`\> | update object |

#### Returns

`Promise`<`IdempotencyKey`\>

result of the update operation

#### Defined in

[medusa/src/services/idempotency-key.ts:167](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/idempotency-key.ts#L167)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`IdempotencyKeyService`](IdempotencyKeyService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`IdempotencyKeyService`](IdempotencyKeyService.md)

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L20)

___

### workStage

▸ **workStage**(`idempotencyKey`, `callback`): `Promise`<`IdempotencyKey`\>

Performs an atomic work stage.
An atomic work stage contains some related functionality, that needs to be
transactionally executed in isolation. An idempotent request will
always consist of 2 or more of these phases. The required phases are
"started" and "finished".

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `idempotencyKey` | `string` | current idempotency key |
| `callback` | (`transactionManager`: `EntityManager`) => `Promise`<`IdempotencyCallbackResult`\> | functionality to execute within the phase |

#### Returns

`Promise`<`IdempotencyKey`\>

new updated idempotency key

#### Defined in

[medusa/src/services/idempotency-key.ts:196](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/idempotency-key.ts#L196)
