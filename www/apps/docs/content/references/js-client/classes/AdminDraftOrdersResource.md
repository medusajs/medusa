# Class: AdminDraftOrdersResource

## Hierarchy

- `default`

  ↳ **`AdminDraftOrdersResource`**

## Methods

### addLineItem

▸ **addLineItem**(`id`, `payload`, `customHeaders?`): `ResponsePromise`<`AdminDraftOrdersRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | `AdminPostDraftOrdersDraftOrderLineItemsReq` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminDraftOrdersRes`\>

**`Description`**

Add line item to draft order

#### Defined in

[admin/draft-orders.ts:30](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/draft-orders.ts#L30)

___

### create

▸ **create**(`payload`, `customHeaders?`): `ResponsePromise`<`AdminDraftOrdersRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | `AdminPostDraftOrdersReq` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminDraftOrdersRes`\>

**`Description`**

Creates a draft order

#### Defined in

[admin/draft-orders.ts:20](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/draft-orders.ts#L20)

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

**`Description`**

Delete draft order

#### Defined in

[admin/draft-orders.ts:42](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/draft-orders.ts#L42)

___

### list

▸ **list**(`query?`, `customHeaders?`): `ResponsePromise`<`AdminDraftOrdersListRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | `AdminGetDraftOrdersParams` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminDraftOrdersListRes`\>

**`Description`**

Lists draft orders

#### Defined in

[admin/draft-orders.ts:76](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/draft-orders.ts#L76)

___

### markPaid

▸ **markPaid**(`id`, `customHeaders?`): `ResponsePromise`<`AdminPostDraftOrdersDraftOrderRegisterPaymentRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminPostDraftOrdersDraftOrderRegisterPaymentRes`\>

**`Description`**

Mark a draft order as paid

#### Defined in

[admin/draft-orders.ts:93](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/draft-orders.ts#L93)

___

### removeLineItem

▸ **removeLineItem**(`id`, `itemId`, `customHeaders?`): `ResponsePromise`<`AdminDraftOrdersRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `itemId` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminDraftOrdersRes`\>

**`Description`**

Remove line item

#### Defined in

[admin/draft-orders.ts:53](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/draft-orders.ts#L53)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): `ResponsePromise`<`AdminDraftOrdersRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminDraftOrdersRes`\>

**`Description`**

Retrieves a draft order

#### Defined in

[admin/draft-orders.ts:65](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/draft-orders.ts#L65)

___

### update

▸ **update**(`id`, `payload`, `customHeaders?`): `ResponsePromise`<`AdminDraftOrdersRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | `AdminPostDraftOrdersDraftOrderReq` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminDraftOrdersRes`\>

**`Description`**

Update draft order

#### Defined in

[admin/draft-orders.ts:104](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/draft-orders.ts#L104)

___

### updateLineItem

▸ **updateLineItem**(`id`, `itemId`, `payload`, `customHeaders?`): `ResponsePromise`<`AdminDraftOrdersRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `itemId` | `string` |
| `payload` | `AdminPostDraftOrdersDraftOrderLineItemsItemReq` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminDraftOrdersRes`\>

**`Description`**

Update draft order line item

#### Defined in

[admin/draft-orders.ts:116](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/draft-orders.ts#L116)
