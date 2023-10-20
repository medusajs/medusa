---
displayed_sidebar: jsClientSidebar
---

# Class: ProductsResource

## Hierarchy

- `default`

  ↳ **`ProductsResource`**

## Properties

### variants

• **variants**: [`ProductVariantsResource`](ProductVariantsResource.md)

#### Defined in

[packages/medusa-js/src/resources/products.ts:14](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/products.ts#L14)

## Methods

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`StoreProductsListRes`](../modules/internal-8.internal.md#storeproductslistres)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `query?` | [`StoreGetProductsParams`](internal-8.internal.StoreGetProductsParams.md) | is optional. Can contain a limit and offset for the returned list |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`StoreProductsListRes`](../modules/internal-8.internal.md#storeproductslistres)\>

**`Description`**

Retrieves a list of products

#### Defined in

[packages/medusa-js/src/resources/products.ts:50](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/products.ts#L50)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`StoreProductsRes`](../modules/internal-8.internal.md#storeproductsres)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | is required |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`StoreProductsRes`](../modules/internal-8.internal.md#storeproductsres)\>

**`Description`**

Retrieves a single Product

#### Defined in

[packages/medusa-js/src/resources/products.ts:22](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/products.ts#L22)

___

### search

▸ **search**(`searchOptions`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`StorePostSearchRes`](../modules/internal-8.internal.md#storepostsearchres)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `searchOptions` | [`StorePostSearchReq`](internal-8.internal.StorePostSearchReq.md) | is required |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`StorePostSearchRes`](../modules/internal-8.internal.md#storepostsearchres)\>

**`Description`**

Searches for products

#### Defined in

[packages/medusa-js/src/resources/products.ts:36](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/products.ts#L36)
