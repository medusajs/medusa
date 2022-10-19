# Class: ShippingOptionsResource

## Hierarchy

- `default`

  ↳ **`ShippingOptionsResource`**

## Methods

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreShippingOptionsListRes`](../modules/internal-45.md#storeshippingoptionslistres)\>

**`Description`**

Lists shiping options available

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | [`StoreGetShippingOptionsParams`](internal-45.StoreGetShippingOptionsParams.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreShippingOptionsListRes`](../modules/internal-45.md#storeshippingoptionslistres)\>

#### Defined in

[medusa-js/src/resources/shipping-options.ts:27](https://github.com/medusajs/medusa/blob/53e34d33d/packages/medusa-js/src/resources/shipping-options.ts#L27)

___

### listCartOptions

▸ **listCartOptions**(`cart_id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreShippingOptionsListRes`](../modules/internal-45.md#storeshippingoptionslistres)\>

**`Description`**

Lists shiping options available for a cart

#### Parameters

| Name | Type |
| :------ | :------ |
| `cart_id` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreShippingOptionsListRes`](../modules/internal-45.md#storeshippingoptionslistres)\>

#### Defined in

[medusa-js/src/resources/shipping-options.ts:16](https://github.com/medusajs/medusa/blob/53e34d33d/packages/medusa-js/src/resources/shipping-options.ts#L16)
