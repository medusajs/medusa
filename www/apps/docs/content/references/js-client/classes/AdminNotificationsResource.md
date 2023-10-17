---
displayed_sidebar: jsClientSidebar
---

# Class: AdminNotificationsResource

## Hierarchy

- `default`

  ↳ **`AdminNotificationsResource`**

## Methods

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminNotificationsListRes`](../modules/internal-8.internal.md#adminnotificationslistres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | [`AdminGetNotificationsParams`](internal-8.internal.AdminGetNotificationsParams.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminNotificationsListRes`](../modules/internal-8.internal.md#adminnotificationslistres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/notifications.ts:12](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/notifications.ts#L12)

___

### resend

▸ **resend**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminNotificationsRes`](../modules/internal-8.internal.md#adminnotificationsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostNotificationsNotificationResendReq`](internal-8.internal.AdminPostNotificationsNotificationResendReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminNotificationsRes`](../modules/internal-8.internal.md#adminnotificationsres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/notifications.ts:26](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/notifications.ts#L26)
