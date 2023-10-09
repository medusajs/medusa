# Class: AdminReturnReasonsResource

## Hierarchy

- `default`

  ↳ **`AdminReturnReasonsResource`**

## Methods

### create

▸ **create**(`payload`, `customHeaders?`): `ResponsePromise`<`AdminReturnReasonsRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | `AdminPostReturnReasonsReq` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminReturnReasonsRes`\>

Created return reason.

**`Description`**

Creates a return reason.

#### Defined in

[admin/return-reasons.ts:18](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/return-reasons.ts#L18)

___

### delete

▸ **delete**(`id`, `customHeaders?`): `ResponsePromise`<`DeleteResponse`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of return reason to delete. |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`DeleteResponse`\>

Deleted response

**`Description`**

deletes a return reason

#### Defined in

[admin/return-reasons.ts:48](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/return-reasons.ts#L48)

___

### list

▸ **list**(`customHeaders?`): `ResponsePromise`<`AdminReturnReasonsListRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminReturnReasonsListRes`\>

a list of return reasons matching the query.

**`Description`**

Lists return reasons matching a query

#### Defined in

[admin/return-reasons.ts:75](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/return-reasons.ts#L75)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): `ResponsePromise`<`AdminReturnReasonsRes`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the return reason to retrieve. |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`AdminReturnReasonsRes`\>

the return reason with the given id

**`Description`**

retrieves a return reason

#### Defined in

[admin/return-reasons.ts:62](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/return-reasons.ts#L62)

___

### update

▸ **update**(`id`, `payload`, `customHeaders?`): `ResponsePromise`<`AdminReturnReasonsRes`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the return reason to update. |
| `payload` | `AdminPostReturnReasonsReasonReq` | update to apply to return reason. |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`AdminReturnReasonsRes`\>

the updated return reason.

**`Description`**

Updates a return reason

#### Defined in

[admin/return-reasons.ts:33](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/return-reasons.ts#L33)
