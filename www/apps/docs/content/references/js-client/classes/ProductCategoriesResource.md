# Class: ProductCategoriesResource

## Hierarchy

- `default`

  ↳ **`ProductCategoriesResource`**

## Methods

### list

▸ **list**(`query?`, `customHeaders?`): `ResponsePromise`<`StoreGetProductCategoriesRes`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `query?` | `StoreGetProductCategoriesParams` | is optional. Can contain a limit and offset for the returned list |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`StoreGetProductCategoriesRes`\>

**`Description`**

Retrieves a list of product categories

#### Defined in

[product-categories.ts:40](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/product-categories.ts#L40)

___

### retrieve

▸ **retrieve**(`id`, `query?`, `customHeaders?`): `ResponsePromise`<`StoreGetProductCategoriesCategoryRes`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the product category |
| `query?` | `StoreGetProductCategoriesCategoryParams` | is optional. Can contain a fields or relations for the returned list |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`StoreGetProductCategoriesCategoryRes`\>

**`Description`**

Retrieves a single product category

#### Defined in

[product-categories.ts:19](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/product-categories.ts#L19)
