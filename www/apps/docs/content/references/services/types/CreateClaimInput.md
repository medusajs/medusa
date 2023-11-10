# CreateClaimInput

 **CreateClaimInput**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `additional_items?` | [`CreateClaimItemAdditionalItemInput`](CreateClaimItemAdditionalItemInput.md)[] | - |
| `claim_items` | [`CreateClaimItemInput`](CreateClaimItemInput.md)[] | - |
| `claim_order_id?` | `string` | - |
| `metadata?` | Record<`string`, `unknown`\> | - |
| `no_notification?` | `boolean` | - |
| `order` | [`Order`](../classes/Order.md) | An order is a purchase made by a customer. It holds details about payment and fulfillment of the order. An order may also be created from a draft order, which is created by an admin user. |
| `refund_amount?` | `number` | - |
| `return_location_id?` | `string` | - |
| `return_shipping?` | [`CreateClaimReturnShippingInput`](CreateClaimReturnShippingInput.md) | - |
| `shipping_address?` | [`AddressPayload`](../classes/AddressPayload.md) | Address fields used when creating/updating an address. |
| `shipping_address_id?` | `string` | - |
| `shipping_methods?` | [`CreateClaimShippingMethodInput`](CreateClaimShippingMethodInput.md)[] | - |
| `type` | [`ClaimTypeValue`](ClaimTypeValue.md) | - |

#### Defined in

[packages/medusa/src/types/claim.ts:8](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/types/claim.ts#L8)
