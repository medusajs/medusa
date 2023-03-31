# Class: NotificationService

## Hierarchy

- `TransactionBaseService`

  ↳ **`NotificationService`**

## Constructors

### constructor

• **new NotificationService**(`container`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `container` | `InjectedDependencies` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[packages/medusa/src/services/notification.ts:36](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/notification.ts#L36)

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

### attachmentGenerator\_

• `Protected` **attachmentGenerator\_**: `unknown` = `null`

#### Defined in

[packages/medusa/src/services/notification.ts:27](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/notification.ts#L27)

___

### container\_

• `Protected` `Readonly` **container\_**: `InjectedDependencies` & {}

#### Defined in

[packages/medusa/src/services/notification.ts:28](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/notification.ts#L28)

___

### logger\_

• `Protected` `Readonly` **logger\_**: `Logger`

#### Defined in

[packages/medusa/src/services/notification.ts:31](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/notification.ts#L31)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[packages/medusa/src/services/notification.ts:23](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/notification.ts#L23)

___

### notificationProviderRepository\_

• `Protected` `Readonly` **notificationProviderRepository\_**: typeof `NotificationProviderRepository`

#### Defined in

[packages/medusa/src/services/notification.ts:34](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/notification.ts#L34)

___

### notificationRepository\_

• `Protected` `Readonly` **notificationRepository\_**: typeof `NotificationRepository`

#### Defined in

[packages/medusa/src/services/notification.ts:32](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/notification.ts#L32)

___

### subscribers\_

• `Protected` **subscribers\_**: `Object` = `{}`

#### Defined in

[packages/medusa/src/services/notification.ts:26](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/notification.ts#L26)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[packages/medusa/src/services/notification.ts:24](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/notification.ts#L24)

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

### handleEvent

▸ **handleEvent**(`eventName`, `data`): `Promise`<`undefined` \| `void` \| `Notification`[]\>

Handles an event by relaying the event data to the subscribing providers.
The result of the notification send will be persisted in the database in
order to allow for resends. Will log any errors that are encountered.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventName` | `string` | the event to handle |
| `data` | `Record`<`string`, `unknown`\> | the data the event was sent with |

#### Returns

`Promise`<`undefined` \| `void` \| `Notification`[]\>

the result of notification subscribed

#### Defined in

[packages/medusa/src/services/notification.ts:174](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/notification.ts#L174)

___

### list

▸ **list**(`selector`, `config?`): `Promise`<`Notification`[]\>

Retrieves a list of notifications.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `Selector`<`Notification`\> | the params to select the notifications by. |
| `config` | `FindConfig`<`Notification`\> | the configuration to apply to the query |

#### Returns

`Promise`<`Notification`[]\>

the notifications that satisfy the query.

#### Defined in

[packages/medusa/src/services/notification.ts:86](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/notification.ts#L86)

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

[packages/medusa/src/services/notification.ts:62](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/notification.ts#L62)

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

[packages/medusa/src/services/notification.ts:70](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/notification.ts#L70)

___

### resend

▸ **resend**(`id`, `config?`): `Promise`<`Notification`\>

Resends a notification by retrieving a prior notification and calling the
underlying provider's resendNotification method.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | the id of the notification |
| `config` | `FindConfig`<`Notification`\> | any configuration that might override the previous  send |

#### Returns

`Promise`<`Notification`\>

the newly created notification

#### Defined in

[packages/medusa/src/services/notification.ts:254](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/notification.ts#L254)

___

### retrieve

▸ **retrieve**(`id`, `config?`): `Promise`<`Notification`\>

Retrieves a notification with a given id

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | the id of the notification |
| `config` | `FindConfig`<`Notification`\> | the configuration to apply to the query |

#### Returns

`Promise`<`Notification`\>

the notification

#### Defined in

[packages/medusa/src/services/notification.ts:107](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/notification.ts#L107)

___

### retrieveProvider\_

▸ `Protected` **retrieveProvider_**(`id`): `AbstractNotificationService`

Finds a provider with a given id. Will throw a NOT_FOUND error if the
resolution fails.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | the id of the provider |

#### Returns

`AbstractNotificationService`

the notification provider

#### Defined in

[packages/medusa/src/services/notification.ts:155](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/notification.ts#L155)

___

### send

▸ **send**(`event`, `eventData`, `providerId`): `Promise`<`undefined` \| `Notification`\>

Sends a notification, by calling the given provider's sendNotification
method. Persists the Notification in the database.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `string` | the name of the event |
| `eventData` | `Record`<`string`, `unknown`\> | the data the event was sent with |
| `providerId` | `string` | the provider that should hande the event. |

#### Returns

`Promise`<`undefined` \| `Notification`\>

the created notification

#### Defined in

[packages/medusa/src/services/notification.ts:206](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/notification.ts#L206)

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

[packages/medusa/src/services/notification.ts:134](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/notification.ts#L134)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`NotificationService`](NotificationService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`NotificationService`](NotificationService.md)

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L14)
