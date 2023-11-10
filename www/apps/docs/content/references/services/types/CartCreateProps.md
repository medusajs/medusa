# CartCreateProps

 **CartCreateProps**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `billing_address?` | [`Partial`](Partial.md)<[`AddressPayload`](../classes/AddressPayload.md)\> | - |
| `billing_address_id?` | `string` | - |
| `context?` | `object` | - |
| `country_code?` | `string` | - |
| `customer_id?` | `string` | - |
| `discounts?` | [`Discount`](../classes/Discount-1.md)[] | - |
| `email?` | `string` | - |
| `gift_cards?` | [`GiftCard`](../classes/GiftCard-1.md)[] | - |
| `metadata?` | Record<`string`, `unknown`\> | - |
| `region?` | [`Region`](../classes/Region.md) | A region holds settings specific to a geographical location, including the currency, tax rates, and fulfillment and payment providers. A Region can consist of multiple countries to accomodate common shopping settings across countries. |
| `region_id?` | `string` | - |
| `sales_channel_id?` | `string` | - |
| `shipping_address?` | [`Partial`](Partial.md)<[`AddressPayload`](../classes/AddressPayload.md)\> | - |
| `shipping_address_id?` | `string` | - |
| `type?` | [`CartType`](../enums/CartType.md) | - |

#### Defined in

[packages/medusa/src/types/cart.ts:53](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/types/cart.ts#L53)
