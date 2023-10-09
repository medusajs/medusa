# Class: AdminNotesResource

## Hierarchy

- `default`

  ↳ **`AdminNotesResource`**

## Methods

### create

▸ **create**(`payload`, `customHeaders?`): `ResponsePromise`<`AdminNotesRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | `AdminPostNotesReq` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminNotesRes`\>

#### Defined in

[admin/notes.ts:14](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/notes.ts#L14)

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

[admin/notes.ts:31](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/notes.ts#L31)

___

### list

▸ **list**(`query?`, `customHeaders?`): `ResponsePromise`<`AdminNotesListRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | `AdminGetNotesParams` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminNotesListRes`\>

#### Defined in

[admin/notes.ts:47](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/notes.ts#L47)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): `ResponsePromise`<`AdminNotesRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminNotesRes`\>

#### Defined in

[admin/notes.ts:39](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/notes.ts#L39)

___

### update

▸ **update**(`id`, `payload`, `customHeaders?`): `ResponsePromise`<`AdminNotesRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | `AdminPostNotesNoteReq` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminNotesRes`\>

#### Defined in

[admin/notes.ts:22](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/notes.ts#L22)
