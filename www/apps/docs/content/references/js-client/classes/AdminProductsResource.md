# Class: AdminProductsResource

## Hierarchy

- `default`

  ↳ **`AdminProductsResource`**

## Methods

### addOption

▸ **addOption**(`id`, `payload`, `customHeaders?`): `ResponsePromise`<`AdminProductsRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | `AdminPostProductsProductOptionsReq` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminProductsRes`\>

#### Defined in

[admin/products.ts:124](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/products.ts#L124)

___

### create

▸ **create**(`payload`, `customHeaders?`): `ResponsePromise`<`AdminProductsRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | `AdminPostProductsReq` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminProductsRes`\>

#### Defined in

[admin/products.ts:23](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/products.ts#L23)

___

### createVariant

▸ **createVariant**(`id`, `payload`, `customHeaders?`): `ResponsePromise`<`AdminProductsRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | `AdminPostProductsProductVariantsReq` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminProductsRes`\>

#### Defined in

[admin/products.ts:96](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/products.ts#L96)

___

### delete

▸ **delete**(`id`, `customHeaders?`): `ResponsePromise`<`AdminProductsDeleteRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminProductsDeleteRes`\>

#### Defined in

[admin/products.ts:48](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/products.ts#L48)

___

### deleteOption

▸ **deleteOption**(`id`, `optionId`, `customHeaders?`): `ResponsePromise`<`AdminProductsDeleteOptionRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `optionId` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminProductsDeleteOptionRes`\>

#### Defined in

[admin/products.ts:143](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/products.ts#L143)

___

### deleteVariant

▸ **deleteVariant**(`id`, `variantId`, `customHeaders?`): `ResponsePromise`<`AdminProductsDeleteVariantRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `variantId` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminProductsDeleteVariantRes`\>

#### Defined in

[admin/products.ts:115](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/products.ts#L115)

___

### list

▸ **list**(`query?`, `customHeaders?`): `ResponsePromise`<`AdminProductsListRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | `AdminGetProductsParams` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminProductsListRes`\>

#### Defined in

[admin/products.ts:56](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/products.ts#L56)

___

### listTags

▸ **listTags**(`customHeaders?`): `ResponsePromise`<`AdminProductsListTagsRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminProductsListTagsRes`\>

#### Defined in

[admin/products.ts:80](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/products.ts#L80)

___

### listTypes

▸ **listTypes**(`customHeaders?`): `ResponsePromise`<`AdminProductsListTypesRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminProductsListTypesRes`\>

**`Deprecated`**

Use [AdminProductTypesResource.list](AdminProductTypesResource.md#list) instead.

#### Defined in

[admin/products.ts:73](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/products.ts#L73)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): `ResponsePromise`<`AdminProductsRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminProductsRes`\>

#### Defined in

[admin/products.ts:31](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/products.ts#L31)

___

### setMetadata

▸ **setMetadata**(`id`, `payload`, `customHeaders?`): `ResponsePromise`<`AdminProductsRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | `AdminPostProductsProductMetadataReq` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminProductsRes`\>

#### Defined in

[admin/products.ts:87](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/products.ts#L87)

___

### update

▸ **update**(`id`, `payload`, `customHeaders?`): `ResponsePromise`<`AdminProductsRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | `AdminPostProductsProductReq` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminProductsRes`\>

#### Defined in

[admin/products.ts:39](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/products.ts#L39)

___

### updateOption

▸ **updateOption**(`id`, `optionId`, `payload`, `customHeaders?`): `ResponsePromise`<`AdminProductsRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `optionId` | `string` |
| `payload` | `AdminPostProductsProductOptionsOption` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminProductsRes`\>

#### Defined in

[admin/products.ts:133](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/products.ts#L133)

___

### updateVariant

▸ **updateVariant**(`id`, `variantId`, `payload`, `customHeaders?`): `ResponsePromise`<`AdminProductsRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `variantId` | `string` |
| `payload` | `AdminPostProductsProductVariantsVariantReq` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminProductsRes`\>

#### Defined in

[admin/products.ts:105](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/products.ts#L105)
