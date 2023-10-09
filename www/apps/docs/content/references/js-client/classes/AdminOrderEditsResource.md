# Class: AdminOrderEditsResource

## Hierarchy

- `default`

  ↳ **`AdminOrderEditsResource`**

## Methods

### addLineItem

▸ **addLineItem**(`id`, `payload`, `customHeaders?`): `ResponsePromise`<`AdminOrderEditsRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | `AdminPostOrderEditsEditLineItemsReq` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminOrderEditsRes`\>

#### Defined in

[admin/order-edits.ts:72](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/order-edits.ts#L72)

___

### cancel

▸ **cancel**(`id`, `customHeaders?`): `ResponsePromise`<`AdminOrderEditsRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminOrderEditsRes`\>

#### Defined in

[admin/order-edits.ts:98](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/order-edits.ts#L98)

___

### confirm

▸ **confirm**(`id`, `customHeaders?`): `ResponsePromise`<`AdminOrderEditsRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminOrderEditsRes`\>

#### Defined in

[admin/order-edits.ts:106](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/order-edits.ts#L106)

___

### create

▸ **create**(`payload`, `customHeaders?`): `ResponsePromise`<`AdminOrderEditsRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | `AdminPostOrderEditsReq` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminOrderEditsRes`\>

#### Defined in

[admin/order-edits.ts:47](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/order-edits.ts#L47)

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

[admin/order-edits.ts:64](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/order-edits.ts#L64)

___

### deleteItemChange

▸ **deleteItemChange**(`orderEditId`, `itemChangeId`, `customHeaders?`): `ResponsePromise`<`AdminOrderEditItemChangeDeleteRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `orderEditId` | `string` |
| `itemChangeId` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminOrderEditItemChangeDeleteRes`\>

#### Defined in

[admin/order-edits.ts:81](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/order-edits.ts#L81)

___

### list

▸ **list**(`query?`, `customHeaders?`): `ResponsePromise`<`AdminOrderEditsListRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | `GetOrderEditsParams` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminOrderEditsListRes`\>

#### Defined in

[admin/order-edits.ts:33](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/order-edits.ts#L33)

___

### removeLineItem

▸ **removeLineItem**(`orderEditId`, `itemId`, `customHeaders?`): `ResponsePromise`<`AdminOrderEditsRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `orderEditId` | `string` |
| `itemId` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminOrderEditsRes`\>

#### Defined in

[admin/order-edits.ts:124](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/order-edits.ts#L124)

___

### requestConfirmation

▸ **requestConfirmation**(`id`, `customHeaders?`): `ResponsePromise`<`AdminOrderEditsRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminOrderEditsRes`\>

#### Defined in

[admin/order-edits.ts:90](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/order-edits.ts#L90)

___

### retrieve

▸ **retrieve**(`id`, `query?`, `customHeaders?`): `ResponsePromise`<`AdminOrderEditsRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `query?` | `GetOrderEditsOrderEditParams` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminOrderEditsRes`\>

#### Defined in

[admin/order-edits.ts:18](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/order-edits.ts#L18)

___

### update

▸ **update**(`id`, `payload`, `customHeaders?`): `ResponsePromise`<`AdminOrderEditsRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | `AdminPostOrderEditsOrderEditReq` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminOrderEditsRes`\>

#### Defined in

[admin/order-edits.ts:55](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/order-edits.ts#L55)

___

### updateLineItem

▸ **updateLineItem**(`orderEditId`, `itemId`, `payload`, `customHeaders?`): `ResponsePromise`<`AdminOrderEditsRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `orderEditId` | `string` |
| `itemId` | `string` |
| `payload` | `AdminPostOrderEditsEditLineItemsLineItemReq` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminOrderEditsRes`\>

#### Defined in

[admin/order-edits.ts:114](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/order-edits.ts#L114)
