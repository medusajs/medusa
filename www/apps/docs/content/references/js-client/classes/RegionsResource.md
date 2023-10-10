---
displayed_sidebar: jsClientSidebar
---

# Class: RegionsResource

## Hierarchy

- `default`

  ↳ **`RegionsResource`**

## Methods

### list

▸ **list**(`customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`StoreRegionsListRes`](../modules/internal-8.internal.md#storeregionslistres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`StoreRegionsListRes`](../modules/internal-8.internal.md#storeregionslistres)\>

**`Description`**

Retrieves a list of regions

#### Defined in

[packages/medusa-js/src/resources/regions.ts:11](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/regions.ts#L11)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`StoreRegionsRes`](../modules/internal-8.internal.md#storeregionsres)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | is required |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`StoreRegionsRes`](../modules/internal-8.internal.md#storeregionsres)\>

**`Description`**

Retrieves a region

#### Defined in

[packages/medusa-js/src/resources/regions.ts:22](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/regions.ts#L22)
