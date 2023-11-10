# GiftCardTransaction

 **GiftCardTransaction**: `Object`

Gift Card Transactions are created once a Customer uses a Gift Card to pay for their Order.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `amount` | `number` | The amount that was used from the Gift Card. |
| `gift_card` | [`GiftCard`](../classes/GiftCard.md) | The details of the gift card associated used in this transaction. |
| `is_taxable` | `boolean` \| ``null`` | Whether the transaction is taxable or not. |
| `tax_rate` | `number` \| ``null`` | The tax rate of the transaction |

#### Defined in

[packages/medusa/src/services/new-totals.ts:38](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/new-totals.ts#L38)
