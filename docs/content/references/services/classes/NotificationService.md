# Class: NotificationService

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

[services/notification.js:9](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/notification.js#L9)

## Properties

### attachmentGenerator\_

• **attachmentGenerator\_**: `any`

#### Defined in

[services/notification.js:30](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/notification.js#L30)

___

### container\_

• **container\_**: `any`

#### Defined in

[services/notification.js:19](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/notification.js#L19)

___

### logger\_

• **logger\_**: `any`

#### Defined in

[services/notification.js:23](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/notification.js#L23)

___

### notificationProviderRepository\_

• **notificationProviderRepository\_**: `any`

#### Defined in

[services/notification.js:27](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/notification.js#L27)

___

### subscribers\_

• **subscribers\_**: `Object`

#### Defined in

[services/notification.js:29](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/notification.js#L29)

## Methods

### handleEvent

▸ **handleEvent**(`eventName`, `data`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventName` | `string` |  |
| `data` | `any` |  |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/notification.js:166](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/notification.js#L166)

___

### list

▸ **list**(`selector`, `config?`): `Notification`[]

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `any` |  |
| `config` | `any` |  |

#### Returns

`Notification`[]

#### Defined in

[services/notification.js:84](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/notification.js#L84)

___

### registerAttachmentGenerator

▸ **registerAttachmentGenerator**(`service`): `void`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `service` | `any` |  |

#### Returns

`void`

#### Defined in

[services/notification.js:38](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/notification.js#L38)

___

### registerInstalledProviders

▸ **registerInstalledProviders**(`providers`): `Promise`<`void`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `providers` | `string`[] |  |

#### Returns

`Promise`<`void`\>

#### Defined in

[services/notification.js:68](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/notification.js#L68)

___

### resend

▸ **resend**(`id`, `config?`): `Notification`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` |  |
| `config` | `any` |  |

#### Returns

`Notification`

#### Defined in

[services/notification.js:237](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/notification.js#L237)

___

### retrieve

▸ **retrieve**(`id`, `config?`): `Notification`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` |  |
| `config` | `any` |  |

#### Returns

`Notification`

#### Defined in

[services/notification.js:101](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/notification.js#L101)

___

### retrieveProvider\_

▸ **retrieveProvider_**(`id`): `NotificationProvider`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` |  |

#### Returns

`NotificationProvider`

#### Defined in

[services/notification.js:147](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/notification.js#L147)

___

### send

▸ **send**(`event`, `eventData`, `providerId`): `Notification`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `string` |  |
| `eventData` | `any` |  |
| `providerId` | `string` |  |

#### Returns

`Notification`

#### Defined in

[services/notification.js:195](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/notification.js#L195)

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

[services/notification.js:126](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/notification.js#L126)

___

### withTransaction

▸ **withTransaction**(`transactionManager`): [`NotificationService`](NotificationService.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `transactionManager` | `EntityManager` |  |

#### Returns

[`NotificationService`](NotificationService.md)

#### Defined in

[services/notification.js:47](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/notification.js#L47)
