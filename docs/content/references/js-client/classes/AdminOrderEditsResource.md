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

[medusa-js/src/resources/admin/order-edits.ts:47](https://github.com/medusajs/medusa/blob/53e34d33d/packages/medusa-js/src/resources/admin/order-edits.ts#L47)

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

[medusa-js/src/resources/admin/order-edits.ts:73](https://github.com/medusajs/medusa/blob/53e34d33d/packages/medusa-js/src/resources/admin/order-edits.ts#L73)

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

[medusa-js/src/resources/admin/order-edits.ts:81](https://github.com/medusajs/medusa/blob/53e34d33d/packages/medusa-js/src/resources/admin/order-edits.ts#L81)

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

[medusa-js/src/resources/admin/order-edits.ts:22](https://github.com/medusajs/medusa/blob/53e34d33d/packages/medusa-js/src/resources/admin/order-edits.ts#L22)

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

[medusa-js/src/resources/admin/order-edits.ts:39](https://github.com/medusajs/medusa/blob/53e34d33d/packages/medusa-js/src/resources/admin/order-edits.ts#L39)

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

[medusa-js/src/resources/admin/order-edits.ts:56](https://github.com/medusajs/medusa/blob/53e34d33d/packages/medusa-js/src/resources/admin/order-edits.ts#L56)

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

[medusa-js/src/resources/admin/order-edits.ts:99](https://github.com/medusajs/medusa/blob/53e34d33d/packages/medusa-js/src/resources/admin/order-edits.ts#L99)

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

[medusa-js/src/resources/admin/order-edits.ts:65](https://github.com/medusajs/medusa/blob/53e34d33d/packages/medusa-js/src/resources/admin/order-edits.ts#L65)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrderEditsRes`](../modules/internal-13.md#adminordereditsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrderEditsRes`](../modules/internal-13.md#adminordereditsres)\>

#### Defined in

[medusa-js/src/resources/admin/order-edits.ts:14](https://github.com/medusajs/medusa/blob/53e34d33d/packages/medusa-js/src/resources/admin/order-edits.ts#L14)

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

[medusa-js/src/resources/admin/order-edits.ts:30](https://github.com/medusajs/medusa/blob/53e34d33d/packages/medusa-js/src/resources/admin/order-edits.ts#L30)

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

[medusa-js/src/resources/admin/order-edits.ts:89](https://github.com/medusajs/medusa/blob/53e34d33d/packages/medusa-js/src/resources/admin/order-edits.ts#L89)
