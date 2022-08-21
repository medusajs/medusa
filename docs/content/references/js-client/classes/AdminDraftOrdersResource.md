# Class: AdminDraftOrdersResource

## Hierarchy

- `default`

  ↳ **`AdminDraftOrdersResource`**

## Methods

### addLineItem

▸ **addLineItem**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDraftOrdersRes`](../modules/internal-7.md#admindraftordersres)\>

**`Description`**

Add line item to draft order

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostDraftOrdersDraftOrderLineItemsReq`](internal-7.AdminPostDraftOrdersDraftOrderLineItemsReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDraftOrdersRes`](../modules/internal-7.md#admindraftordersres)\>

#### Defined in

[medusa-js/src/resources/admin/draft-orders.ts:30](https://github.com/medusajs/medusa/blob/e38dd7f6/packages/medusa-js/src/resources/admin/draft-orders.ts#L30)

___

### create

▸ **create**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDraftOrdersRes`](../modules/internal-7.md#admindraftordersres)\>

**`Description`**

Creates a draft order

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`AdminPostDraftOrdersDraftOrderReq`](internal-7.AdminPostDraftOrdersDraftOrderReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDraftOrdersRes`](../modules/internal-7.md#admindraftordersres)\>

#### Defined in

[medusa-js/src/resources/admin/draft-orders.ts:19](https://github.com/medusajs/medusa/blob/e38dd7f6/packages/medusa-js/src/resources/admin/draft-orders.ts#L19)

___

### delete

▸ **delete**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`DeleteResponse`](../modules/internal-3.md#deleteresponse)\>

**`Description`**

Delete draft order

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`DeleteResponse`](../modules/internal-3.md#deleteresponse)\>

#### Defined in

[medusa-js/src/resources/admin/draft-orders.ts:42](https://github.com/medusajs/medusa/blob/e38dd7f6/packages/medusa-js/src/resources/admin/draft-orders.ts#L42)

___

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDraftOrdersListRes`](../modules/internal-7.md#admindraftorderslistres)\>

**`Description`**

Lists draft orders

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | [`AdminGetDraftOrdersParams`](internal-7.AdminGetDraftOrdersParams.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDraftOrdersListRes`](../modules/internal-7.md#admindraftorderslistres)\>

#### Defined in

[medusa-js/src/resources/admin/draft-orders.ts:76](https://github.com/medusajs/medusa/blob/e38dd7f6/packages/medusa-js/src/resources/admin/draft-orders.ts#L76)

___

### markPaid

▸ **markPaid**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminPostDraftOrdersDraftOrderRegisterPaymentRes`](../modules/internal-7.md#adminpostdraftordersdraftorderregisterpaymentres)\>

**`Description`**

Mark a draft order as paid

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminPostDraftOrdersDraftOrderRegisterPaymentRes`](../modules/internal-7.md#adminpostdraftordersdraftorderregisterpaymentres)\>

#### Defined in

[medusa-js/src/resources/admin/draft-orders.ts:93](https://github.com/medusajs/medusa/blob/e38dd7f6/packages/medusa-js/src/resources/admin/draft-orders.ts#L93)

___

### removeLineItem

▸ **removeLineItem**(`id`, `itemId`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDraftOrdersRes`](../modules/internal-7.md#admindraftordersres)\>

**`Description`**

Remove line item

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `itemId` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDraftOrdersRes`](../modules/internal-7.md#admindraftordersres)\>

#### Defined in

[medusa-js/src/resources/admin/draft-orders.ts:53](https://github.com/medusajs/medusa/blob/e38dd7f6/packages/medusa-js/src/resources/admin/draft-orders.ts#L53)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDraftOrdersRes`](../modules/internal-7.md#admindraftordersres)\>

**`Description`**

Retrieves a draft order

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDraftOrdersRes`](../modules/internal-7.md#admindraftordersres)\>

#### Defined in

[medusa-js/src/resources/admin/draft-orders.ts:65](https://github.com/medusajs/medusa/blob/e38dd7f6/packages/medusa-js/src/resources/admin/draft-orders.ts#L65)

___

### update

▸ **update**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDraftOrdersRes`](../modules/internal-7.md#admindraftordersres)\>

**`Description`**

Update draft order

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostDraftOrdersDraftOrderReq`](internal-7.AdminPostDraftOrdersDraftOrderReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDraftOrdersRes`](../modules/internal-7.md#admindraftordersres)\>

#### Defined in

[medusa-js/src/resources/admin/draft-orders.ts:104](https://github.com/medusajs/medusa/blob/e38dd7f6/packages/medusa-js/src/resources/admin/draft-orders.ts#L104)

___

### updateLineItem

▸ **updateLineItem**(`id`, `itemId`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDraftOrdersRes`](../modules/internal-7.md#admindraftordersres)\>

**`Description`**

Update draft order line item

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `itemId` | `string` |
| `payload` | [`AdminPostDraftOrdersDraftOrderLineItemsItemReq`](internal-7.AdminPostDraftOrdersDraftOrderLineItemsItemReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDraftOrdersRes`](../modules/internal-7.md#admindraftordersres)\>

#### Defined in

[medusa-js/src/resources/admin/draft-orders.ts:116](https://github.com/medusajs/medusa/blob/e38dd7f6/packages/medusa-js/src/resources/admin/draft-orders.ts#L116)
