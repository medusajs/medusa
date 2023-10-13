---
displayed_sidebar: jsClientSidebar
---

# Class: NotificationService

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).NotificationService

## Hierarchy

- [`TransactionBaseService`](internal-8.internal.TransactionBaseService.md)

  ↳ **`NotificationService`**

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

### attachmentGenerator\_

• `Protected` **attachmentGenerator\_**: `unknown`

#### Defined in

packages/medusa/dist/services/notification.d.ts:17

___

### container\_

• `Protected` `Readonly` **container\_**: [`InjectedDependencies`](../modules/internal-8.md#injecteddependencies-16) & {}

#### Defined in

packages/medusa/dist/services/notification.d.ts:18

___

### logger\_

• `Protected` `Readonly` **logger\_**: [`Logger`](../modules/internal-8.internal.md#logger)

#### Defined in

packages/medusa/dist/services/notification.d.ts:21

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[manager_](internal-8.internal.TransactionBaseService.md#manager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:7

___

### notificationProviderRepository\_

• `Protected` `Readonly` **notificationProviderRepository\_**: `Repository`<[`NotificationProvider`](internal-8.NotificationProvider.md)\>

#### Defined in

packages/medusa/dist/services/notification.d.ts:23

___

### notificationRepository\_

• `Protected` `Readonly` **notificationRepository\_**: `Repository`<[`Notification`](internal-8.internal.Notification.md)\>

#### Defined in

packages/medusa/dist/services/notification.d.ts:22

___

### subscribers\_

• `Protected` **subscribers\_**: `Object`

#### Defined in

packages/medusa/dist/services/notification.d.ts:16

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

### handleEvent

▸ **handleEvent**(`eventName`, `data`): `Promise`<`undefined` \| `void` \| [`Notification`](internal-8.internal.Notification.md)[]\>

Handles an event by relaying the event data to the subscribing providers.
The result of the notification send will be persisted in the database in
order to allow for resends. Will log any errors that are encountered.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventName` | `string` | the event to handle |
| `data` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> | the data the event was sent with |

#### Returns

`Promise`<`undefined` \| `void` \| [`Notification`](internal-8.internal.Notification.md)[]\>

the result of notification subscribed

#### Defined in

packages/medusa/dist/services/notification.d.ts:78

___

### list

▸ **list**(`selector`, `config?`): `Promise`<[`Notification`](internal-8.internal.Notification.md)[]\>

Retrieves a list of notifications.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | [`Selector`](../modules/internal-8.internal.md#selector)<[`Notification`](internal-8.internal.Notification.md)\> | the params to select the notifications by. |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`Notification`](internal-8.internal.Notification.md)\> | the configuration to apply to the query |

#### Returns

`Promise`<[`Notification`](internal-8.internal.Notification.md)[]\>

the notifications that satisfy the query.

#### Defined in

packages/medusa/dist/services/notification.d.ts:42

___

### listAndCount

▸ **listAndCount**(`selector`, `config?`): `Promise`<[[`Notification`](internal-8.internal.Notification.md)[], `number`]\>

Retrieves a list of notifications and total count.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | [`Selector`](../modules/internal-8.internal.md#selector)<[`Notification`](internal-8.internal.Notification.md)\> | the params to select the notifications by. |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`Notification`](internal-8.internal.Notification.md)\> | the configuration to apply to the query |

#### Returns

`Promise`<[[`Notification`](internal-8.internal.Notification.md)[], `number`]\>

the notifications that satisfy the query as well as the count.

#### Defined in

packages/medusa/dist/services/notification.d.ts:49

___

### registerAttachmentGenerator

▸ **registerAttachmentGenerator**(`service`): `void`

Registers an attachment generator to the service. The generator can be
used to generate on demand invoices or other documents.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `service` | `unknown` | the service to assign to the attachmentGenerator |

#### Returns

`void`

#### Defined in

packages/medusa/dist/services/notification.d.ts:30

___

### registerInstalledProviders

▸ **registerInstalledProviders**(`providerIds`): `Promise`<`void`\>

Takes a list of notification provider ids and persists them in the database.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `providerIds` | `string`[] | a list of provider ids |

#### Returns

`Promise`<`void`\>

#### Defined in

packages/medusa/dist/services/notification.d.ts:35

___

### resend

▸ **resend**(`id`, `config?`): `Promise`<[`Notification`](internal-8.internal.Notification.md)\>

Resends a notification by retrieving a prior notification and calling the
underlying provider's resendNotification method.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | the id of the notification |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`Notification`](internal-8.internal.Notification.md)\> | any configuration that might override the previous send |

#### Returns

`Promise`<[`Notification`](internal-8.internal.Notification.md)\>

the newly created notification

#### Defined in

packages/medusa/dist/services/notification.d.ts:96

___

### retrieve

▸ **retrieve**(`id`, `config?`): `Promise`<[`Notification`](internal-8.internal.Notification.md)\>

Retrieves a notification with a given id

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | the id of the notification |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`Notification`](internal-8.internal.Notification.md)\> | the configuration to apply to the query |

#### Returns

`Promise`<[`Notification`](internal-8.internal.Notification.md)\>

the notification

#### Defined in

packages/medusa/dist/services/notification.d.ts:56

___

### retrieveProvider\_

▸ `Protected` **retrieveProvider_**(`id`): [`AbstractNotificationService`](internal-8.internal.AbstractNotificationService.md)

Finds a provider with a given id. Will throw a NOT_FOUND error if the
resolution fails.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | the id of the provider |

#### Returns

[`AbstractNotificationService`](internal-8.internal.AbstractNotificationService.md)

the notification provider

#### Defined in

packages/medusa/dist/services/notification.d.ts:69

___

### send

▸ **send**(`event`, `eventData`, `providerId`): `Promise`<`undefined` \| [`Notification`](internal-8.internal.Notification.md)\>

Sends a notification, by calling the given provider's sendNotification
method. Persists the Notification in the database.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `string` | the name of the event |
| `eventData` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> | the data the event was sent with |
| `providerId` | `string` | the provider that should handle the event. |

#### Returns

`Promise`<`undefined` \| [`Notification`](internal-8.internal.Notification.md)\>

the created notification

#### Defined in

packages/medusa/dist/services/notification.d.ts:87

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

### subscribe

▸ **subscribe**(`eventName`, `providerId`): `void`

Subscribes a given provider to an event.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventName` | `string` | the event to subscribe to |
| `providerId` | `string` | the provider that the event will be sent to |

#### Returns

`void`

#### Defined in

packages/medusa/dist/services/notification.d.ts:62

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`NotificationService`](internal-8.internal.NotificationService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`NotificationService`](internal-8.internal.NotificationService.md)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[withTransaction](internal-8.internal.TransactionBaseService.md#withtransaction)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:11
