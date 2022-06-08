# Class: ProductsResource

## Hierarchy

- `default`

  ↳ **`ProductsResource`**

## Properties

### variants

• **variants**: [`ProductVariantsResource`](ProductVariantsResource.md)

#### Defined in

[packages/medusa-js/src/resources/products.ts:14](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/products.ts#L14)

## Methods

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreProductsListRes`](../modules/internal.md#storeproductslistres)\>

**`description`** Retrieves a list of products

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `query?` | [`StoreGetProductsParams`](internal.StoreGetProductsParams.md) | is optional. Can contain a limit and offset for the returned list |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreProductsListRes`](../modules/internal.md#storeproductslistres)\>

#### Defined in

[packages/medusa-js/src/resources/products.ts:47](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/products.ts#L47)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreProductsRes`](../modules/internal.md#storeproductsres)\>

**`description`** Retrieves a single Product

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | is required |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreProductsRes`](../modules/internal.md#storeproductsres)\>

#### Defined in

[packages/medusa-js/src/resources/products.ts:22](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/products.ts#L22)

___

### search

▸ **search**(`searchOptions`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StorePostSearchRes`](../modules/internal.md#storepostsearchres)\>

**`description`** Searches for products

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `searchOptions` | [`StorePostSearchReq`](internal.StorePostSearchReq.md) | is required |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StorePostSearchRes`](../modules/internal.md#storepostsearchres)\>

#### Defined in

[packages/medusa-js/src/resources/products.ts:33](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/products.ts#L33)
