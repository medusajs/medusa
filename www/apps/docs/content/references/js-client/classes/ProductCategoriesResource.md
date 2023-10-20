---
displayed_sidebar: jsClientSidebar
---

# Class: ProductCategoriesResource

## Hierarchy

- `default`

  ↳ **`ProductCategoriesResource`**

## Methods

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`StoreGetProductCategoriesRes`](../modules/internal-8.internal.md#storegetproductcategoriesres)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `query?` | [`StoreGetProductCategoriesParams`](internal-8.internal.StoreGetProductCategoriesParams.md) | is optional. Can contain a limit and offset for the returned list |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`StoreGetProductCategoriesRes`](../modules/internal-8.internal.md#storegetproductcategoriesres)\>

**`Description`**

Retrieves a list of product categories

#### Defined in

[packages/medusa-js/src/resources/product-categories.ts:40](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/product-categories.ts#L40)

___

### retrieve

▸ **retrieve**(`id`, `query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`StoreGetProductCategoriesCategoryRes`](../modules/internal-8.internal.md#storegetproductcategoriescategoryres)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the product category |
| `query?` | [`StoreGetProductCategoriesCategoryParams`](internal-8.internal.StoreGetProductCategoriesCategoryParams.md) | is optional. Can contain a fields or relations for the returned list |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`StoreGetProductCategoriesCategoryRes`](../modules/internal-8.internal.md#storegetproductcategoriescategoryres)\>

**`Description`**

Retrieves a single product category

#### Defined in

[packages/medusa-js/src/resources/product-categories.ts:19](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/product-categories.ts#L19)
