---
displayed_sidebar: jsClientSidebar
---

# Class: ProductTypesResource

## Hierarchy

- `default`

  ↳ **`ProductTypesResource`**

## Methods

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`StoreProductTypesListRes`](../modules/internal-8.internal.md#storeproducttypeslistres)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `query?` | [`StoreGetProductTypesParams`](internal-8.internal.StoreGetProductTypesParams.md) | is optional. Can contain a limit and offset for the returned list |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`StoreProductTypesListRes`](../modules/internal-8.internal.md#storeproducttypeslistres)\>

**`Description`**

Retrieves a list of product types

#### Defined in

[packages/medusa-js/src/resources/product-types.ts:16](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/product-types.ts#L16)
