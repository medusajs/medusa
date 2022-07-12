# Class: AdminProductsResource

## Hierarchy

- `default`

  ↳ **`AdminProductsResource`**

## Methods

### addOption

▸ **addOption**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsRes`](../modules/internal.md#adminproductsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostProductsProductOptionsReq`](internal.AdminPostProductsProductOptionsReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsRes`](../modules/internal.md#adminproductsres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/products.ts:121](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/products.ts#L121)

___

### create

▸ **create**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsRes`](../modules/internal.md#adminproductsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`AdminPostProductsReq`](internal.AdminPostProductsReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsRes`](../modules/internal.md#adminproductsres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/products.ts:23](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/products.ts#L23)

___

### createVariant

▸ **createVariant**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsRes`](../modules/internal.md#adminproductsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostProductsProductVariantsReq`](internal.AdminPostProductsProductVariantsReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsRes`](../modules/internal.md#adminproductsres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/products.ts:93](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/products.ts#L93)

___

### delete

▸ **delete**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsDeleteRes`](../modules/internal.md#adminproductsdeleteres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsDeleteRes`](../modules/internal.md#adminproductsdeleteres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/products.ts:48](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/products.ts#L48)

___

### deleteOption

▸ **deleteOption**(`id`, `optionId`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsDeleteOptionRes`](../modules/internal.md#adminproductsdeleteoptionres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `optionId` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsDeleteOptionRes`](../modules/internal.md#adminproductsdeleteoptionres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/products.ts:140](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/products.ts#L140)

___

### deleteVariant

▸ **deleteVariant**(`id`, `variantId`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsDeleteVariantRes`](../modules/internal.md#adminproductsdeletevariantres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `variantId` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsDeleteVariantRes`](../modules/internal.md#adminproductsdeletevariantres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/products.ts:112](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/products.ts#L112)

___

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsListRes`](../modules/internal.md#adminproductslistres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | [`AdminGetProductsParams`](internal.AdminGetProductsParams.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsListRes`](../modules/internal.md#adminproductslistres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/products.ts:56](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/products.ts#L56)

___

### listTags

▸ **listTags**(`customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsListTagsRes`](../modules/internal.md#adminproductslisttagsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsListTagsRes`](../modules/internal.md#adminproductslisttagsres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/products.ts:77](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/products.ts#L77)

___

### listTypes

▸ **listTypes**(`customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsListTypesRes`](../modules/internal.md#adminproductslisttypesres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsListTypesRes`](../modules/internal.md#adminproductslisttypesres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/products.ts:70](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/products.ts#L70)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsRes`](../modules/internal.md#adminproductsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsRes`](../modules/internal.md#adminproductsres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/products.ts:31](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/products.ts#L31)

___

### setMetadata

▸ **setMetadata**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsRes`](../modules/internal.md#adminproductsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostProductsProductMetadataReq`](internal.AdminPostProductsProductMetadataReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsRes`](../modules/internal.md#adminproductsres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/products.ts:84](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/products.ts#L84)

___

### update

▸ **update**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsRes`](../modules/internal.md#adminproductsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostProductsProductReq`](internal.AdminPostProductsProductReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsRes`](../modules/internal.md#adminproductsres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/products.ts:39](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/products.ts#L39)

___

### updateOption

▸ **updateOption**(`id`, `optionId`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsRes`](../modules/internal.md#adminproductsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `optionId` | `string` |
| `payload` | [`AdminPostProductsProductOptionsOption`](internal.AdminPostProductsProductOptionsOption.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsRes`](../modules/internal.md#adminproductsres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/products.ts:130](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/products.ts#L130)

___

### updateVariant

▸ **updateVariant**(`id`, `variantId`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsRes`](../modules/internal.md#adminproductsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `variantId` | `string` |
| `payload` | [`AdminPostProductsProductVariantsVariantReq`](internal.AdminPostProductsProductVariantsVariantReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminProductsRes`](../modules/internal.md#adminproductsres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/products.ts:102](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/products.ts#L102)
