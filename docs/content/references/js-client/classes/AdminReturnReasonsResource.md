# Class: AdminReturnReasonsResource

## Hierarchy

- `default`

  ↳ **`AdminReturnReasonsResource`**

## Methods

### create

▸ **create**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminReturnReasonsRes`](../modules/internal-23.md#adminreturnreasonsres)\>

**`Description`**

Creates a return reason.

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`AdminPostReturnReasonsReq`](internal-23.AdminPostReturnReasonsReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminReturnReasonsRes`](../modules/internal-23.md#adminreturnreasonsres)\>

Created return reason.

#### Defined in

[medusa-js/src/resources/admin/return-reasons.ts:18](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/return-reasons.ts#L18)

___

### delete

▸ **delete**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`DeleteResponse`](../modules/internal-3.md#deleteresponse)\>

**`Description`**

deletes a return reason

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of return reason to delete. |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`DeleteResponse`](../modules/internal-3.md#deleteresponse)\>

Deleted response

#### Defined in

[medusa-js/src/resources/admin/return-reasons.ts:48](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/return-reasons.ts#L48)

___

### list

▸ **list**(`customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminReturnReasonsListRes`](../modules/internal-23.md#adminreturnreasonslistres)\>

**`Description`**

Lists return reasons matching a query

#### Parameters

| Name | Type |
| :------ | :------ |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminReturnReasonsListRes`](../modules/internal-23.md#adminreturnreasonslistres)\>

a list of return reasons matching the query.

#### Defined in

[medusa-js/src/resources/admin/return-reasons.ts:75](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/return-reasons.ts#L75)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminReturnReasonsRes`](../modules/internal-23.md#adminreturnreasonsres)\>

**`Description`**

retrieves a return reason

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the return reason to retrieve. |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminReturnReasonsRes`](../modules/internal-23.md#adminreturnreasonsres)\>

the return reason with the given id

#### Defined in

[medusa-js/src/resources/admin/return-reasons.ts:62](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/return-reasons.ts#L62)

___

### update

▸ **update**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminReturnReasonsRes`](../modules/internal-23.md#adminreturnreasonsres)\>

**`Description`**

Updates a return reason

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the return reason to update. |
| `payload` | [`AdminPostReturnReasonsReasonReq`](internal-23.AdminPostReturnReasonsReasonReq.md) | update to apply to return reason. |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminReturnReasonsRes`](../modules/internal-23.md#adminreturnreasonsres)\>

the updated return reason.

#### Defined in

[medusa-js/src/resources/admin/return-reasons.ts:33](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/return-reasons.ts#L33)
