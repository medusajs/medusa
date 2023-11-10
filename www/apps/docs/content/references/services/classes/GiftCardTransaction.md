# GiftCardTransaction

Gift Card Transactions are created once a Customer uses a Gift Card to pay for their Order.

## Constructors

### constructor

**new GiftCardTransaction**()

Gift Card Transactions are created once a Customer uses a Gift Card to pay for their Order.

## Properties

### amount

 **amount**: `number`

The amount that was used from the Gift Card.

#### Defined in

[packages/medusa/src/models/gift-card-transaction.ts:40](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/gift-card-transaction.ts#L40)

___

### created\_at

 **created\_at**: `Date`

The date with timezone at which the resource was created.

#### Defined in

[packages/medusa/src/models/gift-card-transaction.ts:43](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/gift-card-transaction.ts#L43)

___

### gift\_card

 **gift\_card**: [`GiftCard`](GiftCard.md)

The details of the gift card associated used in this transaction.

#### Defined in

[packages/medusa/src/models/gift-card-transaction.ts:29](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/gift-card-transaction.ts#L29)

___

### gift\_card\_id

 **gift\_card\_id**: `string`

The ID of the Gift Card that was used in the transaction.

#### Defined in

[packages/medusa/src/models/gift-card-transaction.ts:25](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/gift-card-transaction.ts#L25)

___

### id

 **id**: `string`

The gift card transaction's ID

#### Defined in

[packages/medusa/src/models/gift-card-transaction.ts:22](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/gift-card-transaction.ts#L22)

___

### is\_taxable

 **is\_taxable**: `boolean`

Whether the transaction is taxable or not.

#### Defined in

[packages/medusa/src/models/gift-card-transaction.ts:46](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/gift-card-transaction.ts#L46)

___

### order

 **order**: [`Order`](Order.md)

The details of the order that the gift card was used for payment.

#### Defined in

[packages/medusa/src/models/gift-card-transaction.ts:37](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/gift-card-transaction.ts#L37)

___

### order\_id

 **order\_id**: `string`

The ID of the order that the gift card was used for payment.

#### Defined in

[packages/medusa/src/models/gift-card-transaction.ts:33](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/gift-card-transaction.ts#L33)

___

### tax\_rate

 **tax\_rate**: ``null`` \| `number`

The tax rate of the transaction

#### Defined in

[packages/medusa/src/models/gift-card-transaction.ts:49](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/gift-card-transaction.ts#L49)

## Methods

### beforeInsert

`Private` **beforeInsert**(): `void`

#### Returns

`void`

-`void`: (optional) 

#### Defined in

[packages/medusa/src/models/gift-card-transaction.ts:55](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/gift-card-transaction.ts#L55)
