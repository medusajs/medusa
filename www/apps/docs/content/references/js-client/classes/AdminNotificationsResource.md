# Class: AdminNotificationsResource

## Hierarchy

- `default`

  ↳ **`AdminNotificationsResource`**

## Methods

### list

▸ **list**(`query?`, `customHeaders?`): `ResponsePromise`<`AdminNotificationsListRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | `AdminGetNotificationsParams` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminNotificationsListRes`\>

#### Defined in

[admin/notifications.ts:12](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/notifications.ts#L12)

___

### resend

▸ **resend**(`id`, `payload`, `customHeaders?`): `ResponsePromise`<`AdminNotificationsRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | `AdminPostNotificationsNotificationResendReq` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminNotificationsRes`\>

#### Defined in

[admin/notifications.ts:26](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/notifications.ts#L26)
