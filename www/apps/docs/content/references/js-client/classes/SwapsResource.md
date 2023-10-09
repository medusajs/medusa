# Class: SwapsResource

## Hierarchy

- `default`

  ↳ **`SwapsResource`**

## Methods

### create

▸ **create**(`payload`, `customHeaders?`): `ResponsePromise`<`StoreSwapsRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | `StorePostSwapsReq` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`StoreSwapsRes`\>

**`Description`**

Creates a swap from a cart

#### Defined in

[swaps.ts:12](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/swaps.ts#L12)

___

### retrieveByCartId

▸ **retrieveByCartId**(`cart_id`, `customHeaders?`): `ResponsePromise`<`StoreSwapsRes`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cart_id` | `string` | id of cart |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`StoreSwapsRes`\>

**`Description`**

Retrieves a swap by cart id

#### Defined in

[swaps.ts:23](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/swaps.ts#L23)
