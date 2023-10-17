---
displayed_sidebar: jsClientSidebar
---

# Class: ProductVariantsResource

## Hierarchy

- `default`

  ↳ **`ProductVariantsResource`**

## Methods

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`StoreVariantsListRes`](../modules/internal-8.internal.md#storevariantslistres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | [`StoreGetVariantsParams`](internal-8.internal.StoreGetVariantsParams.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`StoreVariantsListRes`](../modules/internal-8.internal.md#storevariantslistres)\>

**`Description`**

Retrieves a list of of Product Variants

#### Defined in

[packages/medusa-js/src/resources/product-variants.ts:28](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/product-variants.ts#L28)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`StoreVariantsRes`](../modules/internal-8.internal.md#storevariantsres)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | is required |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`StoreVariantsRes`](../modules/internal-8.internal.md#storevariantsres)\>

**`Description`**

Retrieves a single product variant

#### Defined in

[packages/medusa-js/src/resources/product-variants.ts:17](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/product-variants.ts#L17)
