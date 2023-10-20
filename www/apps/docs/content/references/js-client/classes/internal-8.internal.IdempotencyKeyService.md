---
displayed_sidebar: jsClientSidebar
---

# Class: IdempotencyKeyService

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).IdempotencyKeyService

## Hierarchy

- [`TransactionBaseService`](internal-8.internal.TransactionBaseService.md)

  ↳ **`IdempotencyKeyService`**

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

### idempotencyKeyRepository\_

• `Protected` `Readonly` **idempotencyKeyRepository\_**: `Repository`<[`IdempotencyKey`](internal-8.internal.IdempotencyKey.md)\>

#### Defined in

packages/medusa/dist/services/idempotency-key.d.ts:12

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

### create

▸ **create**(`payload`): `Promise`<[`IdempotencyKey`](internal-8.internal.IdempotencyKey.md)\>

Creates an idempotency key for a request.
If no idempotency key is provided in request, we will create a unique
identifier.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | [`CreateIdempotencyKeyInput`](../modules/internal-8.md#createidempotencykeyinput) | payload of request to create idempotency key for |

#### Returns

`Promise`<[`IdempotencyKey`](internal-8.internal.IdempotencyKey.md)\>

the created idempotency key

#### Defined in

packages/medusa/dist/services/idempotency-key.d.ts:30

___

### initializeRequest

▸ **initializeRequest**(`headerKey`, `reqMethod`, `reqParams`, `reqPath`): `Promise`<[`IdempotencyKey`](internal-8.internal.IdempotencyKey.md)\>

Execute the initial steps in a idempotent request.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `headerKey` | `string` | potential idempotency key from header |
| `reqMethod` | `string` | method of request |
| `reqParams` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> | params of request |
| `reqPath` | `string` | path of request |

#### Returns

`Promise`<[`IdempotencyKey`](internal-8.internal.IdempotencyKey.md)\>

the existing or created idempotency key

#### Defined in

packages/medusa/dist/services/idempotency-key.d.ts:22

___

### lock

▸ **lock**(`idempotencyKey`): `Promise`<[`IdempotencyKey`](internal-8.internal.IdempotencyKey.md)\>

Locks an idempotency.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `idempotencyKey` | `string` | key to lock |

#### Returns

`Promise`<[`IdempotencyKey`](internal-8.internal.IdempotencyKey.md)\>

result of the update operation

#### Defined in

packages/medusa/dist/services/idempotency-key.d.ts:42

___

### retrieve

▸ **retrieve**(`idempotencyKeyOrSelector`): `Promise`<[`IdempotencyKey`](internal-8.internal.IdempotencyKey.md)\>

Retrieves an idempotency key

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `idempotencyKeyOrSelector` | `string` \| [`Selector`](../modules/internal-8.internal.md#selector)<[`IdempotencyKey`](internal-8.internal.IdempotencyKey.md)\> | key or selector to retrieve |

#### Returns

`Promise`<[`IdempotencyKey`](internal-8.internal.IdempotencyKey.md)\>

idempotency key

#### Defined in

packages/medusa/dist/services/idempotency-key.d.ts:36

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

▸ **update**(`idempotencyKey`, `update`): `Promise`<[`IdempotencyKey`](internal-8.internal.IdempotencyKey.md)\>

Locks an idempotency.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `idempotencyKey` | `string` | key to update |
| `update` | `DeepPartial`<[`IdempotencyKey`](internal-8.internal.IdempotencyKey.md)\> | update object |

#### Returns

`Promise`<[`IdempotencyKey`](internal-8.internal.IdempotencyKey.md)\>

result of the update operation

#### Defined in

packages/medusa/dist/services/idempotency-key.d.ts:49

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`IdempotencyKeyService`](internal-8.internal.IdempotencyKeyService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`IdempotencyKeyService`](internal-8.internal.IdempotencyKeyService.md)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[withTransaction](internal-8.internal.TransactionBaseService.md#withtransaction)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:11

___

### workStage

▸ **workStage**(`idempotencyKey`, `callback`): `Promise`<[`IdempotencyKey`](internal-8.internal.IdempotencyKey.md)\>

Performs an atomic work stage.
An atomic work stage contains some related functionality, that needs to be
transactionally executed in isolation. An idempotent request will
always consist of 2 or more of these phases. The required phases are
"started" and "finished".

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `idempotencyKey` | `string` | current idempotency key |
| `callback` | (`transactionManager`: `EntityManager`) => `Promise`<[`IdempotencyCallbackResult`](../modules/internal-8.md#idempotencycallbackresult)\> | functionality to execute within the phase |

#### Returns

`Promise`<[`IdempotencyKey`](internal-8.internal.IdempotencyKey.md)\>

new updated idempotency key

#### Defined in

packages/medusa/dist/services/idempotency-key.d.ts:60
