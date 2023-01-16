# Class: AdminNotificationsResource

## Hierarchy

- `default`

  ↳ **`AdminNotificationsResource`**

## Methods

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminNotificationsListRes`](../modules/internal-12.md#adminnotificationslistres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | [`AdminGetNotificationsParams`](internal-12.AdminGetNotificationsParams.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminNotificationsListRes`](../modules/internal-12.md#adminnotificationslistres)\>

#### Defined in

[medusa-js/src/resources/admin/notifications.ts:12](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/notifications.ts#L12)

___

### resend

▸ **resend**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminNotificationsRes`](../modules/internal-12.md#adminnotificationsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostNotificationsNotificationResendReq`](internal-12.AdminPostNotificationsNotificationResendReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminNotificationsRes`](../modules/internal-12.md#adminnotificationsres)\>

#### Defined in

[medusa-js/src/resources/admin/notifications.ts:26](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/notifications.ts#L26)
