# Class: AdminReturnsResource

## Hierarchy

- `default`

  ↳ **`AdminReturnsResource`**

## Methods

### cancel

▸ **cancel**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminReturnsCancelRes`](../modules/internal-21.md#adminreturnscancelres)\>

**`Description`**

cancels a return

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of return to cancel |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminReturnsCancelRes`](../modules/internal-21.md#adminreturnscancelres)\>

the order for which the return was canceled

#### Defined in

[medusa-js/src/resources/admin/returns.ts:19](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa-js/src/resources/admin/returns.ts#L19)

___

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminReturnsListRes`](../modules/internal-21.md#adminreturnslistres)\>

**`Description`**

lists returns matching a query

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `query?` | [`AdminGetReturnsParams`](internal-21.AdminGetReturnsParams.md) | query for searching returns |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminReturnsListRes`](../modules/internal-21.md#adminreturnslistres)\>

a list of returns matching the query

#### Defined in

[medusa-js/src/resources/admin/returns.ts:49](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa-js/src/resources/admin/returns.ts#L49)

___

### receive

▸ **receive**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminReturnsRes`](../modules/internal-21.md#adminreturnsres)\>

**`Description`**

receive a return

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the return to receive. |
| `payload` | [`AdminPostReturnsReturnReceiveReq`](internal-21.AdminPostReturnsReturnReceiveReq.md) | items to receive and an optional refund amount |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminReturnsRes`](../modules/internal-21.md#adminreturnsres)\>

the return

#### Defined in

[medusa-js/src/resources/admin/returns.ts:34](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa-js/src/resources/admin/returns.ts#L34)
