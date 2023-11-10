# INotificationService

## Hierarchy

- [`TransactionBaseService`](../classes/TransactionBaseService.md)

  ↳ **`INotificationService`**

## Implemented by

- [`AbstractNotificationService`](../classes/AbstractNotificationService.md)

## Properties

### \_\_configModule\_\_

 `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: Record<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](../classes/TransactionBaseService.md).[__configModule__](../classes/TransactionBaseService.md#__configmodule__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

 `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

[TransactionBaseService](../classes/TransactionBaseService.md).[__container__](../classes/TransactionBaseService.md#__container__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

 `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: Record<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](../classes/TransactionBaseService.md).[__moduleDeclaration__](../classes/TransactionBaseService.md#__moduledeclaration__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### manager\_

 `Protected` **manager\_**: [`EntityManager`](../classes/EntityManager.md)

#### Inherited from

[TransactionBaseService](../classes/TransactionBaseService.md).[manager_](../classes/TransactionBaseService.md#manager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### transactionManager\_

 `Protected` **transactionManager\_**: `undefined` \| [`EntityManager`](../classes/EntityManager.md)

#### Inherited from

[TransactionBaseService](../classes/TransactionBaseService.md).[transactionManager_](../classes/TransactionBaseService.md#transactionmanager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

## Accessors

### activeManager\_

`Protected` `get` **activeManager_**(): [`EntityManager`](../classes/EntityManager.md)

#### Returns

[`EntityManager`](../classes/EntityManager.md)

-`EntityManager`: 

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

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
| `work` | (`transactionManager`: [`EntityManager`](../classes/EntityManager.md)) => `Promise`<`TResult`\> | the transactional work to be done |
| `isolationOrErrorHandler?` | [`IsolationLevel`](../index.md#isolationlevel) \| (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | the isolation level to be used for the work. |
| `maybeErrorHandlerOrDontFail?` | (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | Potential error handler |

#### Returns

`Promise`<`TResult`\>

-`Promise`: the result of the transactional work

#### Inherited from

[TransactionBaseService](../classes/TransactionBaseService.md).[atomicPhase_](../classes/TransactionBaseService.md#atomicphase_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

___

### resendNotification

**resendNotification**(`notification`, `config`, `attachmentGenerator`): `Promise`<[`ReturnedData`](../index.md#returneddata)\>

#### Parameters

| Name |
| :------ |
| `notification` | `unknown` |
| `config` | `unknown` |
| `attachmentGenerator` | `unknown` |

#### Returns

`Promise`<[`ReturnedData`](../index.md#returneddata)\>

-`Promise`: 
	-`ReturnedData`: 
		-`data`: 
		-`status`: 
		-`to`: 

#### Defined in

[packages/medusa/src/interfaces/notification-service.ts:17](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/notification-service.ts#L17)

___

### sendNotification

**sendNotification**(`event`, `data`, `attachmentGenerator`): `Promise`<[`ReturnedData`](../index.md#returneddata)\>

#### Parameters

| Name |
| :------ |
| `event` | `string` |
| `data` | `unknown` |
| `attachmentGenerator` | `unknown` |

#### Returns

`Promise`<[`ReturnedData`](../index.md#returneddata)\>

-`Promise`: 
	-`ReturnedData`: 
		-`data`: 
		-`status`: 
		-`to`: 

#### Defined in

[packages/medusa/src/interfaces/notification-service.ts:11](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/notification-service.ts#L11)

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

[TransactionBaseService](../classes/TransactionBaseService.md).[shouldRetryTransaction_](../classes/TransactionBaseService.md#shouldretrytransaction_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

___

### withTransaction

**withTransaction**(`transactionManager?`): [`INotificationService`](INotificationService.md)

#### Parameters

| Name |
| :------ |
| `transactionManager?` | [`EntityManager`](../classes/EntityManager.md) |

#### Returns

[`INotificationService`](INotificationService.md)

-`INotificationService`: 

#### Inherited from

[TransactionBaseService](../classes/TransactionBaseService.md).[withTransaction](../classes/TransactionBaseService.md#withtransaction)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
