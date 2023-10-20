---
displayed_sidebar: jsClientSidebar
---

# Class: AbstractNotificationService

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AbstractNotificationService

## Hierarchy

- [`TransactionBaseService`](internal-8.internal.TransactionBaseService.md)

  ↳ **`AbstractNotificationService`**

## Implements

- [`INotificationService`](../interfaces/internal-8.internal.INotificationService.md)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Implementation of

[INotificationService](../interfaces/internal-8.internal.INotificationService.md).[__configModule__](../interfaces/internal-8.internal.INotificationService.md#__configmodule__)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[__configModule__](internal-8.internal.TransactionBaseService.md#__configmodule__)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:5

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Implementation of

[INotificationService](../interfaces/internal-8.internal.INotificationService.md).[__container__](../interfaces/internal-8.internal.INotificationService.md#__container__)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[__container__](internal-8.internal.TransactionBaseService.md#__container__)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:4

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Implementation of

[INotificationService](../interfaces/internal-8.internal.INotificationService.md).[__moduleDeclaration__](../interfaces/internal-8.internal.INotificationService.md#__moduledeclaration__)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[__moduleDeclaration__](internal-8.internal.TransactionBaseService.md#__moduledeclaration__)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:6

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Implementation of

[INotificationService](../interfaces/internal-8.internal.INotificationService.md).[manager_](../interfaces/internal-8.internal.INotificationService.md#manager_)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[manager_](internal-8.internal.TransactionBaseService.md#manager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:7

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Implementation of

[INotificationService](../interfaces/internal-8.internal.INotificationService.md).[transactionManager_](../interfaces/internal-8.internal.INotificationService.md#transactionmanager_)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[transactionManager_](internal-8.internal.TransactionBaseService.md#transactionmanager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:8

___

### identifier

▪ `Static` **identifier**: `string`

#### Defined in

packages/medusa/dist/interfaces/notification-service.d.ts:12

## Accessors

### activeManager\_

• `Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

#### Implementation of

INotificationService.activeManager\_

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

#### Implementation of

[INotificationService](../interfaces/internal-8.internal.INotificationService.md).[atomicPhase_](../interfaces/internal-8.internal.INotificationService.md#atomicphase_)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[atomicPhase_](internal-8.internal.TransactionBaseService.md#atomicphase_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:24

___

### getIdentifier

▸ **getIdentifier**(): `string`

#### Returns

`string`

#### Defined in

packages/medusa/dist/interfaces/notification-service.d.ts:13

___

### resendNotification

▸ `Abstract` **resendNotification**(`notification`, `config`, `attachmentGenerator`): `Promise`<[`ReturnedData`](../modules/internal-8.md#returneddata)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `notification` | `unknown` |
| `config` | `unknown` |
| `attachmentGenerator` | `unknown` |

#### Returns

`Promise`<[`ReturnedData`](../modules/internal-8.md#returneddata)\>

#### Implementation of

[INotificationService](../interfaces/internal-8.internal.INotificationService.md).[resendNotification](../interfaces/internal-8.internal.INotificationService.md#resendnotification)

#### Defined in

packages/medusa/dist/interfaces/notification-service.d.ts:15

___

### sendNotification

▸ `Abstract` **sendNotification**(`event`, `data`, `attachmentGenerator`): `Promise`<[`ReturnedData`](../modules/internal-8.md#returneddata)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` |
| `data` | `unknown` |
| `attachmentGenerator` | `unknown` |

#### Returns

`Promise`<[`ReturnedData`](../modules/internal-8.md#returneddata)\>

#### Implementation of

[INotificationService](../interfaces/internal-8.internal.INotificationService.md).[sendNotification](../interfaces/internal-8.internal.INotificationService.md#sendnotification)

#### Defined in

packages/medusa/dist/interfaces/notification-service.d.ts:14

___

### shouldRetryTransaction\_

▸ `Protected` **shouldRetryTransaction_**(`err`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `err` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> \| { `code`: `string`  } |

#### Returns

`boolean`

#### Implementation of

[INotificationService](../interfaces/internal-8.internal.INotificationService.md).[shouldRetryTransaction_](../interfaces/internal-8.internal.INotificationService.md#shouldretrytransaction_)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[shouldRetryTransaction_](internal-8.internal.TransactionBaseService.md#shouldretrytransaction_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:12

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`AbstractNotificationService`](internal-8.internal.AbstractNotificationService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`AbstractNotificationService`](internal-8.internal.AbstractNotificationService.md)

#### Implementation of

[INotificationService](../interfaces/internal-8.internal.INotificationService.md).[withTransaction](../interfaces/internal-8.internal.INotificationService.md#withtransaction)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[withTransaction](internal-8.internal.TransactionBaseService.md#withtransaction)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:11
