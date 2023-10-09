# Class: ShippingOptionsResource

## Hierarchy

- `default`

  ↳ **`ShippingOptionsResource`**

## Methods

### list

▸ **list**(`query?`, `customHeaders?`): `ResponsePromise`<`StoreShippingOptionsListRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | `StoreGetShippingOptionsParams` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`StoreShippingOptionsListRes`\>

**`Description`**

Lists shipping options available

#### Defined in

[shipping-options.ts:27](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/shipping-options.ts#L27)

___

### listCartOptions

▸ **listCartOptions**(`cart_id`, `customHeaders?`): `ResponsePromise`<`StoreShippingOptionsListRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `cart_id` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`StoreShippingOptionsListRes`\>

**`Description`**

Lists shipping options available for a cart

#### Defined in

[shipping-options.ts:16](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/shipping-options.ts#L16)
