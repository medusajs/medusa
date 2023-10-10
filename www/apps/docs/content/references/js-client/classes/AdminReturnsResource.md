---
displayed_sidebar: jsClientSidebar
---

# Class: AdminReturnsResource

## Hierarchy

- `default`

  ↳ **`AdminReturnsResource`**

## Methods

### cancel

▸ **cancel**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminReturnsCancelRes`](../modules/internal-8.internal.md#adminreturnscancelres)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of return to cancel |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminReturnsCancelRes`](../modules/internal-8.internal.md#adminreturnscancelres)\>

the order for which the return was canceled

**`Description`**

cancels a return

#### Defined in

[packages/medusa-js/src/resources/admin/returns.ts:19](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/returns.ts#L19)

___

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminReturnsListRes`](../modules/internal-8.internal.md#adminreturnslistres)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `query?` | [`AdminGetReturnsParams`](internal-8.internal.AdminGetReturnsParams.md) | query for searching returns |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminReturnsListRes`](../modules/internal-8.internal.md#adminreturnslistres)\>

a list of returns matching the query

**`Description`**

lists returns matching a query

#### Defined in

[packages/medusa-js/src/resources/admin/returns.ts:49](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/returns.ts#L49)

___

### receive

▸ **receive**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminReturnsRes`](../modules/internal-8.internal.md#adminreturnsres)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the return to receive. |
| `payload` | [`AdminPostReturnsReturnReceiveReq`](internal-8.internal.AdminPostReturnsReturnReceiveReq.md) | items to receive and an optional refund amount |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminReturnsRes`](../modules/internal-8.internal.md#adminreturnsres)\>

the return

**`Description`**

receive a return

#### Defined in

[packages/medusa-js/src/resources/admin/returns.ts:34](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/returns.ts#L34)
