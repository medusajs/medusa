---
displayed_sidebar: jsClientSidebar
---

# Class: AdminReturnReasonsResource

## Hierarchy

- `default`

  ↳ **`AdminReturnReasonsResource`**

## Methods

### create

▸ **create**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminReturnReasonsRes`](../modules/internal-8.internal.md#adminreturnreasonsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`AdminPostReturnReasonsReq`](internal-8.internal.AdminPostReturnReasonsReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminReturnReasonsRes`](../modules/internal-8.internal.md#adminreturnreasonsres)\>

Created return reason.

**`Description`**

Creates a return reason.

#### Defined in

[packages/medusa-js/src/resources/admin/return-reasons.ts:18](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/return-reasons.ts#L18)

___

### delete

▸ **delete**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`DeleteResponse`](../modules/internal-8.internal.md#deleteresponse)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of return reason to delete. |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`DeleteResponse`](../modules/internal-8.internal.md#deleteresponse)\>

Deleted response

**`Description`**

deletes a return reason

#### Defined in

[packages/medusa-js/src/resources/admin/return-reasons.ts:48](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/return-reasons.ts#L48)

___

### list

▸ **list**(`customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminReturnReasonsListRes`](../modules/internal-8.internal.md#adminreturnreasonslistres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminReturnReasonsListRes`](../modules/internal-8.internal.md#adminreturnreasonslistres)\>

a list of return reasons matching the query.

**`Description`**

Lists return reasons matching a query

#### Defined in

[packages/medusa-js/src/resources/admin/return-reasons.ts:75](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/return-reasons.ts#L75)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminReturnReasonsRes`](../modules/internal-8.internal.md#adminreturnreasonsres)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the return reason to retrieve. |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminReturnReasonsRes`](../modules/internal-8.internal.md#adminreturnreasonsres)\>

the return reason with the given id

**`Description`**

retrieves a return reason

#### Defined in

[packages/medusa-js/src/resources/admin/return-reasons.ts:62](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/return-reasons.ts#L62)

___

### update

▸ **update**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminReturnReasonsRes`](../modules/internal-8.internal.md#adminreturnreasonsres)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the return reason to update. |
| `payload` | [`AdminPostReturnReasonsReasonReq`](internal-8.internal.AdminPostReturnReasonsReasonReq.md) | update to apply to return reason. |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminReturnReasonsRes`](../modules/internal-8.internal.md#adminreturnreasonsres)\>

the updated return reason.

**`Description`**

Updates a return reason

#### Defined in

[packages/medusa-js/src/resources/admin/return-reasons.ts:33](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/return-reasons.ts#L33)
