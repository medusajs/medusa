# Class: AdminProductCategoriesResource

## Hierarchy

- `default`

  ↳ **`AdminProductCategoriesResource`**

## Methods

### addProducts

▸ **addProducts**(`productCategoryId`, `payload`, `customHeaders?`): `ResponsePromise`<`AdminProductCategoriesCategoryRes`\>

Add products to a product category
 This feature is under development and may change in the future.
To use this feature please enable featureflag `product_categories` in your medusa backend project.

#### Parameters

| Name | Type |
| :------ | :------ |
| `productCategoryId` | `string` |
| `payload` | `AdminPostProductCategoriesCategoryProductsBatchReq` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminProductCategoriesCategoryRes`\>

a medusa product category

**`Description`**

Add products to a product category

#### Defined in

[admin/product-categories.ts:126](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/product-categories.ts#L126)

___

### create

▸ **create**(`payload`, `customHeaders?`): `ResponsePromise`<`AdminProductCategoriesCategoryRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | `AdminPostProductCategoriesReq` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminProductCategoriesCategoryRes`\>

#### Defined in

[admin/product-categories.ts:44](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/product-categories.ts#L44)

___

### delete

▸ **delete**(`productCategoryId`, `customHeaders?`): `ResponsePromise`<`DeleteResponse`\>

Delete a product category
 This feature is under development and may change in the future.
To use this feature please enable featureflag `product_categories` in your medusa backend project.

#### Parameters

| Name | Type |
| :------ | :------ |
| `productCategoryId` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`DeleteResponse`\>

an deletion result

**`Description`**

gets a product category

#### Defined in

[admin/product-categories.ts:95](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/product-categories.ts#L95)

___

### list

▸ **list**(`query?`, `customHeaders?`): `ResponsePromise`<`AdminProductCategoriesListRes`\>

Retrieve a list of product categories
 This feature is under development and may change in the future.
To use this feature please enable featureflag `product_categories` in your medusa backend project.

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | `AdminGetProductCategoriesParams` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminProductCategoriesListRes`\>

the list of product category as well as the pagination properties

**`Description`**

Retrieve a list of product categories

#### Defined in

[admin/product-categories.ts:74](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/product-categories.ts#L74)

___

### removeProducts

▸ **removeProducts**(`productCategoryId`, `payload`, `customHeaders?`): `ResponsePromise`<`AdminProductCategoriesCategoryRes`\>

Remove products from a product category
 This feature is under development and may change in the future.
To use this feature please enable featureflag `product_categories` in your medusa backend project.

#### Parameters

| Name | Type |
| :------ | :------ |
| `productCategoryId` | `string` |
| `payload` | `AdminDeleteProductCategoriesCategoryProductsBatchReq` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminProductCategoriesCategoryRes`\>

a medusa product category

**`Description`**

Remove products from a product category

#### Defined in

[admin/product-categories.ts:110](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/product-categories.ts#L110)

___

### retrieve

▸ **retrieve**(`productCategoryId`, `query?`, `customHeaders?`): `ResponsePromise`<`AdminProductCategoriesCategoryRes`\>

retrieve a product category
 This feature is under development and may change in the future.
To use this feature please enable featureflag `product_categories` in your medusa backend project.

#### Parameters

| Name | Type |
| :------ | :------ |
| `productCategoryId` | `string` |
| `query?` | `AdminGetProductCategoryParams` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminProductCategoriesCategoryRes`\>

a medusa product category

**`Description`**

gets a product category

#### Defined in

[admin/product-categories.ts:25](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/product-categories.ts#L25)

___

### update

▸ **update**(`productCategoryId`, `payload`, `customHeaders?`): `ResponsePromise`<`AdminProductCategoriesCategoryRes`\>

update a product category
 This feature is under development and may change in the future.
To use this feature please enable featureflag `product_categories` in your medusa backend project.

#### Parameters

| Name | Type |
| :------ | :------ |
| `productCategoryId` | `string` |
| `payload` | `AdminPostProductCategoriesCategoryReq` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminProductCategoriesCategoryRes`\>

the updated medusa product category

**`Description`**

updates a product category

#### Defined in

[admin/product-categories.ts:58](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/product-categories.ts#L58)
