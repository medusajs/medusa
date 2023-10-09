# Class: AdminReturnsResource

## Hierarchy

- `default`

  ↳ **`AdminReturnsResource`**

## Methods

### cancel

▸ **cancel**(`id`, `customHeaders?`): `ResponsePromise`<`AdminReturnsCancelRes`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of return to cancel |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`AdminReturnsCancelRes`\>

the order for which the return was canceled

**`Description`**

cancels a return

#### Defined in

[admin/returns.ts:19](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/returns.ts#L19)

___

### list

▸ **list**(`query?`, `customHeaders?`): `ResponsePromise`<`AdminReturnsListRes`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `query?` | `AdminGetReturnsParams` | query for searching returns |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`AdminReturnsListRes`\>

a list of returns matching the query

**`Description`**

lists returns matching a query

#### Defined in

[admin/returns.ts:49](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/returns.ts#L49)

___

### receive

▸ **receive**(`id`, `payload`, `customHeaders?`): `ResponsePromise`<`AdminReturnsRes`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the return to receive. |
| `payload` | `AdminPostReturnsReturnReceiveReq` | items to receive and an optional refund amount |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`AdminReturnsRes`\>

the return

**`Description`**

receive a return

#### Defined in

[admin/returns.ts:34](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/returns.ts#L34)
