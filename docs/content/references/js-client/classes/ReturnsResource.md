# Class: ReturnsResource

## Hierarchy

- `default`

  ↳ **`ReturnsResource`**

## Methods

### create

▸ **create**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreReturnsRes`](../modules/internal-41.md#storereturnsres)\>

Creates a return request

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | [`StorePostReturnsReq`](internal-41.StorePostReturnsReq.md) | details needed to create a return |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreReturnsRes`](../modules/internal-41.md#storereturnsres)\>

#### Defined in

[medusa-js/src/resources/returns.ts:12](https://github.com/medusajs/medusa/blob/e38dd7f6/packages/medusa-js/src/resources/returns.ts#L12)
