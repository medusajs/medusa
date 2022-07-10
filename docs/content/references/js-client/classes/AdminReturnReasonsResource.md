# Class: AdminReturnReasonsResource

## Hierarchy

- `default`

  ↳ **`AdminReturnReasonsResource`**

## Methods

### create

▸ **create**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminReturnReasonsRes`](../modules/internal.md#adminreturnreasonsres)\>

**`description`** Creates a return reason.

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`AdminPostReturnReasonsReq`](internal.AdminPostReturnReasonsReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminReturnReasonsRes`](../modules/internal.md#adminreturnreasonsres)\>

Created return reason.

#### Defined in

[packages/medusa-js/src/resources/admin/return-reasons.ts:18](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/return-reasons.ts#L18)

___

### delete

▸ **delete**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`DeleteResponse`](../modules/internal.md#deleteresponse)\>

**`description`** deletes a return reason

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of return reason to delete. |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`DeleteResponse`](../modules/internal.md#deleteresponse)\>

Deleted response

#### Defined in

[packages/medusa-js/src/resources/admin/return-reasons.ts:48](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/return-reasons.ts#L48)

___

### list

▸ **list**(`customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminReturnReasonsListRes`](../modules/internal.md#adminreturnreasonslistres)\>

**`description`** Lists return reasons matching a query

#### Parameters

| Name | Type |
| :------ | :------ |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminReturnReasonsListRes`](../modules/internal.md#adminreturnreasonslistres)\>

a list of return reasons matching the query.

#### Defined in

[packages/medusa-js/src/resources/admin/return-reasons.ts:69](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/return-reasons.ts#L69)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminReturnReasonsRes`](../modules/internal.md#adminreturnreasonsres)\>

**`description`** retrieves a return reason

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the return reason to retrieve. |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminReturnReasonsRes`](../modules/internal.md#adminreturnreasonsres)\>

the return reason with the given id

#### Defined in

[packages/medusa-js/src/resources/admin/return-reasons.ts:59](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/return-reasons.ts#L59)

___

### update

▸ **update**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminReturnReasonsRes`](../modules/internal.md#adminreturnreasonsres)\>

**`description`** Updates a return reason

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the return reason to update. |
| `payload` | [`AdminPostReturnReasonsReasonReq`](internal.AdminPostReturnReasonsReasonReq.md) | update to apply to return reason. |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminReturnReasonsRes`](../modules/internal.md#adminreturnreasonsres)\>

the updated return reason.

#### Defined in

[packages/medusa-js/src/resources/admin/return-reasons.ts:33](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/return-reasons.ts#L33)
