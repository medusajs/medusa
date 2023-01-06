# Class: RegionsResource

## Hierarchy

- `default`

  ↳ **`RegionsResource`**

## Methods

### list

▸ **list**(`customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreRegionsListRes`](../modules/internal-47.md#storeregionslistres)\>

**`Description`**

Retrieves a list of regions

#### Parameters

| Name | Type |
| :------ | :------ |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreRegionsListRes`](../modules/internal-47.md#storeregionslistres)\>

#### Defined in

[medusa-js/src/resources/regions.ts:11](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/regions.ts#L11)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreRegionsRes`](../modules/internal-47.md#storeregionsres)\>

**`Description`**

Retrieves a region

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | is required |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreRegionsRes`](../modules/internal-47.md#storeregionsres)\>

#### Defined in

[medusa-js/src/resources/regions.ts:22](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/regions.ts#L22)
