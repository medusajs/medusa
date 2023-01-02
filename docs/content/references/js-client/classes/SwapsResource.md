# Class: SwapsResource

## Hierarchy

- `default`

  ↳ **`SwapsResource`**

## Methods

### create

▸ **create**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreSwapsRes`](../modules/internal-51.md#storeswapsres)\>

**`Description`**

Creates a swap from a cart

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`StorePostSwapsReq`](internal-51.StorePostSwapsReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreSwapsRes`](../modules/internal-51.md#storeswapsres)\>

#### Defined in

[medusa-js/src/resources/swaps.ts:12](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/swaps.ts#L12)

___

### retrieveByCartId

▸ **retrieveByCartId**(`cart_id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreSwapsRes`](../modules/internal-51.md#storeswapsres)\>

**`Description`**

Retrieves a swap by cart id

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cart_id` | `string` | id of cart |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreSwapsRes`](../modules/internal-51.md#storeswapsres)\>

#### Defined in

[medusa-js/src/resources/swaps.ts:23](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/swaps.ts#L23)
