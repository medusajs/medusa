# NotificationService

## Hierarchy

- [`TransactionBaseService`](TransactionBaseService.md)

  ↳ **`NotificationService`**

## Constructors

### constructor

**new NotificationService**(`container`)

#### Parameters

| Name |
| :------ |
| `container` | [`InjectedDependencies`](../index.md#injecteddependencies-17) |

#### Overrides

[TransactionBaseService](TransactionBaseService.md).[constructor](TransactionBaseService.md#constructor)

#### Defined in

[packages/medusa/src/services/notification.ts:35](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/notification.ts#L35)

## Properties

### \_\_configModule\_\_

 `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: Record<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__configModule__](TransactionBaseService.md#__configmodule__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

 `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__container__](TransactionBaseService.md#__container__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

 `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: Record<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__moduleDeclaration__](TransactionBaseService.md#__moduledeclaration__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### attachmentGenerator\_

 `Protected` **attachmentGenerator\_**: `unknown` = `null`

#### Defined in

[packages/medusa/src/services/notification.ts:26](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/notification.ts#L26)

___

### container\_

 `Protected` `Readonly` **container\_**: [`InjectedDependencies`](../index.md#injecteddependencies-17) & {}

#### Defined in

[packages/medusa/src/services/notification.ts:27](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/notification.ts#L27)

___

### logger\_

 `Protected` `Readonly` **logger\_**: [`Logger`](../index.md#logger)

#### Defined in

[packages/medusa/src/services/notification.ts:30](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/notification.ts#L30)

___

### manager\_

 `Protected` **manager\_**: [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[manager_](TransactionBaseService.md#manager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### notificationProviderRepository\_

 `Protected` `Readonly` **notificationProviderRepository\_**: [`Repository`](Repository.md)<[`NotificationProvider`](NotificationProvider.md)\>

#### Defined in

[packages/medusa/src/services/notification.ts:33](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/notification.ts#L33)

___

### notificationRepository\_

 `Protected` `Readonly` **notificationRepository\_**: [`Repository`](Repository.md)<[`Notification`](Notification.md)\>

#### Defined in

[packages/medusa/src/services/notification.ts:31](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/notification.ts#L31)

___

### subscribers\_

 `Protected` **subscribers\_**: `object` = `{}`

#### Defined in

[packages/medusa/src/services/notification.ts:25](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/notification.ts#L25)

___

### transactionManager\_

 `Protected` **transactionManager\_**: `undefined` \| [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[transactionManager_](TransactionBaseService.md#transactionmanager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

## Accessors

### activeManager\_

`Protected` `get` **activeManager_**(): [`EntityManager`](EntityManager.md)

#### Returns

[`EntityManager`](EntityManager.md)

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
| `work` | (`transactionManager`: [`EntityManager`](EntityManager.md)) => `Promise`<`TResult`\> | the transactional work to be done |
| `isolationOrErrorHandler?` | [`IsolationLevel`](../index.md#isolationlevel) \| (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | the isolation level to be used for the work. |
| `maybeErrorHandlerOrDontFail?` | (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | Potential error handler |

#### Returns

`Promise`<`TResult`\>

-`Promise`: the result of the transactional work

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[atomicPhase_](TransactionBaseService.md#atomicphase_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

___

### handleEvent

**handleEvent**(`eventName`, `data`): `Promise`<`undefined` \| `void` \| [`Notification`](Notification.md)[]\>

Handles an event by relaying the event data to the subscribing providers.
The result of the notification send will be persisted in the database in
order to allow for resends. Will log any errors that are encountered.

#### Parameters

| Name | Description |
| :------ | :------ |
| `eventName` | `string` | the event to handle |
| `data` | Record<`string`, `unknown`\> | the data the event was sent with |

#### Returns

`Promise`<`undefined` \| `void` \| [`Notification`](Notification.md)[]\>

-`Promise`: the result of notification subscribed
	-`undefined \| void \| Notification[]`: (optional) 

#### Defined in

[packages/medusa/src/services/notification.ts:186](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/notification.ts#L186)

___

### list

**list**(`selector`, `config?`): `Promise`<[`Notification`](Notification.md)[]\>

Retrieves a list of notifications.

#### Parameters

| Name | Description |
| :------ | :------ |
| `selector` | [`Selector`](../index.md#selector)<[`Notification`](Notification.md)\> | the params to select the notifications by. |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`Notification`](Notification.md)\> | the configuration to apply to the query |

#### Returns

`Promise`<[`Notification`](Notification.md)[]\>

-`Promise`: the notifications that satisfy the query.
	-`Notification[]`: 
		-`Notification`: 

#### Defined in

[packages/medusa/src/services/notification.ts:79](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/notification.ts#L79)

___

### listAndCount

**listAndCount**(`selector`, `config?`): `Promise`<[[`Notification`](Notification.md)[], `number`]\>

Retrieves a list of notifications and total count.

#### Parameters

| Name | Description |
| :------ | :------ |
| `selector` | [`Selector`](../index.md#selector)<[`Notification`](Notification.md)\> | the params to select the notifications by. |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`Notification`](Notification.md)\> | the configuration to apply to the query |

#### Returns

`Promise`<[[`Notification`](Notification.md)[], `number`]\>

-`Promise`: the notifications that satisfy the query as well as the count.
	-`Notification[]`: 
	-`number`: (optional) 

#### Defined in

[packages/medusa/src/services/notification.ts:98](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/notification.ts#L98)

___

### registerAttachmentGenerator

**registerAttachmentGenerator**(`service`): `void`

Registers an attachment generator to the service. The generator can be
used to generate on demand invoices or other documents.

#### Parameters

| Name | Description |
| :------ | :------ |
| `service` | `unknown` | the service to assign to the attachmentGenerator |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

[packages/medusa/src/services/notification.ts:53](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/notification.ts#L53)

___

### registerInstalledProviders

**registerInstalledProviders**(`providerIds`): `Promise`<`void`\>

Takes a list of notification provider ids and persists them in the database.

#### Parameters

| Name | Description |
| :------ | :------ |
| `providerIds` | `string`[] | a list of provider ids |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

[packages/medusa/src/services/notification.ts:61](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/notification.ts#L61)

___

### resend

**resend**(`id`, `config?`): `Promise`<[`Notification`](Notification.md)\>

Resends a notification by retrieving a prior notification and calling the
underlying provider's resendNotification method.

#### Parameters

| Name | Description |
| :------ | :------ |
| `id` | `string` | the id of the notification |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`Notification`](Notification.md)\> | any configuration that might override the previous send |

#### Returns

`Promise`<[`Notification`](Notification.md)\>

-`Promise`: the newly created notification
	-`Notification`: 

#### Defined in

[packages/medusa/src/services/notification.ts:266](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/notification.ts#L266)

___

### retrieve

**retrieve**(`id`, `config?`): `Promise`<[`Notification`](Notification.md)\>

Retrieves a notification with a given id

#### Parameters

| Name | Description |
| :------ | :------ |
| `id` | `string` | the id of the notification |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`Notification`](Notification.md)\> | the configuration to apply to the query |

#### Returns

`Promise`<[`Notification`](Notification.md)\>

-`Promise`: the notification
	-`Notification`: 

#### Defined in

[packages/medusa/src/services/notification.ts:119](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/notification.ts#L119)

___

### retrieveProvider\_

`Protected` **retrieveProvider_**(`id`): [`AbstractNotificationService`](AbstractNotificationService.md)

Finds a provider with a given id. Will throw a NOT_FOUND error if the
resolution fails.

#### Parameters

| Name | Description |
| :------ | :------ |
| `id` | `string` | the id of the provider |

#### Returns

[`AbstractNotificationService`](AbstractNotificationService.md)

-`AbstractNotificationService`: the notification provider

#### Defined in

[packages/medusa/src/services/notification.ts:167](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/notification.ts#L167)

___

### send

**send**(`event`, `eventData`, `providerId`): `Promise`<`undefined` \| [`Notification`](Notification.md)\>

Sends a notification, by calling the given provider's sendNotification
method. Persists the Notification in the database.

#### Parameters

| Name | Description |
| :------ | :------ |
| `event` | `string` | the name of the event |
| `eventData` | Record<`string`, `unknown`\> | the data the event was sent with |
| `providerId` | `string` | the provider that should handle the event. |

#### Returns

`Promise`<`undefined` \| [`Notification`](Notification.md)\>

-`Promise`: the created notification
	-`undefined \| Notification`: (optional) 

#### Defined in

[packages/medusa/src/services/notification.ts:218](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/notification.ts#L218)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

___

### subscribe

**subscribe**(`eventName`, `providerId`): `void`

Subscribes a given provider to an event.

#### Parameters

| Name | Description |
| :------ | :------ |
| `eventName` | `string` | the event to subscribe to |
| `providerId` | `string` | the provider that the event will be sent to |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

[packages/medusa/src/services/notification.ts:146](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/notification.ts#L146)

___

### withTransaction

**withTransaction**(`transactionManager?`): [`NotificationService`](NotificationService.md)

#### Parameters

| Name |
| :------ |
| `transactionManager?` | [`EntityManager`](EntityManager.md) |

#### Returns

[`NotificationService`](NotificationService.md)

-`NotificationService`: 

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[withTransaction](TransactionBaseService.md#withtransaction)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
