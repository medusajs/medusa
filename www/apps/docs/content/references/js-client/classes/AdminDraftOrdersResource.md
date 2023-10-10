---
displayed_sidebar: jsClientSidebar
---

# Class: AdminDraftOrdersResource

## Hierarchy

- `default`

  ↳ **`AdminDraftOrdersResource`**

## Methods

### addLineItem

▸ **addLineItem**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminDraftOrdersRes`](../modules/internal-8.internal.md#admindraftordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostDraftOrdersDraftOrderLineItemsReq`](internal-8.internal.AdminPostDraftOrdersDraftOrderLineItemsReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminDraftOrdersRes`](../modules/internal-8.internal.md#admindraftordersres)\>

**`Description`**

Add line item to draft order

#### Defined in

[packages/medusa-js/src/resources/admin/draft-orders.ts:30](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/draft-orders.ts#L30)

___

### create

▸ **create**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminDraftOrdersRes`](../modules/internal-8.internal.md#admindraftordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`AdminPostDraftOrdersReq`](internal-8.internal.AdminPostDraftOrdersReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminDraftOrdersRes`](../modules/internal-8.internal.md#admindraftordersres)\>

**`Description`**

Creates a draft order

#### Defined in

[packages/medusa-js/src/resources/admin/draft-orders.ts:20](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/draft-orders.ts#L20)

___

### delete

▸ **delete**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`DeleteResponse`](../modules/internal-8.internal.md#deleteresponse)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`DeleteResponse`](../modules/internal-8.internal.md#deleteresponse)\>

**`Description`**

Delete draft order

#### Defined in

[packages/medusa-js/src/resources/admin/draft-orders.ts:42](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/draft-orders.ts#L42)

___

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminDraftOrdersListRes`](../modules/internal-8.internal.md#admindraftorderslistres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | [`AdminGetDraftOrdersParams`](internal-8.internal.AdminGetDraftOrdersParams.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminDraftOrdersListRes`](../modules/internal-8.internal.md#admindraftorderslistres)\>

**`Description`**

Lists draft orders

#### Defined in

[packages/medusa-js/src/resources/admin/draft-orders.ts:76](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/draft-orders.ts#L76)

___

### markPaid

▸ **markPaid**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminPostDraftOrdersDraftOrderRegisterPaymentRes`](../modules/internal-8.internal.md#adminpostdraftordersdraftorderregisterpaymentres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminPostDraftOrdersDraftOrderRegisterPaymentRes`](../modules/internal-8.internal.md#adminpostdraftordersdraftorderregisterpaymentres)\>

**`Description`**

Mark a draft order as paid

#### Defined in

[packages/medusa-js/src/resources/admin/draft-orders.ts:93](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/draft-orders.ts#L93)

___

### removeLineItem

▸ **removeLineItem**(`id`, `itemId`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminDraftOrdersRes`](../modules/internal-8.internal.md#admindraftordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `itemId` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminDraftOrdersRes`](../modules/internal-8.internal.md#admindraftordersres)\>

**`Description`**

Remove line item

#### Defined in

[packages/medusa-js/src/resources/admin/draft-orders.ts:53](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/draft-orders.ts#L53)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminDraftOrdersRes`](../modules/internal-8.internal.md#admindraftordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminDraftOrdersRes`](../modules/internal-8.internal.md#admindraftordersres)\>

**`Description`**

Retrieves a draft order

#### Defined in

[packages/medusa-js/src/resources/admin/draft-orders.ts:65](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/draft-orders.ts#L65)

___

### update

▸ **update**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminDraftOrdersRes`](../modules/internal-8.internal.md#admindraftordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostDraftOrdersDraftOrderReq`](internal-8.internal.AdminPostDraftOrdersDraftOrderReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminDraftOrdersRes`](../modules/internal-8.internal.md#admindraftordersres)\>

**`Description`**

Update draft order

#### Defined in

[packages/medusa-js/src/resources/admin/draft-orders.ts:104](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/draft-orders.ts#L104)

___

### updateLineItem

▸ **updateLineItem**(`id`, `itemId`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminDraftOrdersRes`](../modules/internal-8.internal.md#admindraftordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `itemId` | `string` |
| `payload` | [`AdminPostDraftOrdersDraftOrderLineItemsItemReq`](internal-8.internal.AdminPostDraftOrdersDraftOrderLineItemsItemReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminDraftOrdersRes`](../modules/internal-8.internal.md#admindraftordersres)\>

**`Description`**

Update draft order line item

#### Defined in

[packages/medusa-js/src/resources/admin/draft-orders.ts:116](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/draft-orders.ts#L116)
