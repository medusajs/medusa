# Class: NotificationService

## Hierarchy

- `TransactionBaseService`<[`NotificationService`](NotificationService.md)\>

  ↳ **`NotificationService`**

## Constructors

### constructor

• **new NotificationService**(`container`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `container` | `InjectedDependencies` |

#### Overrides

TransactionBaseService&lt;NotificationService\&gt;.constructor

#### Defined in

[services/notification.ts:35](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/notification.ts#L35)

## Properties

### attachmentGenerator\_

• `Protected` **attachmentGenerator\_**: `unknown` = `null`

#### Defined in

[services/notification.ts:27](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/notification.ts#L27)

___

### configModule

• `Protected` `Optional` `Readonly` **configModule**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.configModule

___

### container

• `Protected` `Readonly` **container**: `unknown`

#### Inherited from

TransactionBaseService.container

___

### container\_

• `Protected` `Readonly` **container\_**: `InjectedDependencies` & {}

#### Defined in

[services/notification.ts:28](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/notification.ts#L28)

___

### logger\_

• `Protected` `Readonly` **logger\_**: `Logger`

#### Defined in

[services/notification.ts:31](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/notification.ts#L31)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[services/notification.ts:23](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/notification.ts#L23)

___

### notificationProviderRepository\_

• `Protected` `Readonly` **notificationProviderRepository\_**: typeof `NotificationProviderRepository`

#### Defined in

[services/notification.ts:33](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/notification.ts#L33)

___

### notificationRepository\_

• `Protected` `Readonly` **notificationRepository\_**: typeof `NotificationRepository`

#### Defined in

[services/notification.ts:32](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/notification.ts#L32)

___

### subscribers\_

• `Protected` **subscribers\_**: `Object` = `{}`

#### Defined in

[services/notification.ts:26](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/notification.ts#L26)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[services/notification.ts:24](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/notification.ts#L24)

## Methods

### atomicPhase\_

▸ `Protected` **atomicPhase_**<`TResult`, `TError`\>(`work`, `isolationOrErrorHandler?`, `maybeErrorHandlerOrDontFail?`): `Promise`<`TResult`\>

#### Type parameters

| Name |
| :------ |
| `TResult` |
| `TError` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `work` | (`transactionManager`: `EntityManager`) => `Promise`<`TResult`\> |  |
| `isolationOrErrorHandler?` | `IsolationLevel` \| (`error`: `TError`) => `Promise`<`void` \| `TResult`\> |  |
| `maybeErrorHandlerOrDontFail?` | (`error`: `TError`) => `Promise`<`void` \| `TResult`\> |  |

#### Returns

`Promise`<`TResult`\>

#### Inherited from

TransactionBaseService.atomicPhase\_

#### Defined in

[interfaces/transaction-base-service.ts:53](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/interfaces/transaction-base-service.ts#L53)

___

### handleEvent

▸ **handleEvent**(`eventName`, `data`): `Promise`<`undefined` \| `void` \| `Notification`[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventName` | `string` |  |
| `data` | `Record`<`string`, `unknown`\> |  |

#### Returns

`Promise`<`undefined` \| `void` \| `Notification`[]\>

#### Defined in

[services/notification.ts:173](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/notification.ts#L173)

___

### list

▸ **list**(`selector`, `config?`): `Promise`<`Notification`[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `Selector`<`Notification`\> |  |
| `config` | `FindConfig`<`Notification`\> |  |

#### Returns

`Promise`<`Notification`[]\>

#### Defined in

[services/notification.ts:85](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/notification.ts#L85)

___

### registerAttachmentGenerator

▸ **registerAttachmentGenerator**(`service`): `void`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `service` | `unknown` |  |

#### Returns

`void`

#### Defined in

[services/notification.ts:61](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/notification.ts#L61)

___

### registerInstalledProviders

▸ **registerInstalledProviders**(`providerIds`): `Promise`<`void`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `providerIds` | `string`[] |  |

#### Returns

`Promise`<`void`\>

#### Defined in

[services/notification.ts:69](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/notification.ts#L69)

___

### resend

▸ **resend**(`id`, `config?`): `Promise`<`Notification`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` |  |
| `config` | `FindConfig`<`Notification`\> |  |

#### Returns

`Promise`<`Notification`\>

#### Defined in

[services/notification.ts:253](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/notification.ts#L253)

___

### retrieve

▸ **retrieve**(`id`, `config?`): `Promise`<`Notification`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` |  |
| `config` | `FindConfig`<`Notification`\> |  |

#### Returns

`Promise`<`Notification`\>

#### Defined in

[services/notification.ts:106](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/notification.ts#L106)

___

### retrieveProvider\_

▸ `Protected` **retrieveProvider_**(`id`): `AbstractNotificationService`<`never`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` |  |

#### Returns

`AbstractNotificationService`<`never`\>

#### Defined in

[services/notification.ts:154](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/notification.ts#L154)

___

### send

▸ **send**(`event`, `eventData`, `providerId`): `Promise`<`undefined` \| `Notification`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `string` |  |
| `eventData` | `Record`<`string`, `unknown`\> |  |
| `providerId` | `string` |  |

#### Returns

`Promise`<`undefined` \| `Notification`\>

#### Defined in

[services/notification.ts:205](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/notification.ts#L205)

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

[interfaces/transaction-base-service.ts:34](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/interfaces/transaction-base-service.ts#L34)

___

### subscribe

▸ **subscribe**(`eventName`, `providerId`): `void`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventName` | `string` |  |
| `providerId` | `string` |  |

#### Returns

`void`

#### Defined in

[services/notification.ts:133](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/notification.ts#L133)

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

[interfaces/transaction-base-service.ts:16](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/interfaces/transaction-base-service.ts#L16)
