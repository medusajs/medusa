# Class: AdminNotificationsResource

## Hierarchy

- `default`

  ↳ **`AdminNotificationsResource`**

## Methods

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminNotificationsListRes`](../modules/internal-11.md#adminnotificationslistres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | [`AdminGetNotificationsParams`](internal-11.AdminGetNotificationsParams.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminNotificationsListRes`](../modules/internal-11.md#adminnotificationslistres)\>

#### Defined in

[medusa-js/src/resources/admin/notifications.ts:12](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa-js/src/resources/admin/notifications.ts#L12)

___

### resend

▸ **resend**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminNotificationsRes`](../modules/internal-11.md#adminnotificationsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostNotificationsNotificationResendReq`](internal-11.AdminPostNotificationsNotificationResendReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminNotificationsRes`](../modules/internal-11.md#adminnotificationsres)\>

#### Defined in

[medusa-js/src/resources/admin/notifications.ts:26](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa-js/src/resources/admin/notifications.ts#L26)
