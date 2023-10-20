---
displayed_sidebar: jsClientSidebar
---

# Class: ReturnsResource

## Hierarchy

- `default`

  ↳ **`ReturnsResource`**

## Methods

### create

▸ **create**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`StoreReturnsRes`](../modules/internal-8.internal.md#storereturnsres)\>

Creates a return request

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | [`StorePostReturnsReq`](internal-8.internal.StorePostReturnsReq.md) | details needed to create a return |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`StoreReturnsRes`](../modules/internal-8.internal.md#storereturnsres)\>

#### Defined in

[packages/medusa-js/src/resources/returns.ts:12](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/returns.ts#L12)
