# Class: AdminInvitesResource

## Hierarchy

- `default`

  ↳ **`AdminInvitesResource`**

## Methods

### accept

▸ **accept**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`AdminPostInvitesInviteAcceptReq`](internal-10.AdminPostInvitesInviteAcceptReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<`any`\>

#### Defined in

[medusa-js/src/resources/admin/invites.ts:10](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/invites.ts#L10)

___

### create

▸ **create**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`AdminPostInvitesPayload`](../modules/internal-10.md#adminpostinvitespayload) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<`any`\>

#### Defined in

[medusa-js/src/resources/admin/invites.ts:18](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/invites.ts#L18)

___

### delete

▸ **delete**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`DeleteResponse`](../modules/internal-3.md#deleteresponse)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`DeleteResponse`](../modules/internal-3.md#deleteresponse)\>

#### Defined in

[medusa-js/src/resources/admin/invites.ts:26](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/invites.ts#L26)

___

### list

▸ **list**(`customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminListInvitesRes`](../modules/internal-10.md#adminlistinvitesres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminListInvitesRes`](../modules/internal-10.md#adminlistinvitesres)\>

#### Defined in

[medusa-js/src/resources/admin/invites.ts:34](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/invites.ts#L34)

___

### resend

▸ **resend**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<`any`\>

#### Defined in

[medusa-js/src/resources/admin/invites.ts:41](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/invites.ts#L41)
