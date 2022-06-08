# Class: AdminDraftOrdersResource

## Hierarchy

- `default`

  ↳ **`AdminDraftOrdersResource`**

## Methods

### addLineItem

▸ **addLineItem**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDraftOrdersRes`](../modules/internal.md#admindraftordersres)\>

**`description`** Add line item to draft order

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostDraftOrdersDraftOrderLineItemsReq`](internal.AdminPostDraftOrdersDraftOrderLineItemsReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDraftOrdersRes`](../modules/internal.md#admindraftordersres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/draft-orders.ts:29](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/draft-orders.ts#L29)

___

### create

▸ **create**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDraftOrdersRes`](../modules/internal.md#admindraftordersres)\>

**`description`** Creates a draft order

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`AdminPostDraftOrdersDraftOrderReq`](internal.AdminPostDraftOrdersDraftOrderReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDraftOrdersRes`](../modules/internal.md#admindraftordersres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/draft-orders.ts:19](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/draft-orders.ts#L19)

___

### delete

▸ **delete**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`DeleteResponse`](../modules/internal.md#deleteresponse)\>

**`description`** Delete draft order

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`DeleteResponse`](../modules/internal.md#deleteresponse)\>

#### Defined in

[packages/medusa-js/src/resources/admin/draft-orders.ts:40](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/draft-orders.ts#L40)

___

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDraftOrdersListRes`](../modules/internal.md#admindraftorderslistres)\>

**`description`** Lists draft orders

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | [`AdminGetDraftOrdersParams`](internal.AdminGetDraftOrdersParams.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDraftOrdersListRes`](../modules/internal.md#admindraftorderslistres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/draft-orders.ts:67](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/draft-orders.ts#L67)

___

### markPaid

▸ **markPaid**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminPostDraftOrdersDraftOrderRegisterPaymentRes`](../modules/internal.md#adminpostdraftordersdraftorderregisterpaymentres)\>

**`description`** Mark a draft order as paid

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminPostDraftOrdersDraftOrderRegisterPaymentRes`](../modules/internal.md#adminpostdraftordersdraftorderregisterpaymentres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/draft-orders.ts:83](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/draft-orders.ts#L83)

___

### removeLineItem

▸ **removeLineItem**(`id`, `itemId`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDraftOrdersRes`](../modules/internal.md#admindraftordersres)\>

**`description`** Remove line item

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `itemId` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDraftOrdersRes`](../modules/internal.md#admindraftordersres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/draft-orders.ts:48](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/draft-orders.ts#L48)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDraftOrdersRes`](../modules/internal.md#admindraftordersres)\>

**`description`** Retrieves a draft order

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDraftOrdersRes`](../modules/internal.md#admindraftordersres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/draft-orders.ts:59](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/draft-orders.ts#L59)

___

### update

▸ **update**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDraftOrdersRes`](../modules/internal.md#admindraftordersres)\>

**`description`** Update draft order

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostDraftOrdersDraftOrderReq`](internal.AdminPostDraftOrdersDraftOrderReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDraftOrdersRes`](../modules/internal.md#admindraftordersres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/draft-orders.ts:94](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/draft-orders.ts#L94)

___

### updateLineItem

▸ **updateLineItem**(`id`, `itemId`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDraftOrdersRes`](../modules/internal.md#admindraftordersres)\>

**`description`** Update draft order line item

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `itemId` | `string` |
| `payload` | [`AdminPostDraftOrdersDraftOrderLineItemsItemReq`](internal.AdminPostDraftOrdersDraftOrderLineItemsItemReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminDraftOrdersRes`](../modules/internal.md#admindraftordersres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/draft-orders.ts:105](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/draft-orders.ts#L105)
