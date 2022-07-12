# Class: RegionsResource

## Hierarchy

- `default`

  ↳ **`RegionsResource`**

## Methods

### list

▸ **list**(`customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreRegionsListRes`](../modules/internal.md#storeregionslistres)\>

**`description`** Retrieves a list of regions

#### Parameters

| Name | Type |
| :------ | :------ |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreRegionsListRes`](../modules/internal.md#storeregionslistres)\>

#### Defined in

[packages/medusa-js/src/resources/regions.ts:11](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/regions.ts#L11)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreRegionsRes`](../modules/internal.md#storeregionsres)\>

**`description`** Retrieves a region

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | is required |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreRegionsRes`](../modules/internal.md#storeregionsres)\>

#### Defined in

[packages/medusa-js/src/resources/regions.ts:22](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/regions.ts#L22)
