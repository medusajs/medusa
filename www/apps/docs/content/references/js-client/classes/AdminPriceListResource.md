# Class: AdminPriceListResource

## Hierarchy

- `default`

  ↳ **`AdminPriceListResource`**

## Methods

### addPrices

▸ **addPrices**(`id`, `payload`, `customHeaders?`): `ResponsePromise`<`AdminPriceListRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | `AdminPostPriceListPricesPricesReq` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminPriceListRes`\>

#### Defined in

[admin/price-lists.ts:81](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/price-lists.ts#L81)

___

### create

▸ **create**(`payload`, `customHeaders?`): `ResponsePromise`<`AdminPriceListRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | `AdminPostPriceListsPriceListReq` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminPriceListRes`\>

#### Defined in

[admin/price-lists.ts:19](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/price-lists.ts#L19)

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

[admin/price-lists.ts:36](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/price-lists.ts#L36)

___

### deletePrices

▸ **deletePrices**(`id`, `payload`, `customHeaders?`): `ResponsePromise`<`AdminPriceListDeleteBatchRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | `AdminDeletePriceListPricesPricesReq` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminPriceListDeleteBatchRes`\>

#### Defined in

[admin/price-lists.ts:90](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/price-lists.ts#L90)

___

### deleteProductPrices

▸ **deleteProductPrices**(`priceListId`, `productId`, `customHeaders?`): `ResponsePromise`<`AdminPriceListDeleteBatchRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `priceListId` | `string` |
| `productId` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminPriceListDeleteBatchRes`\>

#### Defined in

[admin/price-lists.ts:99](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/price-lists.ts#L99)

___

### deleteProductsPrices

▸ **deleteProductsPrices**(`priceListId`, `payload`, `customHeaders?`): `ResponsePromise`<`AdminPriceListDeleteBatchRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `priceListId` | `string` |
| `payload` | `AdminDeletePriceListsPriceListProductsPricesBatchReq` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminPriceListDeleteBatchRes`\>

#### Defined in

[admin/price-lists.ts:117](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/price-lists.ts#L117)

___

### deleteVariantPrices

▸ **deleteVariantPrices**(`priceListId`, `variantId`, `customHeaders?`): `ResponsePromise`<`AdminPriceListDeleteBatchRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `priceListId` | `string` |
| `variantId` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminPriceListDeleteBatchRes`\>

#### Defined in

[admin/price-lists.ts:108](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/price-lists.ts#L108)

___

### list

▸ **list**(`query?`, `customHeaders?`): `ResponsePromise`<`AdminPriceListsListRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | `AdminGetPriceListPaginationParams` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminPriceListsListRes`\>

#### Defined in

[admin/price-lists.ts:52](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/price-lists.ts#L52)

___

### listProducts

▸ **listProducts**(`id`, `query?`, `customHeaders?`): `ResponsePromise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `query?` | `AdminGetPriceListsPriceListProductsParams` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`any`\>

#### Defined in

[admin/price-lists.ts:66](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/price-lists.ts#L66)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): `ResponsePromise`<`AdminPriceListRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminPriceListRes`\>

#### Defined in

[admin/price-lists.ts:44](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/price-lists.ts#L44)

___

### update

▸ **update**(`id`, `payload`, `customHeaders?`): `ResponsePromise`<`AdminPriceListRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | `AdminPostPriceListsPriceListPriceListReq` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminPriceListRes`\>

#### Defined in

[admin/price-lists.ts:27](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/price-lists.ts#L27)
