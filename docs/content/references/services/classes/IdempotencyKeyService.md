# Class: IdempotencyKeyService

## Hierarchy

- `TransactionBaseService`

  ↳ **`IdempotencyKeyService`**

## Constructors

### constructor

• **new IdempotencyKeyService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[packages/medusa/src/services/idempotency-key.js:8](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/idempotency-key.js#L8)

## Properties

### configModule

• `Protected` `Optional` `Readonly` **configModule**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.configModule

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### container

• `Protected` `Readonly` **container**: `any`

#### Inherited from

TransactionBaseService.container

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:12](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/interfaces/transaction-base-service.ts#L12)

___

### transactionManager\_

• `Protected` `Abstract` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

TransactionBaseService.transactionManager\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:9](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/interfaces/transaction-base-service.ts#L9)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:53](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/interfaces/transaction-base-service.ts#L53)

___

### create

▸ **create**(`payload`): `Promise`<`IdempotencyKeyModel`\>

Creates an idempotency key for a request.
If no idempotency key is provided in request, we will create a unique
identifier.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | `any` | payload of request to create idempotency key for |

#### Returns

`Promise`<`IdempotencyKeyModel`\>

the created idempotency key

#### Defined in

[packages/medusa/src/services/idempotency-key.js:52](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/idempotency-key.js#L52)

___

### initializeRequest

▸ **initializeRequest**(`headerKey`, `reqMethod`, `reqParams`, `reqPath`): `Promise`<`IdempotencyKeyModel`\>

Execute the initial steps in a idempotent request.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `headerKey` | `string` | potential idempotency key from header |
| `reqMethod` | `string` | method of request |
| `reqParams` | `string` | params of request |
| `reqPath` | `string` | path of request |

#### Returns

`Promise`<`IdempotencyKeyModel`\>

the existing or created idempotency key

#### Defined in

[packages/medusa/src/services/idempotency-key.js:26](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/idempotency-key.js#L26)

___

### lock

▸ **lock**(`idempotencyKey`): `Promise`<`any`\>

Locks an idempotency.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `idempotencyKey` | `string` | key to lock |

#### Returns

`Promise`<`any`\>

result of the update operation

#### Defined in

[packages/medusa/src/services/idempotency-key.js:90](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/idempotency-key.js#L90)

___

### retrieve

▸ **retrieve**(`idempotencyKey`): `Promise`<`IdempotencyKeyModel`\>

Retrieves an idempotency key

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `idempotencyKey` | `string` | key to retrieve |

#### Returns

`Promise`<`IdempotencyKeyModel`\>

idempotency key

#### Defined in

[packages/medusa/src/services/idempotency-key.js:73](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/idempotency-key.js#L73)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:34](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/interfaces/transaction-base-service.ts#L34)

___

### update

▸ **update**(`idempotencyKey`, `update`): `Promise`<`any`\>

Locks an idempotency.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `idempotencyKey` | `string` | key to update |
| `update` | `any` | update object |

#### Returns

`Promise`<`any`\>

result of the update operation

#### Defined in

[packages/medusa/src/services/idempotency-key.js:117](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/idempotency-key.js#L117)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

`any`

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:16](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/interfaces/transaction-base-service.ts#L16)

___

### workStage

▸ **workStage**(`idempotencyKey`, `func`): `IdempotencyKeyModel`

Performs an atomic work stage.
An atomic work stage contains some related functionality, that needs to be
transactionally executed in isolation. An idempotent request will
always consist of 2 or more of these phases. The required phases are
"started" and "finished".

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `idempotencyKey` | `string` | current idempotency key |
| `func` | `Function` | functionality to execute within the phase |

#### Returns

`IdempotencyKeyModel`

new updated idempotency key

#### Defined in

[packages/medusa/src/services/idempotency-key.js:144](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/idempotency-key.js#L144)
