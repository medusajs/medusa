# Class: ProductTypesResource

## Hierarchy

- `default`

  ↳ **`ProductTypesResource`**

## Methods

### list

▸ **list**(`query?`, `customHeaders?`): `ResponsePromise`<`StoreProductTypesListRes`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `query?` | `StoreGetProductTypesParams` | is optional. Can contain a limit and offset for the returned list |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`StoreProductTypesListRes`\>

**`Description`**

Retrieves a list of product types

#### Defined in

[product-types.ts:16](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/product-types.ts#L16)
