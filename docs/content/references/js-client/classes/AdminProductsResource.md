# Class: AdminProductsResource

## Hierarchy

- `default`

  ↳ **`AdminProductsResource`**

## Methods

### addOption

▸ **addOption**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsRes`](../modules/internal-16.md#adminproductsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostProductsProductOptionsReq`](internal-16.AdminPostProductsProductOptionsReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsRes`](../modules/internal-16.md#adminproductsres)\>

#### Defined in

[medusa-js/src/resources/admin/products.ts:121](https://github.com/medusajs/medusa/blob/e38dd7f6/packages/medusa-js/src/resources/admin/products.ts#L121)

___

### create

▸ **create**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsRes`](../modules/internal-16.md#adminproductsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`AdminPostProductsReq`](internal-16.AdminPostProductsReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsRes`](../modules/internal-16.md#adminproductsres)\>

#### Defined in

[medusa-js/src/resources/admin/products.ts:23](https://github.com/medusajs/medusa/blob/e38dd7f6/packages/medusa-js/src/resources/admin/products.ts#L23)

___

### createVariant

▸ **createVariant**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsRes`](../modules/internal-16.md#adminproductsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostProductsProductVariantsReq`](internal-16.AdminPostProductsProductVariantsReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsRes`](../modules/internal-16.md#adminproductsres)\>

#### Defined in

[medusa-js/src/resources/admin/products.ts:93](https://github.com/medusajs/medusa/blob/e38dd7f6/packages/medusa-js/src/resources/admin/products.ts#L93)

___

### delete

▸ **delete**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsDeleteRes`](../modules/internal-16.md#adminproductsdeleteres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsDeleteRes`](../modules/internal-16.md#adminproductsdeleteres)\>

#### Defined in

[medusa-js/src/resources/admin/products.ts:48](https://github.com/medusajs/medusa/blob/e38dd7f6/packages/medusa-js/src/resources/admin/products.ts#L48)

___

### deleteOption

▸ **deleteOption**(`id`, `optionId`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsDeleteOptionRes`](../modules/internal-16.md#adminproductsdeleteoptionres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `optionId` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsDeleteOptionRes`](../modules/internal-16.md#adminproductsdeleteoptionres)\>

#### Defined in

[medusa-js/src/resources/admin/products.ts:140](https://github.com/medusajs/medusa/blob/e38dd7f6/packages/medusa-js/src/resources/admin/products.ts#L140)

___

### deleteVariant

▸ **deleteVariant**(`id`, `variantId`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsDeleteVariantRes`](../modules/internal-16.md#adminproductsdeletevariantres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `variantId` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsDeleteVariantRes`](../modules/internal-16.md#adminproductsdeletevariantres)\>

#### Defined in

[medusa-js/src/resources/admin/products.ts:112](https://github.com/medusajs/medusa/blob/e38dd7f6/packages/medusa-js/src/resources/admin/products.ts#L112)

___

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsListRes`](../modules/internal-16.md#adminproductslistres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | [`AdminGetProductsParams`](internal-16.AdminGetProductsParams.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsListRes`](../modules/internal-16.md#adminproductslistres)\>

#### Defined in

[medusa-js/src/resources/admin/products.ts:56](https://github.com/medusajs/medusa/blob/e38dd7f6/packages/medusa-js/src/resources/admin/products.ts#L56)

___

### listTags

▸ **listTags**(`customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsListTagsRes`](../modules/internal-16.md#adminproductslisttagsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsListTagsRes`](../modules/internal-16.md#adminproductslisttagsres)\>

#### Defined in

[medusa-js/src/resources/admin/products.ts:77](https://github.com/medusajs/medusa/blob/e38dd7f6/packages/medusa-js/src/resources/admin/products.ts#L77)

___

### listTypes

▸ **listTypes**(`customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsListTypesRes`](../modules/internal-16.md#adminproductslisttypesres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsListTypesRes`](../modules/internal-16.md#adminproductslisttypesres)\>

#### Defined in

[medusa-js/src/resources/admin/products.ts:70](https://github.com/medusajs/medusa/blob/e38dd7f6/packages/medusa-js/src/resources/admin/products.ts#L70)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsRes`](../modules/internal-16.md#adminproductsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsRes`](../modules/internal-16.md#adminproductsres)\>

#### Defined in

[medusa-js/src/resources/admin/products.ts:31](https://github.com/medusajs/medusa/blob/e38dd7f6/packages/medusa-js/src/resources/admin/products.ts#L31)

___

### setMetadata

▸ **setMetadata**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsRes`](../modules/internal-16.md#adminproductsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostProductsProductMetadataReq`](internal-16.AdminPostProductsProductMetadataReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsRes`](../modules/internal-16.md#adminproductsres)\>

#### Defined in

[medusa-js/src/resources/admin/products.ts:84](https://github.com/medusajs/medusa/blob/e38dd7f6/packages/medusa-js/src/resources/admin/products.ts#L84)

___

### update

▸ **update**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsRes`](../modules/internal-16.md#adminproductsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostProductsProductReq`](internal-16.AdminPostProductsProductReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsRes`](../modules/internal-16.md#adminproductsres)\>

#### Defined in

[medusa-js/src/resources/admin/products.ts:39](https://github.com/medusajs/medusa/blob/e38dd7f6/packages/medusa-js/src/resources/admin/products.ts#L39)

___

### updateOption

▸ **updateOption**(`id`, `optionId`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsRes`](../modules/internal-16.md#adminproductsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `optionId` | `string` |
| `payload` | [`AdminPostProductsProductOptionsOption`](internal-16.AdminPostProductsProductOptionsOption.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsRes`](../modules/internal-16.md#adminproductsres)\>

#### Defined in

[medusa-js/src/resources/admin/products.ts:130](https://github.com/medusajs/medusa/blob/e38dd7f6/packages/medusa-js/src/resources/admin/products.ts#L130)

___

### updateVariant

▸ **updateVariant**(`id`, `variantId`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsRes`](../modules/internal-16.md#adminproductsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `variantId` | `string` |
| `payload` | [`AdminPostProductsProductVariantsVariantReq`](internal-16.AdminPostProductsProductVariantsVariantReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsRes`](../modules/internal-16.md#adminproductsres)\>

#### Defined in

[medusa-js/src/resources/admin/products.ts:102](https://github.com/medusajs/medusa/blob/e38dd7f6/packages/medusa-js/src/resources/admin/products.ts#L102)
