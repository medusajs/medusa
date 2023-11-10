# IdempotencyKeyService

## Hierarchy

- [`TransactionBaseService`](TransactionBaseService.md)

  ↳ **`IdempotencyKeyService`**

## Constructors

### constructor

**new IdempotencyKeyService**(`«destructured»`)

#### Parameters

| Name |
| :------ |
| `«destructured»` | [`InjectedDependencies`](../types/InjectedDependencies-13.md) |

#### Overrides

[TransactionBaseService](TransactionBaseService.md).[constructor](TransactionBaseService.md#constructor)

#### Defined in

[packages/medusa/src/services/idempotency-key.ts:25](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/idempotency-key.ts#L25)

## Properties

### \_\_configModule\_\_

 `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: Record<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__configModule__](TransactionBaseService.md#__configmodule__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

 `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__container__](TransactionBaseService.md#__container__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

 `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: Record<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__moduleDeclaration__](TransactionBaseService.md#__moduledeclaration__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### idempotencyKeyRepository\_

 `Protected` `Readonly` **idempotencyKeyRepository\_**: [`Repository`](Repository.md)<[`IdempotencyKey`](IdempotencyKey.md)\>

#### Defined in

[packages/medusa/src/services/idempotency-key.ts:23](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/idempotency-key.ts#L23)

___

### manager\_

 `Protected` **manager\_**: [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[manager_](TransactionBaseService.md#manager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### transactionManager\_

 `Protected` **transactionManager\_**: `undefined` \| [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[transactionManager_](TransactionBaseService.md#transactionmanager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

## Accessors

### activeManager\_

`Protected` `get` **activeManager_**(): [`EntityManager`](EntityManager.md)

#### Returns

[`EntityManager`](EntityManager.md)

-`EntityManager`: 

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

## Methods

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
| `isolationOrErrorHandler?` | [`IsolationLevel`](../types/IsolationLevel.md) \| (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | the isolation level to be used for the work. |
| `maybeErrorHandlerOrDontFail?` | (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | Potential error handler |

#### Returns

`Promise`<`TResult`\>

-`Promise`: the result of the transactional work

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[atomicPhase_](TransactionBaseService.md#atomicphase_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

___

### create

**create**(`payload`): `Promise`<[`IdempotencyKey`](IdempotencyKey.md)\>

Creates an idempotency key for a request.
If no idempotency key is provided in request, we will create a unique
identifier.

#### Parameters

| Name | Description |
| :------ | :------ |
| `payload` | [`CreateIdempotencyKeyInput`](../types/CreateIdempotencyKeyInput.md) | payload of request to create idempotency key for |

#### Returns

`Promise`<[`IdempotencyKey`](IdempotencyKey.md)\>

-`Promise`: the created idempotency key
	-`IdempotencyKey`: 

#### Defined in

[packages/medusa/src/services/idempotency-key.ts:68](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/idempotency-key.ts#L68)

___

### initializeRequest

**initializeRequest**(`headerKey`, `reqMethod`, `reqParams`, `reqPath`): `Promise`<[`IdempotencyKey`](IdempotencyKey.md)\>

Execute the initial steps in a idempotent request.

#### Parameters

| Name | Description |
| :------ | :------ |
| `headerKey` | `string` | potential idempotency key from header |
| `reqMethod` | `string` | method of request |
| `reqParams` | Record<`string`, `unknown`\> | params of request |
| `reqPath` | `string` | path of request |

#### Returns

`Promise`<[`IdempotencyKey`](IdempotencyKey.md)\>

-`Promise`: the existing or created idempotency key
	-`IdempotencyKey`: 

#### Defined in

[packages/medusa/src/services/idempotency-key.ts:40](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/idempotency-key.ts#L40)

___

### lock

**lock**(`idempotencyKey`): `Promise`<[`IdempotencyKey`](IdempotencyKey.md)\>

Locks an idempotency.

#### Parameters

| Name | Description |
| :------ | :------ |
| `idempotencyKey` | `string` | key to lock |

#### Returns

`Promise`<[`IdempotencyKey`](IdempotencyKey.md)\>

-`Promise`: result of the update operation
	-`IdempotencyKey`: 

#### Defined in

[packages/medusa/src/services/idempotency-key.ts:138](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/idempotency-key.ts#L138)

___

### retrieve

**retrieve**(`idempotencyKeyOrSelector`): `Promise`<[`IdempotencyKey`](IdempotencyKey.md)\>

Retrieves an idempotency key

#### Parameters

| Name | Description |
| :------ | :------ |
| `idempotencyKeyOrSelector` | `string` \| [`Selector`](../types/Selector.md)<[`IdempotencyKey`](IdempotencyKey.md)\> | key or selector to retrieve |

#### Returns

`Promise`<[`IdempotencyKey`](IdempotencyKey.md)\>

-`Promise`: idempotency key
	-`IdempotencyKey`: 

#### Defined in

[packages/medusa/src/services/idempotency-key.ts:86](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/idempotency-key.ts#L86)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

___

### update

**update**(`idempotencyKey`, `update`): `Promise`<[`IdempotencyKey`](IdempotencyKey.md)\>

Locks an idempotency.

#### Parameters

| Name | Description |
| :------ | :------ |
| `idempotencyKey` | `string` | key to update |
| `update` | [`DeepPartial`](../types/DeepPartial.md)<[`IdempotencyKey`](IdempotencyKey.md)\> | update object |

#### Returns

`Promise`<[`IdempotencyKey`](IdempotencyKey.md)\>

-`Promise`: result of the update operation
	-`IdempotencyKey`: 

#### Defined in

[packages/medusa/src/services/idempotency-key.ts:167](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/idempotency-key.ts#L167)

___

### withTransaction

**withTransaction**(`transactionManager?`): [`IdempotencyKeyService`](IdempotencyKeyService.md)

#### Parameters

| Name |
| :------ |
| `transactionManager?` | [`EntityManager`](EntityManager.md) |

#### Returns

[`IdempotencyKeyService`](IdempotencyKeyService.md)

-`IdempotencyKeyService`: 

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[withTransaction](TransactionBaseService.md#withtransaction)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L20)

___

### workStage

**workStage**(`idempotencyKey`, `callback`): `Promise`<[`IdempotencyKey`](IdempotencyKey.md)\>

Performs an atomic work stage.
An atomic work stage contains some related functionality, that needs to be
transactionally executed in isolation. An idempotent request will
always consist of 2 or more of these phases. The required phases are
"started" and "finished".

#### Parameters

| Name | Description |
| :------ | :------ |
| `idempotencyKey` | `string` | current idempotency key |
| `callback` | (`transactionManager`: [`EntityManager`](EntityManager.md)) => `Promise`<[`IdempotencyCallbackResult`](../types/IdempotencyCallbackResult.md)\> | functionality to execute within the phase |

#### Returns

`Promise`<[`IdempotencyKey`](IdempotencyKey.md)\>

-`Promise`: new updated idempotency key
	-`IdempotencyKey`: 

#### Defined in

[packages/medusa/src/services/idempotency-key.ts:196](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/idempotency-key.ts#L196)
