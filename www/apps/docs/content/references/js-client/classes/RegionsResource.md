# Class: RegionsResource

## Hierarchy

- `default`

  ↳ **`RegionsResource`**

## Methods

### list

▸ **list**(`customHeaders?`): `ResponsePromise`<`StoreRegionsListRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`StoreRegionsListRes`\>

**`Description`**

Retrieves a list of regions

#### Defined in

[regions.ts:11](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/regions.ts#L11)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): `ResponsePromise`<`StoreRegionsRes`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | is required |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`StoreRegionsRes`\>

**`Description`**

Retrieves a region

#### Defined in

[regions.ts:22](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/regions.ts#L22)
