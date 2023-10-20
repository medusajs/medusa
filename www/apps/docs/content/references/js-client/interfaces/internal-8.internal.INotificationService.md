---
displayed_sidebar: jsClientSidebar
---

# Interface: INotificationService

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).INotificationService

## Hierarchy

- [`TransactionBaseService`](../classes/internal-8.internal.TransactionBaseService.md)

  ↳ **`INotificationService`**

## Implemented by

- [`AbstractNotificationService`](../classes/internal-8.internal.AbstractNotificationService.md)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](../classes/internal-8.internal.TransactionBaseService.md).[__configModule__](../classes/internal-8.internal.TransactionBaseService.md#__configmodule__)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:5

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

[TransactionBaseService](../classes/internal-8.internal.TransactionBaseService.md).[__container__](../classes/internal-8.internal.TransactionBaseService.md#__container__)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:4

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](../classes/internal-8.internal.TransactionBaseService.md).[__moduleDeclaration__](../classes/internal-8.internal.TransactionBaseService.md#__moduledeclaration__)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:6

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

[TransactionBaseService](../classes/internal-8.internal.TransactionBaseService.md).[manager_](../classes/internal-8.internal.TransactionBaseService.md#manager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:7

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

[TransactionBaseService](../classes/internal-8.internal.TransactionBaseService.md).[transactionManager_](../classes/internal-8.internal.TransactionBaseService.md#transactionmanager_)

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

[TransactionBaseService](../classes/internal-8.internal.TransactionBaseService.md).[atomicPhase_](../classes/internal-8.internal.TransactionBaseService.md#atomicphase_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:24

___

### resendNotification

▸ **resendNotification**(`notification`, `config`, `attachmentGenerator`): `Promise`<[`ReturnedData`](../modules/internal-8.md#returneddata)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `notification` | `unknown` |
| `config` | `unknown` |
| `attachmentGenerator` | `unknown` |

#### Returns

`Promise`<[`ReturnedData`](../modules/internal-8.md#returneddata)\>

#### Defined in

packages/medusa/dist/interfaces/notification-service.d.ts:9

___

### sendNotification

▸ **sendNotification**(`event`, `data`, `attachmentGenerator`): `Promise`<[`ReturnedData`](../modules/internal-8.md#returneddata)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` |
| `data` | `unknown` |
| `attachmentGenerator` | `unknown` |

#### Returns

`Promise`<[`ReturnedData`](../modules/internal-8.md#returneddata)\>

#### Defined in

packages/medusa/dist/interfaces/notification-service.d.ts:8

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

[TransactionBaseService](../classes/internal-8.internal.TransactionBaseService.md).[shouldRetryTransaction_](../classes/internal-8.internal.TransactionBaseService.md#shouldretrytransaction_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:12

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`INotificationService`](internal-8.internal.INotificationService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`INotificationService`](internal-8.internal.INotificationService.md)

#### Inherited from

[TransactionBaseService](../classes/internal-8.internal.TransactionBaseService.md).[withTransaction](../classes/internal-8.internal.TransactionBaseService.md#withtransaction)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:11
