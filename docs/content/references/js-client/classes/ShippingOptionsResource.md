# Class: ShippingOptionsResource

## Hierarchy

- `default`

  ↳ **`ShippingOptionsResource`**

## Methods

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreShippingOptionsListRes`](../modules/internal.md#storeshippingoptionslistres)\>

**`description`** Lists shiping options available

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | [`StoreGetShippingOptionsParams`](internal.StoreGetShippingOptionsParams.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreShippingOptionsListRes`](../modules/internal.md#storeshippingoptionslistres)\>

#### Defined in

[packages/medusa-js/src/resources/shipping-options.ts:27](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/shipping-options.ts#L27)

___

### listCartOptions

▸ **listCartOptions**(`cart_id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreShippingOptionsListRes`](../modules/internal.md#storeshippingoptionslistres)\>

**`description`** Lists shiping options available for a cart

#### Parameters

| Name | Type |
| :------ | :------ |
| `cart_id` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreShippingOptionsListRes`](../modules/internal.md#storeshippingoptionslistres)\>

#### Defined in

[packages/medusa-js/src/resources/shipping-options.ts:16](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/shipping-options.ts#L16)
