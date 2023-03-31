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
| `__namedParameters` | `InjectedDependencies` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[packages/medusa/src/services/idempotency-key.ts:25](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/idempotency-key.ts#L25)

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

### idempotencyKeyRepository\_

• `Protected` `Readonly` **idempotencyKeyRepository\_**: typeof `IdempotencyKeyRepository`

#### Defined in

[packages/medusa/src/services/idempotency-key.ts:23](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/idempotency-key.ts#L23)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[packages/medusa/src/services/idempotency-key.ts:20](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/idempotency-key.ts#L20)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[packages/medusa/src/services/idempotency-key.ts:21](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/idempotency-key.ts#L21)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:50](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L50)

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

[packages/medusa/src/services/idempotency-key.ts:67](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/idempotency-key.ts#L67)

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

[packages/medusa/src/services/idempotency-key.ts:41](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/idempotency-key.ts#L41)

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

[packages/medusa/src/services/idempotency-key.ts:116](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/idempotency-key.ts#L116)

___

### retrieve

▸ **retrieve**(`idempotencyKey`): `Promise`<`IdempotencyKey`\>

Retrieves an idempotency key

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `idempotencyKey` | `string` | key to retrieve |

#### Returns

`Promise`<`IdempotencyKey`\>

idempotency key

#### Defined in

[packages/medusa/src/services/idempotency-key.ts:85](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/idempotency-key.ts#L85)

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

▸ **update**(`idempotencyKey`, `update`): `Promise`<`IdempotencyKey`\>

Locks an idempotency.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `idempotencyKey` | `string` | key to update |
| `update` | `Object` | update object |
| `update.created_at?` | { toString?: {} \| undefined; toDateString?: {} \| undefined; toTimeString?: {} \| undefined; toLocaleString?: {} \| undefined; toLocaleDateString?: {} \| undefined; toLocaleTimeString?: {} \| undefined; ... 37 more ...; [Symbol.toPrimitive]?: {} \| undefined; } | - |
| `update.id?` | `string` | - |
| `update.idempotency_key?` | `string` | - |
| `update.locked_at?` | { toString?: {} \| undefined; toDateString?: {} \| undefined; toTimeString?: {} \| undefined; toLocaleString?: {} \| undefined; toLocaleDateString?: {} \| undefined; toLocaleTimeString?: {} \| undefined; ... 37 more ...; [Symbol.toPrimitive]?: {} \| undefined; } | - |
| `update.recovery_point?` | `string` | - |
| `update.request_method?` | `string` | - |
| `update.request_params?` | { [x: string]: unknown; } | - |
| `update.request_path?` | `string` | - |
| `update.response_body?` | { [x: string]: unknown; } | - |
| `update.response_code?` | `number` | - |

#### Returns

`Promise`<`IdempotencyKey`\>

result of the update operation

#### Defined in

[packages/medusa/src/services/idempotency-key.ts:145](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/idempotency-key.ts#L145)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

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

[packages/medusa/src/services/idempotency-key.ts:174](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/idempotency-key.ts#L174)
