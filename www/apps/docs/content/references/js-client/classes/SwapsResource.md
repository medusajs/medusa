---
displayed_sidebar: jsClientSidebar
---

# Class: SwapsResource

## Hierarchy

- `default`

  ↳ **`SwapsResource`**

## Methods

### create

▸ **create**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`StoreSwapsRes`](../modules/internal-8.internal.md#storeswapsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`StorePostSwapsReq`](internal-8.internal.StorePostSwapsReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`StoreSwapsRes`](../modules/internal-8.internal.md#storeswapsres)\>

**`Description`**

Creates a swap from a cart

#### Defined in

[packages/medusa-js/src/resources/swaps.ts:12](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/swaps.ts#L12)

___

### retrieveByCartId

▸ **retrieveByCartId**(`cart_id`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`StoreSwapsRes`](../modules/internal-8.internal.md#storeswapsres)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cart_id` | `string` | id of cart |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`StoreSwapsRes`](../modules/internal-8.internal.md#storeswapsres)\>

**`Description`**

Retrieves a swap by cart id

#### Defined in

[packages/medusa-js/src/resources/swaps.ts:23](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/swaps.ts#L23)
