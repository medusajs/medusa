# Class: AdminPriceListResource

## Hierarchy

- `default`

  ↳ **`AdminPriceListResource`**

## Methods

### addPrices

▸ **addPrices**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminPriceListRes`](../modules/internal-17.md#adminpricelistres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostPriceListPricesPricesReq`](internal-17.AdminPostPriceListPricesPricesReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminPriceListRes`](../modules/internal-17.md#adminpricelistres)\>

#### Defined in

[medusa-js/src/resources/admin/price-lists.ts:80](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/price-lists.ts#L80)

___

### create

▸ **create**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminPriceListRes`](../modules/internal-17.md#adminpricelistres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`AdminPostPriceListsPriceListReq`](internal-17.AdminPostPriceListsPriceListReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminPriceListRes`](../modules/internal-17.md#adminpricelistres)\>

#### Defined in

[medusa-js/src/resources/admin/price-lists.ts:18](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/price-lists.ts#L18)

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

[medusa-js/src/resources/admin/price-lists.ts:35](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/price-lists.ts#L35)

___

### deletePrices

▸ **deletePrices**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminPriceListDeleteBatchRes`](../modules/internal-17.md#adminpricelistdeletebatchres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminDeletePriceListPricesPricesReq`](internal-17.AdminDeletePriceListPricesPricesReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminPriceListDeleteBatchRes`](../modules/internal-17.md#adminpricelistdeletebatchres)\>

#### Defined in

[medusa-js/src/resources/admin/price-lists.ts:89](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/price-lists.ts#L89)

___

### deleteProductPrices

▸ **deleteProductPrices**(`priceListId`, `productId`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminPriceListDeleteBatchRes`](../modules/internal-17.md#adminpricelistdeletebatchres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `priceListId` | `string` |
| `productId` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminPriceListDeleteBatchRes`](../modules/internal-17.md#adminpricelistdeletebatchres)\>

#### Defined in

[medusa-js/src/resources/admin/price-lists.ts:98](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/price-lists.ts#L98)

___

### deleteVariantPrices

▸ **deleteVariantPrices**(`priceListId`, `variantId`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminPriceListDeleteBatchRes`](../modules/internal-17.md#adminpricelistdeletebatchres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `priceListId` | `string` |
| `variantId` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminPriceListDeleteBatchRes`](../modules/internal-17.md#adminpricelistdeletebatchres)\>

#### Defined in

[medusa-js/src/resources/admin/price-lists.ts:107](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/price-lists.ts#L107)

___

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminPriceListsListRes`](../modules/internal-17.md#adminpricelistslistres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | [`AdminGetPriceListPaginationParams`](internal-17.AdminGetPriceListPaginationParams.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminPriceListsListRes`](../modules/internal-17.md#adminpricelistslistres)\>

#### Defined in

[medusa-js/src/resources/admin/price-lists.ts:51](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/price-lists.ts#L51)

___

### listProducts

▸ **listProducts**(`id`, `query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `query?` | [`AdminGetPriceListsPriceListProductsParams`](internal-17.AdminGetPriceListsPriceListProductsParams.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<`any`\>

#### Defined in

[medusa-js/src/resources/admin/price-lists.ts:65](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/price-lists.ts#L65)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminPriceListRes`](../modules/internal-17.md#adminpricelistres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminPriceListRes`](../modules/internal-17.md#adminpricelistres)\>

#### Defined in

[medusa-js/src/resources/admin/price-lists.ts:43](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/price-lists.ts#L43)

___

### update

▸ **update**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminPriceListRes`](../modules/internal-17.md#adminpricelistres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostPriceListsPriceListPriceListReq`](internal-17.AdminPostPriceListsPriceListPriceListReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminPriceListRes`](../modules/internal-17.md#adminpricelistres)\>

#### Defined in

[medusa-js/src/resources/admin/price-lists.ts:26](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/price-lists.ts#L26)
