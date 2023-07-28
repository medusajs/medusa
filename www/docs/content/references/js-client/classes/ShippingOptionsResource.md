# Class: ShippingOptionsResource

## Hierarchy

- `default`

  ↳ **`ShippingOptionsResource`**

## Methods

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreShippingOptionsListRes`](../modules/internal-50.md#storeshippingoptionslistres)\>

**`Description`**

Lists shiping options available

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | [`StoreGetShippingOptionsParams`](internal-50.StoreGetShippingOptionsParams.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreShippingOptionsListRes`](../modules/internal-50.md#storeshippingoptionslistres)\>

#### Defined in

[medusa-js/src/resources/shipping-options.ts:27](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/shipping-options.ts#L27)

___

### listCartOptions

▸ **listCartOptions**(`cart_id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreShippingOptionsListRes`](../modules/internal-50.md#storeshippingoptionslistres)\>

**`Description`**

Lists shiping options available for a cart

#### Parameters

| Name | Type |
| :------ | :------ |
| `cart_id` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreShippingOptionsListRes`](../modules/internal-50.md#storeshippingoptionslistres)\>

#### Defined in

[medusa-js/src/resources/shipping-options.ts:16](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/shipping-options.ts#L16)
