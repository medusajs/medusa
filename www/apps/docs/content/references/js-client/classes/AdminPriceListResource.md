---
displayed_sidebar: jsClientSidebar
---

# Class: AdminPriceListResource

## Hierarchy

- `default`

  ↳ **`AdminPriceListResource`**

## Methods

### addPrices

▸ **addPrices**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminPriceListRes`](../modules/internal-8.internal.md#adminpricelistres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostPriceListPricesPricesReq`](internal-8.internal.AdminPostPriceListPricesPricesReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminPriceListRes`](../modules/internal-8.internal.md#adminpricelistres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/price-lists.ts:81](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/price-lists.ts#L81)

___

### create

▸ **create**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminPriceListRes`](../modules/internal-8.internal.md#adminpricelistres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`AdminPostPriceListsPriceListReq`](internal-8.internal.AdminPostPriceListsPriceListReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminPriceListRes`](../modules/internal-8.internal.md#adminpricelistres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/price-lists.ts:19](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/price-lists.ts#L19)

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

#### Defined in

[packages/medusa-js/src/resources/admin/price-lists.ts:36](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/price-lists.ts#L36)

___

### deletePrices

▸ **deletePrices**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminPriceListDeleteBatchRes`](../modules/internal-8.internal.md#adminpricelistdeletebatchres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminDeletePriceListPricesPricesReq`](internal-8.internal.AdminDeletePriceListPricesPricesReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminPriceListDeleteBatchRes`](../modules/internal-8.internal.md#adminpricelistdeletebatchres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/price-lists.ts:90](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/price-lists.ts#L90)

___

### deleteProductPrices

▸ **deleteProductPrices**(`priceListId`, `productId`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminPriceListDeleteBatchRes`](../modules/internal-8.internal.md#adminpricelistdeletebatchres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `priceListId` | `string` |
| `productId` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminPriceListDeleteBatchRes`](../modules/internal-8.internal.md#adminpricelistdeletebatchres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/price-lists.ts:99](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/price-lists.ts#L99)

___

### deleteProductsPrices

▸ **deleteProductsPrices**(`priceListId`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminPriceListDeleteBatchRes`](../modules/internal-8.internal.md#adminpricelistdeletebatchres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `priceListId` | `string` |
| `payload` | [`AdminDeletePriceListsPriceListProductsPricesBatchReq`](internal-8.internal.AdminDeletePriceListsPriceListProductsPricesBatchReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminPriceListDeleteBatchRes`](../modules/internal-8.internal.md#adminpricelistdeletebatchres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/price-lists.ts:117](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/price-lists.ts#L117)

___

### deleteVariantPrices

▸ **deleteVariantPrices**(`priceListId`, `variantId`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminPriceListDeleteBatchRes`](../modules/internal-8.internal.md#adminpricelistdeletebatchres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `priceListId` | `string` |
| `variantId` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminPriceListDeleteBatchRes`](../modules/internal-8.internal.md#adminpricelistdeletebatchres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/price-lists.ts:108](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/price-lists.ts#L108)

___

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminPriceListsListRes`](../modules/internal-8.internal.md#adminpricelistslistres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | [`AdminGetPriceListPaginationParams`](internal-8.internal.AdminGetPriceListPaginationParams.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminPriceListsListRes`](../modules/internal-8.internal.md#adminpricelistslistres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/price-lists.ts:52](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/price-lists.ts#L52)

___

### listProducts

▸ **listProducts**(`id`, `query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `query?` | [`AdminGetPriceListsPriceListProductsParams`](internal-8.internal.AdminGetPriceListsPriceListProductsParams.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<`any`\>

#### Defined in

[packages/medusa-js/src/resources/admin/price-lists.ts:66](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/price-lists.ts#L66)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminPriceListRes`](../modules/internal-8.internal.md#adminpricelistres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminPriceListRes`](../modules/internal-8.internal.md#adminpricelistres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/price-lists.ts:44](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/price-lists.ts#L44)

___

### update

▸ **update**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminPriceListRes`](../modules/internal-8.internal.md#adminpricelistres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostPriceListsPriceListPriceListReq`](internal-8.internal.AdminPostPriceListsPriceListPriceListReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminPriceListRes`](../modules/internal-8.internal.md#adminpricelistres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/price-lists.ts:27](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/price-lists.ts#L27)
