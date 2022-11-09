# Class: ProductTypesResource

## Hierarchy

- `default`

  ↳ **`ProductTypesResource`**

## Methods

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreProductTypesListRes`](../modules/internal-40.md#storeproducttypeslistres)\>

**`Description`**

Retrieves a list of product types

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `query?` | [`StoreGetProductTypesParams`](internal-40.StoreGetProductTypesParams.md) | is optional. Can contain a limit and offset for the returned list |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreProductTypesListRes`](../modules/internal-40.md#storeproducttypeslistres)\>

#### Defined in

[medusa-js/src/resources/product-types.ts:16](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa-js/src/resources/product-types.ts#L16)
