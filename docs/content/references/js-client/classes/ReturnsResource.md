# Class: ReturnsResource

## Hierarchy

- `default`

  ↳ **`ReturnsResource`**

## Methods

### create

▸ **create**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreReturnsRes`](../modules/internal.md#storereturnsres)\>

Creates a return request

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | [`StorePostReturnsReq`](internal.StorePostReturnsReq.md) | details needed to create a return |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreReturnsRes`](../modules/internal.md#storereturnsres)\>

#### Defined in

[packages/medusa-js/src/resources/returns.ts:12](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/returns.ts#L12)
