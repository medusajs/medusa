# Class: SwapsResource

## Hierarchy

- `default`

  ↳ **`SwapsResource`**

## Methods

### create

▸ **create**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreSwapsRes`](../modules/internal.md#storeswapsres)\>

**`description`** Creates a swap from a cart

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`StorePostSwapsReq`](internal.StorePostSwapsReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreSwapsRes`](../modules/internal.md#storeswapsres)\>

#### Defined in

[packages/medusa-js/src/resources/swaps.ts:12](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/swaps.ts#L12)

___

### retrieveByCartId

▸ **retrieveByCartId**(`cart_id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreSwapsRes`](../modules/internal.md#storeswapsres)\>

**`description`** Retrieves a swap by cart id

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cart_id` | `string` | id of cart |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreSwapsRes`](../modules/internal.md#storeswapsres)\>

#### Defined in

[packages/medusa-js/src/resources/swaps.ts:23](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/swaps.ts#L23)
