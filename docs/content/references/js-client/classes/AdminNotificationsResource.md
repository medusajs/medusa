# Class: AdminNotificationsResource

## Hierarchy

- `default`

  ↳ **`AdminNotificationsResource`**

## Methods

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminNotificationsListRes`](../modules/internal.md#adminnotificationslistres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | [`AdminGetNotificationsParams`](internal.AdminGetNotificationsParams.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminNotificationsListRes`](../modules/internal.md#adminnotificationslistres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/notifications.ts:12](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/notifications.ts#L12)

___

### resend

▸ **resend**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminNotificationsRes`](../modules/internal.md#adminnotificationsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostNotificationsNotificationResendReq`](internal.AdminPostNotificationsNotificationResendReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminNotificationsRes`](../modules/internal.md#adminnotificationsres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/notifications.ts:25](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/notifications.ts#L25)
