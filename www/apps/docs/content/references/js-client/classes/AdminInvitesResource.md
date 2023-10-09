# Class: AdminInvitesResource

## Hierarchy

- `default`

  ↳ **`AdminInvitesResource`**

## Methods

### accept

▸ **accept**(`payload`, `customHeaders?`): `ResponsePromise`

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | `AdminPostInvitesInviteAcceptReq` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`

#### Defined in

[admin/invites.ts:10](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/invites.ts#L10)

___

### create

▸ **create**(`payload`, `customHeaders?`): `ResponsePromise`

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | `AdminPostInvitesPayload` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`

#### Defined in

[admin/invites.ts:18](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/invites.ts#L18)

___

### delete

▸ **delete**(`id`, `customHeaders?`): `ResponsePromise`<`DeleteResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`DeleteResponse`\>

#### Defined in

[admin/invites.ts:26](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/invites.ts#L26)

___

### list

▸ **list**(`customHeaders?`): `ResponsePromise`<`AdminListInvitesRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminListInvitesRes`\>

#### Defined in

[admin/invites.ts:34](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/invites.ts#L34)

___

### resend

▸ **resend**(`id`, `customHeaders?`): `ResponsePromise`

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`

#### Defined in

[admin/invites.ts:41](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/invites.ts#L41)
