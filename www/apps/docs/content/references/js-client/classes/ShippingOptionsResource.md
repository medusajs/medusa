---
displayed_sidebar: jsClientSidebar
---

# Class: ShippingOptionsResource

## Hierarchy

- `default`

  ↳ **`ShippingOptionsResource`**

## Methods

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`StoreShippingOptionsListRes`](../modules/internal-8.internal.md#storeshippingoptionslistres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | [`StoreGetShippingOptionsParams`](internal-8.internal.StoreGetShippingOptionsParams.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`StoreShippingOptionsListRes`](../modules/internal-8.internal.md#storeshippingoptionslistres)\>

**`Description`**

Lists shipping options available

#### Defined in

[packages/medusa-js/src/resources/shipping-options.ts:27](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/shipping-options.ts#L27)

___

### listCartOptions

▸ **listCartOptions**(`cart_id`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`StoreShippingOptionsListRes`](../modules/internal-8.internal.md#storeshippingoptionslistres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `cart_id` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`StoreShippingOptionsListRes`](../modules/internal-8.internal.md#storeshippingoptionslistres)\>

**`Description`**

Lists shipping options available for a cart

#### Defined in

[packages/medusa-js/src/resources/shipping-options.ts:16](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/shipping-options.ts#L16)
