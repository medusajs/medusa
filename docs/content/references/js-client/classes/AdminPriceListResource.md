# Class: AdminPriceListResource

## Hierarchy

- `default`

  ↳ **`AdminPriceListResource`**

## Methods

### addPrices

▸ **addPrices**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminPriceListRes`](../modules/internal.md#adminpricelistres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostPriceListPricesPricesReq`](internal.AdminPostPriceListPricesPricesReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminPriceListRes`](../modules/internal.md#adminpricelistres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/price-lists.ts:80](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/price-lists.ts#L80)

___

### create

▸ **create**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminPriceListRes`](../modules/internal.md#adminpricelistres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`AdminPostPriceListsPriceListReq`](internal.AdminPostPriceListsPriceListReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminPriceListRes`](../modules/internal.md#adminpricelistres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/price-lists.ts:18](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/price-lists.ts#L18)

___

### delete

▸ **delete**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`DeleteResponse`](../modules/internal.md#deleteresponse)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`DeleteResponse`](../modules/internal.md#deleteresponse)\>

#### Defined in

[packages/medusa-js/src/resources/admin/price-lists.ts:35](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/price-lists.ts#L35)

___

### deletePrices

▸ **deletePrices**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminPriceListDeleteBatchRes`](../modules/internal.md#adminpricelistdeletebatchres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminDeletePriceListPricesPricesReq`](internal.AdminDeletePriceListPricesPricesReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminPriceListDeleteBatchRes`](../modules/internal.md#adminpricelistdeletebatchres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/price-lists.ts:89](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/price-lists.ts#L89)

___

### deleteProductPrices

▸ **deleteProductPrices**(`priceListId`, `productId`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminPriceListDeleteBatchRes`](../modules/internal.md#adminpricelistdeletebatchres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `priceListId` | `string` |
| `productId` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminPriceListDeleteBatchRes`](../modules/internal.md#adminpricelistdeletebatchres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/price-lists.ts:98](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/price-lists.ts#L98)

___

### deleteVariantPrices

▸ **deleteVariantPrices**(`priceListId`, `variantId`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminPriceListDeleteBatchRes`](../modules/internal.md#adminpricelistdeletebatchres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `priceListId` | `string` |
| `variantId` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminPriceListDeleteBatchRes`](../modules/internal.md#adminpricelistdeletebatchres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/price-lists.ts:107](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/price-lists.ts#L107)

___

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminPriceListsListRes`](../modules/internal.md#adminpricelistslistres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | [`AdminGetPriceListPaginationParams`](internal.AdminGetPriceListPaginationParams.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminPriceListsListRes`](../modules/internal.md#adminpricelistslistres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/price-lists.ts:51](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/price-lists.ts#L51)

___

### listProducts

▸ **listProducts**(`id`, `query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `query?` | [`AdminGetPriceListsPriceListProductsParams`](internal.AdminGetPriceListsPriceListProductsParams.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<`any`\>

#### Defined in

[packages/medusa-js/src/resources/admin/price-lists.ts:65](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/price-lists.ts#L65)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminPriceListRes`](../modules/internal.md#adminpricelistres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminPriceListRes`](../modules/internal.md#adminpricelistres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/price-lists.ts:43](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/price-lists.ts#L43)

___

### update

▸ **update**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminPriceListRes`](../modules/internal.md#adminpricelistres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostPriceListsPriceListPriceListReq`](internal.AdminPostPriceListsPriceListPriceListReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminPriceListRes`](../modules/internal.md#adminpricelistres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/price-lists.ts:26](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/price-lists.ts#L26)
