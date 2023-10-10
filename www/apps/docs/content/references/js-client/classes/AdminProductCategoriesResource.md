---
displayed_sidebar: jsClientSidebar
---

# Class: AdminProductCategoriesResource

## Hierarchy

- `default`

  ↳ **`AdminProductCategoriesResource`**

## Methods

### addProducts

▸ **addProducts**(`productCategoryId`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminProductCategoriesCategoryRes`](../modules/internal-8.internal.md#adminproductcategoriescategoryres)\>

Add products to a product category
 This feature is under development and may change in the future.
To use this feature please enable featureflag `product_categories` in your medusa backend project.

#### Parameters

| Name | Type |
| :------ | :------ |
| `productCategoryId` | `string` |
| `payload` | [`AdminPostProductCategoriesCategoryProductsBatchReq`](internal-8.internal.AdminPostProductCategoriesCategoryProductsBatchReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminProductCategoriesCategoryRes`](../modules/internal-8.internal.md#adminproductcategoriescategoryres)\>

a medusa product category

**`Description`**

Add products to a product category

#### Defined in

[packages/medusa-js/src/resources/admin/product-categories.ts:126](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/product-categories.ts#L126)

___

### create

▸ **create**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminProductCategoriesCategoryRes`](../modules/internal-8.internal.md#adminproductcategoriescategoryres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`AdminPostProductCategoriesReq`](internal-8.internal.AdminPostProductCategoriesReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminProductCategoriesCategoryRes`](../modules/internal-8.internal.md#adminproductcategoriescategoryres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/product-categories.ts:44](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/product-categories.ts#L44)

___

### delete

▸ **delete**(`productCategoryId`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`DeleteResponse`](../modules/internal-8.internal.md#deleteresponse)\>

Delete a product category
 This feature is under development and may change in the future.
To use this feature please enable featureflag `product_categories` in your medusa backend project.

#### Parameters

| Name | Type |
| :------ | :------ |
| `productCategoryId` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`DeleteResponse`](../modules/internal-8.internal.md#deleteresponse)\>

an deletion result

**`Description`**

gets a product category

#### Defined in

[packages/medusa-js/src/resources/admin/product-categories.ts:95](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/product-categories.ts#L95)

___

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminProductCategoriesListRes`](../modules/internal-8.internal.md#adminproductcategorieslistres)\>

Retrieve a list of product categories
 This feature is under development and may change in the future.
To use this feature please enable featureflag `product_categories` in your medusa backend project.

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | [`AdminGetProductCategoriesParams`](internal-8.internal.AdminGetProductCategoriesParams.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminProductCategoriesListRes`](../modules/internal-8.internal.md#adminproductcategorieslistres)\>

the list of product category as well as the pagination properties

**`Description`**

Retrieve a list of product categories

#### Defined in

[packages/medusa-js/src/resources/admin/product-categories.ts:74](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/product-categories.ts#L74)

___

### removeProducts

▸ **removeProducts**(`productCategoryId`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminProductCategoriesCategoryRes`](../modules/internal-8.internal.md#adminproductcategoriescategoryres)\>

Remove products from a product category
 This feature is under development and may change in the future.
To use this feature please enable featureflag `product_categories` in your medusa backend project.

#### Parameters

| Name | Type |
| :------ | :------ |
| `productCategoryId` | `string` |
| `payload` | [`AdminDeleteProductCategoriesCategoryProductsBatchReq`](internal-8.internal.AdminDeleteProductCategoriesCategoryProductsBatchReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminProductCategoriesCategoryRes`](../modules/internal-8.internal.md#adminproductcategoriescategoryres)\>

a medusa product category

**`Description`**

Remove products from a product category

#### Defined in

[packages/medusa-js/src/resources/admin/product-categories.ts:110](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/product-categories.ts#L110)

___

### retrieve

▸ **retrieve**(`productCategoryId`, `query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminProductCategoriesCategoryRes`](../modules/internal-8.internal.md#adminproductcategoriescategoryres)\>

retrieve a product category
 This feature is under development and may change in the future.
To use this feature please enable featureflag `product_categories` in your medusa backend project.

#### Parameters

| Name | Type |
| :------ | :------ |
| `productCategoryId` | `string` |
| `query?` | [`AdminGetProductCategoryParams`](internal-8.internal.AdminGetProductCategoryParams.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminProductCategoriesCategoryRes`](../modules/internal-8.internal.md#adminproductcategoriescategoryres)\>

a medusa product category

**`Description`**

gets a product category

#### Defined in

[packages/medusa-js/src/resources/admin/product-categories.ts:25](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/product-categories.ts#L25)

___

### update

▸ **update**(`productCategoryId`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminProductCategoriesCategoryRes`](../modules/internal-8.internal.md#adminproductcategoriescategoryres)\>

update a product category
 This feature is under development and may change in the future.
To use this feature please enable featureflag `product_categories` in your medusa backend project.

#### Parameters

| Name | Type |
| :------ | :------ |
| `productCategoryId` | `string` |
| `payload` | [`AdminPostProductCategoriesCategoryReq`](internal-8.internal.AdminPostProductCategoriesCategoryReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminProductCategoriesCategoryRes`](../modules/internal-8.internal.md#adminproductcategoriescategoryres)\>

the updated medusa product category

**`Description`**

updates a product category

#### Defined in

[packages/medusa-js/src/resources/admin/product-categories.ts:58](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/product-categories.ts#L58)
