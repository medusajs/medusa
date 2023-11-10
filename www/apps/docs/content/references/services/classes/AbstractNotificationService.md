# AbstractNotificationService

## Hierarchy

- [`TransactionBaseService`](TransactionBaseService.md)

  ↳ **`AbstractNotificationService`**

## Implements

- [`INotificationService`](../interfaces/INotificationService.md)

## Constructors

### constructor

`Protected` **new AbstractNotificationService**(`__container__`, `__configModule__?`, `__moduleDeclaration__?`)

#### Parameters

| Name |
| :------ |
| `__container__` | `any` |
| `__configModule__?` | Record<`string`, `unknown`\> |
| `__moduleDeclaration__?` | Record<`string`, `unknown`\> |

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[constructor](TransactionBaseService.md#constructor)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:12](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L12)

## Properties

### \_\_configModule\_\_

 `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: Record<`string`, `unknown`\>

#### Implementation of

[INotificationService](../interfaces/INotificationService.md).[__configModule__](../interfaces/INotificationService.md#__configmodule__)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__configModule__](TransactionBaseService.md#__configmodule__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

 `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Implementation of

[INotificationService](../interfaces/INotificationService.md).[__container__](../interfaces/INotificationService.md#__container__)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__container__](TransactionBaseService.md#__container__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

 `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: Record<`string`, `unknown`\>

#### Implementation of

[INotificationService](../interfaces/INotificationService.md).[__moduleDeclaration__](../interfaces/INotificationService.md#__moduledeclaration__)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__moduleDeclaration__](TransactionBaseService.md#__moduledeclaration__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### manager\_

 `Protected` **manager\_**: [`EntityManager`](EntityManager.md)

#### Implementation of

[INotificationService](../interfaces/INotificationService.md).[manager_](../interfaces/INotificationService.md#manager_)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[manager_](TransactionBaseService.md#manager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### transactionManager\_

 `Protected` **transactionManager\_**: `undefined` \| [`EntityManager`](EntityManager.md)

#### Implementation of

[INotificationService](../interfaces/INotificationService.md).[transactionManager_](../interfaces/INotificationService.md#transactionmanager_)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[transactionManager_](TransactionBaseService.md#transactionmanager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

___

### identifier

 `Static` **identifier**: `string`

#### Defined in

[packages/medusa/src/interfaces/notification-service.ts:28](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/notification-service.ts#L28)

## Accessors

### activeManager\_

`Protected` `get` **activeManager_**(): [`EntityManager`](EntityManager.md)

#### Returns

[`EntityManager`](EntityManager.md)

-`EntityManager`: 

#### Implementation of

INotificationService.activeManager\_

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

#### Implementation of

[INotificationService](../interfaces/INotificationService.md).[atomicPhase_](../interfaces/INotificationService.md#atomicphase_)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[atomicPhase_](TransactionBaseService.md#atomicphase_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

___

### getIdentifier

**getIdentifier**(): `string`

#### Returns

`string`

-`string`: (optional) 

#### Defined in

[packages/medusa/src/interfaces/notification-service.ts:30](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/notification-service.ts#L30)

___

### resendNotification

`Abstract` **resendNotification**(`notification`, `config`, `attachmentGenerator`): `Promise`<[`ReturnedData`](../types/ReturnedData.md)\>

#### Parameters

| Name |
| :------ |
| `notification` | `unknown` |
| `config` | `unknown` |
| `attachmentGenerator` | `unknown` |

#### Returns

`Promise`<[`ReturnedData`](../types/ReturnedData.md)\>

-`Promise`: 
	-`ReturnedData`: 
		-`data`: 
		-`status`: 
		-`to`: 

#### Implementation of

[INotificationService](../interfaces/INotificationService.md).[resendNotification](../interfaces/INotificationService.md#resendnotification)

#### Defined in

[packages/medusa/src/interfaces/notification-service.ts:40](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/notification-service.ts#L40)

___

### sendNotification

`Abstract` **sendNotification**(`event`, `data`, `attachmentGenerator`): `Promise`<[`ReturnedData`](../types/ReturnedData.md)\>

#### Parameters

| Name |
| :------ |
| `event` | `string` |
| `data` | `unknown` |
| `attachmentGenerator` | `unknown` |

#### Returns

`Promise`<[`ReturnedData`](../types/ReturnedData.md)\>

-`Promise`: 
	-`ReturnedData`: 
		-`data`: 
		-`status`: 
		-`to`: 

#### Implementation of

[INotificationService](../interfaces/INotificationService.md).[sendNotification](../interfaces/INotificationService.md#sendnotification)

#### Defined in

[packages/medusa/src/interfaces/notification-service.ts:34](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/notification-service.ts#L34)

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

#### Implementation of

[INotificationService](../interfaces/INotificationService.md).[shouldRetryTransaction_](../interfaces/INotificationService.md#shouldretrytransaction_)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[shouldRetryTransaction_](TransactionBaseService.md#shouldretrytransaction_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

___

### withTransaction

**withTransaction**(`transactionManager?`): [`AbstractNotificationService`](AbstractNotificationService.md)

#### Parameters

| Name |
| :------ |
| `transactionManager?` | [`EntityManager`](EntityManager.md) |

#### Returns

[`AbstractNotificationService`](AbstractNotificationService.md)

-`AbstractNotificationService`: 

#### Implementation of

[INotificationService](../interfaces/INotificationService.md).[withTransaction](../interfaces/INotificationService.md#withtransaction)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[withTransaction](TransactionBaseService.md#withtransaction)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
