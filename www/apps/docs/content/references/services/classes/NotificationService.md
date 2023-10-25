# NotificationService

## Hierarchy

- `TransactionBaseService`

  ↳ **`NotificationService`**

## Constructors

### constructor

**new NotificationService**(`container`)

#### Parameters

| Name |
| :------ |
| `container` | `InjectedDependencies` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[medusa/src/services/notification.ts:34](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/notification.ts#L34)

## Properties

### \_\_configModule\_\_

 `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: Record<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

 `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

 `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: Record<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_moduleDeclaration\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### attachmentGenerator\_

 `Protected` **attachmentGenerator\_**: `unknown` = `null`

#### Defined in

[medusa/src/services/notification.ts:25](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/notification.ts#L25)

___

### container\_

 `Protected` `Readonly` **container\_**: `InjectedDependencies` & {}

#### Defined in

[medusa/src/services/notification.ts:26](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/notification.ts#L26)

___

### logger\_

 `Protected` `Readonly` **logger\_**: `Logger`

#### Defined in

[medusa/src/services/notification.ts:29](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/notification.ts#L29)

___

### manager\_

 `Protected` **manager\_**: `EntityManager`

#### Inherited from

TransactionBaseService.manager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### notificationProviderRepository\_

 `Protected` `Readonly` **notificationProviderRepository\_**: `Repository`<`NotificationProvider`\>

#### Defined in

[medusa/src/services/notification.ts:32](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/notification.ts#L32)

___

### notificationRepository\_

 `Protected` `Readonly` **notificationRepository\_**: `Repository`<`Notification`\>

#### Defined in

[medusa/src/services/notification.ts:30](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/notification.ts#L30)

___

### subscribers\_

 `Protected` **subscribers\_**: `object` = `{}`

#### Defined in

[medusa/src/services/notification.ts:24](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/notification.ts#L24)

___

### transactionManager\_

 `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

TransactionBaseService.transactionManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

## Accessors

### activeManager\_

`Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

-`EntityManager`: 

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

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
| `work` | (`transactionManager`: `EntityManager`) => `Promise`<`TResult`\> | the transactional work to be done |
| `isolationOrErrorHandler?` | `IsolationLevel` \| (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | the isolation level to be used for the work. |
| `maybeErrorHandlerOrDontFail?` | (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | Potential error handler |

#### Returns

`Promise`<`TResult`\>

-`Promise`: the result of the transactional work

#### Inherited from

TransactionBaseService.atomicPhase\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

___

### handleEvent

**handleEvent**(`eventName`, `data`): `Promise`<`undefined` \| `void` \| `Notification`[]\>

Handles an event by relaying the event data to the subscribing providers.
The result of the notification send will be persisted in the database in
order to allow for resends. Will log any errors that are encountered.

#### Parameters

| Name | Description |
| :------ | :------ |
| `eventName` | `string` | the event to handle |
| `data` | Record<`string`, `unknown`\> | the data the event was sent with |

#### Returns

`Promise`<`undefined` \| `void` \| `Notification`[]\>

-`Promise`: the result of notification subscribed
	-`undefined \| void \| Notification[]`: (optional) 

#### Defined in

[medusa/src/services/notification.ts:185](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/notification.ts#L185)

___

### list

**list**(`selector`, `config?`): `Promise`<`Notification`[]\>

Retrieves a list of notifications.

#### Parameters

| Name | Description |
| :------ | :------ |
| `selector` | `Selector`<`Notification`\> | the params to select the notifications by. |
| `config` | `FindConfig`<`Notification`\> | the configuration to apply to the query |

#### Returns

`Promise`<`Notification`[]\>

-`Promise`: the notifications that satisfy the query.
	-`Notification[]`: 
		-`Notification`: 

#### Defined in

[medusa/src/services/notification.ts:78](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/notification.ts#L78)

___

### listAndCount

**listAndCount**(`selector`, `config?`): `Promise`<[`Notification`[], `number`]\>

Retrieves a list of notifications and total count.

#### Parameters

| Name | Description |
| :------ | :------ |
| `selector` | `Selector`<`Notification`\> | the params to select the notifications by. |
| `config` | `FindConfig`<`Notification`\> | the configuration to apply to the query |

#### Returns

`Promise`<[`Notification`[], `number`]\>

-`Promise`: the notifications that satisfy the query as well as the count.
	-`Notification[]`: 
	-`number`: (optional) 

#### Defined in

[medusa/src/services/notification.ts:97](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/notification.ts#L97)

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

[medusa/src/services/notification.ts:52](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/notification.ts#L52)

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

[medusa/src/services/notification.ts:60](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/notification.ts#L60)

___

### resend

**resend**(`id`, `config?`): `Promise`<`Notification`\>

Resends a notification by retrieving a prior notification and calling the
underlying provider's resendNotification method.

#### Parameters

| Name | Description |
| :------ | :------ |
| `id` | `string` | the id of the notification |
| `config` | `FindConfig`<`Notification`\> | any configuration that might override the previous send |

#### Returns

`Promise`<`Notification`\>

-`Promise`: the newly created notification
	-`Notification`: 

#### Defined in

[medusa/src/services/notification.ts:265](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/notification.ts#L265)

___

### retrieve

**retrieve**(`id`, `config?`): `Promise`<`Notification`\>

Retrieves a notification with a given id

#### Parameters

| Name | Description |
| :------ | :------ |
| `id` | `string` | the id of the notification |
| `config` | `FindConfig`<`Notification`\> | the configuration to apply to the query |

#### Returns

`Promise`<`Notification`\>

-`Promise`: the notification
	-`Notification`: 

#### Defined in

[medusa/src/services/notification.ts:118](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/notification.ts#L118)

___

### retrieveProvider\_

`Protected` **retrieveProvider_**(`id`): `AbstractNotificationService`

Finds a provider with a given id. Will throw a NOT_FOUND error if the
resolution fails.

#### Parameters

| Name | Description |
| :------ | :------ |
| `id` | `string` | the id of the provider |

#### Returns

`AbstractNotificationService`

-`AbstractNotificationService`: the notification provider

#### Defined in

[medusa/src/services/notification.ts:166](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/notification.ts#L166)

___

### send

**send**(`event`, `eventData`, `providerId`): `Promise`<`undefined` \| `Notification`\>

Sends a notification, by calling the given provider's sendNotification
method. Persists the Notification in the database.

#### Parameters

| Name | Description |
| :------ | :------ |
| `event` | `string` | the name of the event |
| `eventData` | Record<`string`, `unknown`\> | the data the event was sent with |
| `providerId` | `string` | the provider that should handle the event. |

#### Returns

`Promise`<`undefined` \| `Notification`\>

-`Promise`: the created notification
	-`undefined \| Notification`: (optional) 

#### Defined in

[medusa/src/services/notification.ts:217](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/notification.ts#L217)

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

TransactionBaseService.shouldRetryTransaction\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

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

[medusa/src/services/notification.ts:145](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/notification.ts#L145)

___

### withTransaction

**withTransaction**(`transactionManager?`): [`NotificationService`](NotificationService.md)

#### Parameters

| Name |
| :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`NotificationService`](NotificationService.md)

-`NotificationService`: 

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
