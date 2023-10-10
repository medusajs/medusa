---
displayed_sidebar: jsClientSidebar
---

# Class: AdminVariantsResource

## Hierarchy

- `default`

  ↳ **`AdminVariantsResource`**

## Methods

### getInventory

▸ **getInventory**(`variantId`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminGetVariantsVariantInventoryRes`](../modules/internal-8.internal.md#admingetvariantsvariantinventoryres)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variantId` | `string` | id of the variant to fetch inventory for |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> | custom headers |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminGetVariantsVariantInventoryRes`](../modules/internal-8.internal.md#admingetvariantsvariantinventoryres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/variants.ts:60](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/variants.ts#L60)

___

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminVariantsListRes`](../modules/internal-8.internal.md#adminvariantslistres)\>

List product variants

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `query?` | [`AdminGetVariantsParams`](internal-8.internal.AdminGetVariantsParams.md) | Query to filter variants by |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> | custom headers |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminVariantsListRes`](../modules/internal-8.internal.md#adminvariantslistres)\>

A list of variants satisfying the criteria of the query

#### Defined in

[packages/medusa-js/src/resources/admin/variants.ts:19](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/variants.ts#L19)

___

### retrieve

▸ **retrieve**(`id`, `query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminVariantsRes`](../modules/internal-8.internal.md#adminvariantsres)\>

Get a product variant

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | Query to filter variants by |
| `query?` | [`AdminGetVariantParams`](internal-8.internal.AdminGetVariantParams.md) | - |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> | custom headers |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminVariantsRes`](../modules/internal-8.internal.md#adminvariantsres)\>

A list of variants satisfying the criteria of the query

#### Defined in

[packages/medusa-js/src/resources/admin/variants.ts:39](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/variants.ts#L39)
