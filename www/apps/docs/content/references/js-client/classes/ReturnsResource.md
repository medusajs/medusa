# Class: ReturnsResource

## Hierarchy

- `default`

  ↳ **`ReturnsResource`**

## Methods

### create

▸ **create**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreReturnsRes`](../modules/internal-49.md#storereturnsres)\>

Creates a return request

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | [`StorePostReturnsReq`](internal-49.StorePostReturnsReq.md) | details needed to create a return |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreReturnsRes`](../modules/internal-49.md#storereturnsres)\>

#### Defined in

[medusa-js/src/resources/returns.ts:12](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/returns.ts#L12)
