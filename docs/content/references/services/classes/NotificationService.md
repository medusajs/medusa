# Class: NotificationService

Provides layer to manipulate orchestrate notifications.

## Hierarchy

- `"medusa-interfaces"`

  ↳ **`NotificationService`**

## Constructors

### constructor

• **new NotificationService**(`container`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `container` | `any` |

#### Overrides

BaseService.constructor

#### Defined in

[services/notification.js:9](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/notification.js#L9)

## Properties

### attachmentGenerator\_

• **attachmentGenerator\_**: `any`

#### Defined in

[services/notification.js:30](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/notification.js#L30)

___

### container\_

• **container\_**: `any`

#### Defined in

[services/notification.js:19](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/notification.js#L19)

___

### logger\_

• **logger\_**: `any`

#### Defined in

[services/notification.js:23](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/notification.js#L23)

___

### notificationProviderRepository\_

• **notificationProviderRepository\_**: `any`

#### Defined in

[services/notification.js:27](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/notification.js#L27)

___

### subscribers\_

• **subscribers\_**: `Object`

#### Defined in

[services/notification.js:29](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/notification.js#L29)

## Methods

### handleEvent

▸ **handleEvent**(`eventName`, `data`): `Promise`<`any`\>

Handles an event by relaying the event data to the subscribing providers.
The result of the notification send will be persisted in the database in
order to allow for resends. Will log any errors that are encountered.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventName` | `string` | the event to handle |
| `data` | `any` | the data the event was sent with |

#### Returns

`Promise`<`any`\>

- the result of notification subscribed

#### Defined in

[services/notification.js:166](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/notification.js#L166)

___

### list

▸ **list**(`selector`, `config?`): `Notification`[]

Retrieves a list of notifications.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `any` | the params to select the notifications by. |
| `config` | `any` | the configuration to apply to the query |

#### Returns

`Notification`[]

the notifications that satisfy the query.

#### Defined in

[services/notification.js:84](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/notification.js#L84)

___

### registerAttachmentGenerator

▸ **registerAttachmentGenerator**(`service`): `void`

Registers an attachment generator to the service. The generator can be
used to generate on demand invoices or other documents.

#### Parameters

| Name | Type |
| :------ | :------ |
| `service` | `any` |

#### Returns

`void`

#### Defined in

[services/notification.js:38](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/notification.js#L38)

___

### registerInstalledProviders

▸ **registerInstalledProviders**(`providers`): `Promise`<`void`\>

Takes a list of notification provider ids and persists them in the database.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `providers` | `string`[] | a list of provider ids |

#### Returns

`Promise`<`void`\>

#### Defined in

[services/notification.js:68](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/notification.js#L68)

___

### resend

▸ **resend**(`id`, `config?`): `Notification`

Resends a notification by retrieving a prior notification and calling the
underlying provider's resendNotification method.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | the id of the notification |
| `config` | `any` | any configuration that might override the previous  send |

#### Returns

`Notification`

the newly created notification

#### Defined in

[services/notification.js:237](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/notification.js#L237)

___

### retrieve

▸ **retrieve**(`id`, `config?`): `Notification`

Retrieves a notification with a given id

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | the id of the notification |
| `config` | `any` | the configuration to apply to the query |

#### Returns

`Notification`

the notification

#### Defined in

[services/notification.js:101](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/notification.js#L101)

___

### retrieveProvider\_

▸ **retrieveProvider_**(`id`): `NotificationProvider`

Finds a provider with a given id. Will throw a NOT_FOUND error if the
resolution fails.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | the id of the provider |

#### Returns

`NotificationProvider`

the notification provider

#### Defined in

[services/notification.js:147](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/notification.js#L147)

___

### send

▸ **send**(`event`, `eventData`, `providerId`): `Notification`

Sends a notification, by calling the given provider's sendNotification
method. Persists the Notification in the database.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `string` | the name of the event |
| `eventData` | `any` | the data the event was sent with |
| `providerId` | `string` | the provider that should hande the event. |

#### Returns

`Notification`

the created notification

#### Defined in

[services/notification.js:195](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/notification.js#L195)

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

[services/notification.js:126](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/notification.js#L126)

___

### withTransaction

▸ **withTransaction**(`transactionManager`): [`NotificationService`](NotificationService.md)

Sets the service's manager to a given transaction manager.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `transactionManager` | `EntityManager` | the manager to use |

#### Returns

[`NotificationService`](NotificationService.md)

a cloned notification service

#### Defined in

[services/notification.js:47](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/notification.js#L47)
