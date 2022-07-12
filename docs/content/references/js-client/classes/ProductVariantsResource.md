# Class: ProductVariantsResource

## Hierarchy

- `default`

  ↳ **`ProductVariantsResource`**

## Methods

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreVariantsListRes`](../modules/internal.md#storevariantslistres)\>

**`description`** Retrieves a list of of Product Variants

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | [`StoreGetVariantsParams`](internal.StoreGetVariantsParams.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreVariantsListRes`](../modules/internal.md#storevariantslistres)\>

#### Defined in

[packages/medusa-js/src/resources/product-variants.ts:28](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/product-variants.ts#L28)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreVariantsRes`](../modules/internal.md#storevariantsres)\>

**`description`** Retrieves a single product variant

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | is required |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreVariantsRes`](../modules/internal.md#storevariantsres)\>

#### Defined in

[packages/medusa-js/src/resources/product-variants.ts:17](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/product-variants.ts#L17)
