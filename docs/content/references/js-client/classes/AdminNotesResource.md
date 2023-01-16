# Class: AdminNotesResource

## Hierarchy

- `default`

  ↳ **`AdminNotesResource`**

## Methods

### create

▸ **create**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminNotesRes`](../modules/internal-11.md#adminnotesres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`AdminPostNotesReq`](internal-11.AdminPostNotesReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminNotesRes`](../modules/internal-11.md#adminnotesres)\>

#### Defined in

[medusa-js/src/resources/admin/notes.ts:14](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/notes.ts#L14)

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

[medusa-js/src/resources/admin/notes.ts:31](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/notes.ts#L31)

___

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminNotesListRes`](../modules/internal-11.md#adminnoteslistres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | [`AdminGetNotesParams`](internal-11.AdminGetNotesParams.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminNotesListRes`](../modules/internal-11.md#adminnoteslistres)\>

#### Defined in

[medusa-js/src/resources/admin/notes.ts:47](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/notes.ts#L47)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminNotesRes`](../modules/internal-11.md#adminnotesres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminNotesRes`](../modules/internal-11.md#adminnotesres)\>

#### Defined in

[medusa-js/src/resources/admin/notes.ts:39](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/notes.ts#L39)

___

### update

▸ **update**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminNotesRes`](../modules/internal-11.md#adminnotesres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostNotesNoteReq`](internal-11.AdminPostNotesNoteReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminNotesRes`](../modules/internal-11.md#adminnotesres)\>

#### Defined in

[medusa-js/src/resources/admin/notes.ts:22](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/notes.ts#L22)
