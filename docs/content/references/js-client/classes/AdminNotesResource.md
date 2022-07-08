# Class: AdminNotesResource

## Hierarchy

- `default`

  ↳ **`AdminNotesResource`**

## Methods

### create

▸ **create**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminNotesRes`](../modules/internal.md#adminnotesres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`AdminPostNotesReq`](internal.AdminPostNotesReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminNotesRes`](../modules/internal.md#adminnotesres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/notes.ts:14](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/notes.ts#L14)

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

[packages/medusa-js/src/resources/admin/notes.ts:27](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/notes.ts#L27)

___

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminNotesListRes`](../modules/internal.md#adminnoteslistres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | [`AdminGetNotesParams`](internal.AdminGetNotesParams.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminNotesListRes`](../modules/internal.md#adminnoteslistres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/notes.ts:37](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/notes.ts#L37)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminNotesRes`](../modules/internal.md#adminnotesres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminNotesRes`](../modules/internal.md#adminnotesres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/notes.ts:32](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/notes.ts#L32)

___

### update

▸ **update**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminNotesRes`](../modules/internal.md#adminnotesres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostNotesNoteReq`](internal.AdminPostNotesNoteReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminNotesRes`](../modules/internal.md#adminnotesres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/notes.ts:19](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/notes.ts#L19)
