---
displayed_sidebar: jsClientSidebar
---

# Class: AdminNotesResource

## Hierarchy

- `default`

  ↳ **`AdminNotesResource`**

## Methods

### create

▸ **create**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminNotesRes`](../modules/internal-8.internal.md#adminnotesres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`AdminPostNotesReq`](internal-8.internal.AdminPostNotesReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminNotesRes`](../modules/internal-8.internal.md#adminnotesres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/notes.ts:14](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/notes.ts#L14)

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

[packages/medusa-js/src/resources/admin/notes.ts:31](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/notes.ts#L31)

___

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminNotesListRes`](../modules/internal-8.internal.md#adminnoteslistres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | [`AdminGetNotesParams`](internal-8.internal.AdminGetNotesParams.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminNotesListRes`](../modules/internal-8.internal.md#adminnoteslistres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/notes.ts:47](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/notes.ts#L47)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminNotesRes`](../modules/internal-8.internal.md#adminnotesres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminNotesRes`](../modules/internal-8.internal.md#adminnotesres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/notes.ts:39](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/notes.ts#L39)

___

### update

▸ **update**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminNotesRes`](../modules/internal-8.internal.md#adminnotesres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostNotesNoteReq`](internal-8.internal.AdminPostNotesNoteReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminNotesRes`](../modules/internal-8.internal.md#adminnotesres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/notes.ts:22](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/notes.ts#L22)
