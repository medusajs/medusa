# Class: ProductVariantsResource

## Hierarchy

- `default`

  ↳ **`ProductVariantsResource`**

## Methods

### list

▸ **list**(`query?`, `customHeaders?`): `ResponsePromise`<`StoreVariantsListRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | `StoreGetVariantsParams` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`StoreVariantsListRes`\>

**`Description`**

Retrieves a list of of Product Variants

#### Defined in

[product-variants.ts:28](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/product-variants.ts#L28)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): `ResponsePromise`<`StoreVariantsRes`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | is required |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`StoreVariantsRes`\>

**`Description`**

Retrieves a single product variant

#### Defined in

[product-variants.ts:17](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/product-variants.ts#L17)
