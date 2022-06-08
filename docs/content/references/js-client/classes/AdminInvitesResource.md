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
| `payload` | [`AdminPostInvitesInviteAcceptReq`](internal.AdminPostInvitesInviteAcceptReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<`any`\>

#### Defined in

[packages/medusa-js/src/resources/admin/invites.ts:10](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/invites.ts#L10)

___

### create

▸ **create**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`AdminPostInvitesPayload`](../modules/internal.md#adminpostinvitespayload) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<`any`\>

#### Defined in

[packages/medusa-js/src/resources/admin/invites.ts:15](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/invites.ts#L15)

___

### delete

▸ **delete**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`DeleteResponse`](../modules/internal.md#deleteresponse)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`DeleteResponse`](../modules/internal.md#deleteresponse)\>

#### Defined in

[packages/medusa-js/src/resources/admin/invites.ts:20](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/invites.ts#L20)

___

### list

▸ **list**(`customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminListInvitesRes`](../modules/internal.md#adminlistinvitesres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminListInvitesRes`](../modules/internal.md#adminlistinvitesres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/invites.ts:25](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/invites.ts#L25)

___

### resend

▸ **resend**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<`any`\>

#### Defined in

[packages/medusa-js/src/resources/admin/invites.ts:30](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/invites.ts#L30)
