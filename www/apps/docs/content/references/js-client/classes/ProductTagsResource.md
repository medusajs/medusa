---
displayed_sidebar: jsClientSidebar
---

# Class: ProductTagsResource

## Hierarchy

- `default`

  ↳ **`ProductTagsResource`**

## Methods

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`StoreProductTagsListRes`](../modules/internal-8.internal.md#storeproducttagslistres)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `query?` | [`StoreGetProductTagsParams`](internal-8.internal.StoreGetProductTagsParams.md) | is optional. Can contain a limit and offset for the returned list |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`StoreProductTagsListRes`](../modules/internal-8.internal.md#storeproducttagslistres)\>

**`Description`**

Retrieves a list of product tags

#### Defined in

[packages/medusa-js/src/resources/product-tags.ts:16](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/product-tags.ts#L16)
