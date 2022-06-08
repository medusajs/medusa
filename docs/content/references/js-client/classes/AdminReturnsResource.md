# Class: AdminReturnsResource

## Hierarchy

- `default`

  ↳ **`AdminReturnsResource`**

## Methods

### cancel

▸ **cancel**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminReturnsCancelRes`](../modules/internal.md#adminreturnscancelres)\>

**`description`** cancels a return

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of return to cancel |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminReturnsCancelRes`](../modules/internal.md#adminreturnscancelres)\>

the order for which the return was canceled

#### Defined in

[packages/medusa-js/src/resources/admin/returns.ts:19](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/returns.ts#L19)

___

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminReturnsListRes`](../modules/internal.md#adminreturnslistres)\>

**`description`** lists returns matching a query

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `query?` | [`AdminGetReturnsParams`](internal.AdminGetReturnsParams.md) | query for searching returns |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminReturnsListRes`](../modules/internal.md#adminreturnslistres)\>

a list of returns matching the query

#### Defined in

[packages/medusa-js/src/resources/admin/returns.ts:46](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/returns.ts#L46)

___

### receive

▸ **receive**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminReturnsRes`](../modules/internal.md#adminreturnsres)\>

**`description`** receive a return

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the return to receive. |
| `payload` | [`AdminPostReturnsReturnReceiveReq`](internal.AdminPostReturnsReturnReceiveReq.md) | items to receive and an optional refund amount |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminReturnsRes`](../modules/internal.md#adminreturnsres)\>

the return

#### Defined in

[packages/medusa-js/src/resources/admin/returns.ts:31](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/returns.ts#L31)
