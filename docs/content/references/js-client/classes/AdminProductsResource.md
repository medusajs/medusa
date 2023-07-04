# Class: AdminProductsResource

## Hierarchy

- `default`

  ↳ **`AdminProductsResource`**

## Methods

### addOption

▸ **addOption**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsRes`](../modules/internal-20.md#adminproductsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostProductsProductOptionsReq`](internal-20.AdminPostProductsProductOptionsReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsRes`](../modules/internal-20.md#adminproductsres)\>

#### Defined in

[medusa-js/src/resources/admin/products.ts:124](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/products.ts#L124)

___

### create

▸ **create**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsRes`](../modules/internal-20.md#adminproductsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`AdminPostProductsReq`](internal-20.AdminPostProductsReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsRes`](../modules/internal-20.md#adminproductsres)\>

#### Defined in

[medusa-js/src/resources/admin/products.ts:23](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/products.ts#L23)

___

### createVariant

▸ **createVariant**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsRes`](../modules/internal-20.md#adminproductsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostProductsProductVariantsReq`](internal-20.AdminPostProductsProductVariantsReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsRes`](../modules/internal-20.md#adminproductsres)\>

#### Defined in

[medusa-js/src/resources/admin/products.ts:96](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/products.ts#L96)

___

### delete

▸ **delete**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsDeleteRes`](../modules/internal-20.md#adminproductsdeleteres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsDeleteRes`](../modules/internal-20.md#adminproductsdeleteres)\>

#### Defined in

[medusa-js/src/resources/admin/products.ts:48](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/products.ts#L48)

___

### deleteOption

▸ **deleteOption**(`id`, `optionId`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsDeleteOptionRes`](../modules/internal-20.md#adminproductsdeleteoptionres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `optionId` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsDeleteOptionRes`](../modules/internal-20.md#adminproductsdeleteoptionres)\>

#### Defined in

[medusa-js/src/resources/admin/products.ts:143](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/products.ts#L143)

___

### deleteVariant

▸ **deleteVariant**(`id`, `variantId`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsDeleteVariantRes`](../modules/internal-20.md#adminproductsdeletevariantres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `variantId` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsDeleteVariantRes`](../modules/internal-20.md#adminproductsdeletevariantres)\>

#### Defined in

[medusa-js/src/resources/admin/products.ts:115](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/products.ts#L115)

___

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsListRes`](../modules/internal-20.md#adminproductslistres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | [`AdminGetProductsParams`](internal-20.AdminGetProductsParams.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsListRes`](../modules/internal-20.md#adminproductslistres)\>

#### Defined in

[medusa-js/src/resources/admin/products.ts:56](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/products.ts#L56)

___

### listTags

▸ **listTags**(`customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsListTagsRes`](../modules/internal-20.md#adminproductslisttagsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsListTagsRes`](../modules/internal-20.md#adminproductslisttagsres)\>

#### Defined in

[medusa-js/src/resources/admin/products.ts:80](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/products.ts#L80)

___

### listTypes

▸ **listTypes**(`customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsListTypesRes`](../modules/internal-20.md#adminproductslisttypesres)\>

**`Deprecated`**

Use [list](AdminProductTypesResource.md#list) instead.

#### Parameters

| Name | Type |
| :------ | :------ |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsListTypesRes`](../modules/internal-20.md#adminproductslisttypesres)\>

#### Defined in

[medusa-js/src/resources/admin/products.ts:73](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/products.ts#L73)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsRes`](../modules/internal-20.md#adminproductsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsRes`](../modules/internal-20.md#adminproductsres)\>

#### Defined in

[medusa-js/src/resources/admin/products.ts:31](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/products.ts#L31)

___

### setMetadata

▸ **setMetadata**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsRes`](../modules/internal-20.md#adminproductsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostProductsProductMetadataReq`](internal-20.AdminPostProductsProductMetadataReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsRes`](../modules/internal-20.md#adminproductsres)\>

#### Defined in

[medusa-js/src/resources/admin/products.ts:87](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/products.ts#L87)

___

### update

▸ **update**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsRes`](../modules/internal-20.md#adminproductsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostProductsProductReq`](internal-20.AdminPostProductsProductReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsRes`](../modules/internal-20.md#adminproductsres)\>

#### Defined in

[medusa-js/src/resources/admin/products.ts:39](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/products.ts#L39)

___

### updateOption

▸ **updateOption**(`id`, `optionId`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsRes`](../modules/internal-20.md#adminproductsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `optionId` | `string` |
| `payload` | [`AdminPostProductsProductOptionsOption`](internal-20.AdminPostProductsProductOptionsOption.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsRes`](../modules/internal-20.md#adminproductsres)\>

#### Defined in

[medusa-js/src/resources/admin/products.ts:133](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/products.ts#L133)

___

### updateVariant

▸ **updateVariant**(`id`, `variantId`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsRes`](../modules/internal-20.md#adminproductsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `variantId` | `string` |
| `payload` | [`AdminPostProductsProductVariantsVariantReq`](internal-20.AdminPostProductsProductVariantsVariantReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsRes`](../modules/internal-20.md#adminproductsres)\>

#### Defined in

[medusa-js/src/resources/admin/products.ts:105](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/products.ts#L105)
