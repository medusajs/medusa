# Class: ProductsResource

## Hierarchy

- `default`

  ↳ **`ProductsResource`**

## Properties

### variants

• **variants**: [`ProductVariantsResource`](ProductVariantsResource.md)

#### Defined in

[medusa-js/src/resources/products.ts:14](https://github.com/medusajs/medusa/blob/53e34d33d/packages/medusa-js/src/resources/products.ts#L14)

## Methods

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreProductsListRes`](../modules/internal-41.md#storeproductslistres)\>

**`Description`**

Retrieves a list of products

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `query?` | [`StoreGetProductsParams`](internal-41.StoreGetProductsParams.md) | is optional. Can contain a limit and offset for the returned list |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreProductsListRes`](../modules/internal-41.md#storeproductslistres)\>

#### Defined in

[medusa-js/src/resources/products.ts:50](https://github.com/medusajs/medusa/blob/53e34d33d/packages/medusa-js/src/resources/products.ts#L50)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreProductsRes`](../modules/internal-41.md#storeproductsres)\>

**`Description`**

Retrieves a single Product

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | is required |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreProductsRes`](../modules/internal-41.md#storeproductsres)\>

#### Defined in

[medusa-js/src/resources/products.ts:22](https://github.com/medusajs/medusa/blob/53e34d33d/packages/medusa-js/src/resources/products.ts#L22)

___

### search

▸ **search**(`searchOptions`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StorePostSearchRes`](../modules/internal-41.md#storepostsearchres)\>

**`Description`**

Searches for products

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `searchOptions` | [`StorePostSearchReq`](internal-41.StorePostSearchReq.md) | is required |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StorePostSearchRes`](../modules/internal-41.md#storepostsearchres)\>

#### Defined in

[medusa-js/src/resources/products.ts:36](https://github.com/medusajs/medusa/blob/53e34d33d/packages/medusa-js/src/resources/products.ts#L36)
