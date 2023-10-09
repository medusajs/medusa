# Class: ProductTagsResource

## Hierarchy

- `default`

  ↳ **`ProductTagsResource`**

## Methods

### list

▸ **list**(`query?`, `customHeaders?`): `ResponsePromise`<`StoreProductTagsListRes`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `query?` | `StoreGetProductTagsParams` | is optional. Can contain a limit and offset for the returned list |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`StoreProductTagsListRes`\>

**`Description`**

Retrieves a list of product tags

#### Defined in

[product-tags.ts:16](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/product-tags.ts#L16)
