# Class: ProductsResource

## Hierarchy

- `default`

  ↳ **`ProductsResource`**

## Properties

### variants

• **variants**: [`ProductVariantsResource`](ProductVariantsResource.md)

#### Defined in

[products.ts:14](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/products.ts#L14)

## Methods

### list

▸ **list**(`query?`, `customHeaders?`): `ResponsePromise`<`StoreProductsListRes`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `query?` | `StoreGetProductsParams` | is optional. Can contain a limit and offset for the returned list |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`StoreProductsListRes`\>

**`Description`**

Retrieves a list of products

#### Defined in

[products.ts:50](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/products.ts#L50)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): `ResponsePromise`<`StoreProductsRes`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | is required |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`StoreProductsRes`\>

**`Description`**

Retrieves a single Product

#### Defined in

[products.ts:22](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/products.ts#L22)

___

### search

▸ **search**(`searchOptions`, `customHeaders?`): `ResponsePromise`<`StorePostSearchRes`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `searchOptions` | `StorePostSearchReq` | is required |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`StorePostSearchRes`\>

**`Description`**

Searches for products

#### Defined in

[products.ts:36](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/products.ts#L36)
