---
displayed_sidebar: jsClientSidebar
---

# Class: AdminInvitesResource

## Hierarchy

- `default`

  ↳ **`AdminInvitesResource`**

## Methods

### accept

▸ **accept**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`AdminPostInvitesInviteAcceptReq`](internal-8.internal.AdminPostInvitesInviteAcceptReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)

#### Defined in

[packages/medusa-js/src/resources/admin/invites.ts:10](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/invites.ts#L10)

___

### create

▸ **create**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`AdminPostInvitesPayload`](../modules/internal-9.md#adminpostinvitespayload) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)

#### Defined in

[packages/medusa-js/src/resources/admin/invites.ts:18](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/invites.ts#L18)

___

### delete

▸ **delete**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`DeleteResponse`](../modules/internal-8.internal.md#deleteresponse)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`DeleteResponse`](../modules/internal-8.internal.md#deleteresponse)\>

#### Defined in

[packages/medusa-js/src/resources/admin/invites.ts:26](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/invites.ts#L26)

___

### list

▸ **list**(`customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminListInvitesRes`](../modules/internal-8.internal.md#adminlistinvitesres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminListInvitesRes`](../modules/internal-8.internal.md#adminlistinvitesres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/invites.ts:34](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/invites.ts#L34)

___

### resend

▸ **resend**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)

#### Defined in

[packages/medusa-js/src/resources/admin/invites.ts:41](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/invites.ts#L41)
