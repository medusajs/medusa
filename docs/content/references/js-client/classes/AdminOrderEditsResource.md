# Class: AdminOrderEditsResource

## Hierarchy

- `default`

  ↳ **`AdminOrderEditsResource`**

## Methods

### addLineItem

▸ **addLineItem**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrderEditsRes`](../modules/internal-13.md#adminordereditsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostOrderEditsEditLineItemsReq`](internal-13.AdminPostOrderEditsEditLineItemsReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrderEditsRes`](../modules/internal-13.md#adminordereditsres)\>

#### Defined in

[medusa-js/src/resources/admin/order-edits.ts:72](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/order-edits.ts#L72)

___

### cancel

▸ **cancel**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrderEditsRes`](../modules/internal-13.md#adminordereditsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrderEditsRes`](../modules/internal-13.md#adminordereditsres)\>

#### Defined in

[medusa-js/src/resources/admin/order-edits.ts:98](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/order-edits.ts#L98)

___

### confirm

▸ **confirm**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrderEditsRes`](../modules/internal-13.md#adminordereditsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrderEditsRes`](../modules/internal-13.md#adminordereditsres)\>

#### Defined in

[medusa-js/src/resources/admin/order-edits.ts:106](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/order-edits.ts#L106)

___

### create

▸ **create**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrderEditsRes`](../modules/internal-13.md#adminordereditsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`AdminPostOrderEditsReq`](internal-13.AdminPostOrderEditsReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrderEditsRes`](../modules/internal-13.md#adminordereditsres)\>

#### Defined in

[medusa-js/src/resources/admin/order-edits.ts:47](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/order-edits.ts#L47)

___

### delete

▸ **delete**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`DeleteResponse`](../modules/internal-3.md#deleteresponse)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`DeleteResponse`](../modules/internal-3.md#deleteresponse)\>

#### Defined in

[medusa-js/src/resources/admin/order-edits.ts:64](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/order-edits.ts#L64)

___

### deleteItemChange

▸ **deleteItemChange**(`orderEditId`, `itemChangeId`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrderEditItemChangeDeleteRes`](../modules/internal-13.md#adminorderedititemchangedeleteres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `orderEditId` | `string` |
| `itemChangeId` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrderEditItemChangeDeleteRes`](../modules/internal-13.md#adminorderedititemchangedeleteres)\>

#### Defined in

[medusa-js/src/resources/admin/order-edits.ts:81](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/order-edits.ts#L81)

___

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrderEditsListRes`](../modules/internal-13.md#adminordereditslistres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | [`GetOrderEditsParams`](internal-13.GetOrderEditsParams.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrderEditsListRes`](../modules/internal-13.md#adminordereditslistres)\>

#### Defined in

[medusa-js/src/resources/admin/order-edits.ts:33](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/order-edits.ts#L33)

___

### removeLineItem

▸ **removeLineItem**(`orderEditId`, `itemId`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrderEditsRes`](../modules/internal-13.md#adminordereditsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `orderEditId` | `string` |
| `itemId` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrderEditsRes`](../modules/internal-13.md#adminordereditsres)\>

#### Defined in

[medusa-js/src/resources/admin/order-edits.ts:124](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/order-edits.ts#L124)

___

### requestConfirmation

▸ **requestConfirmation**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrderEditsRes`](../modules/internal-13.md#adminordereditsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrderEditsRes`](../modules/internal-13.md#adminordereditsres)\>

#### Defined in

[medusa-js/src/resources/admin/order-edits.ts:90](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/order-edits.ts#L90)

___

### retrieve

▸ **retrieve**(`id`, `query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrderEditsRes`](../modules/internal-13.md#adminordereditsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `query?` | [`GetOrderEditsOrderEditParams`](internal-13.GetOrderEditsOrderEditParams.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrderEditsRes`](../modules/internal-13.md#adminordereditsres)\>

#### Defined in

[medusa-js/src/resources/admin/order-edits.ts:18](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/order-edits.ts#L18)

___

### update

▸ **update**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrderEditsRes`](../modules/internal-13.md#adminordereditsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostOrderEditsOrderEditReq`](internal-13.AdminPostOrderEditsOrderEditReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrderEditsRes`](../modules/internal-13.md#adminordereditsres)\>

#### Defined in

[medusa-js/src/resources/admin/order-edits.ts:55](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/order-edits.ts#L55)

___

### updateLineItem

▸ **updateLineItem**(`orderEditId`, `itemId`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrderEditsRes`](../modules/internal-13.md#adminordereditsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `orderEditId` | `string` |
| `itemId` | `string` |
| `payload` | [`AdminPostOrderEditsEditLineItemsLineItemReq`](internal-13.AdminPostOrderEditsEditLineItemsLineItemReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrderEditsRes`](../modules/internal-13.md#adminordereditsres)\>

#### Defined in

[medusa-js/src/resources/admin/order-edits.ts:114](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/order-edits.ts#L114)
