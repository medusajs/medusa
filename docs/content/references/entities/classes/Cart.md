---
displayed_sidebar: entitiesSidebar
---

# Class: Cart

## Hierarchy

- `SoftDeletableEntity`

  ↳ **`Cart`**

## Constructors

### constructor

• **new Cart**()

#### Inherited from

SoftDeletableEntity.constructor

## Properties

### billing\_address

• **billing\_address**: [`Address`](Address.md)

#### Defined in

[models/cart.ts:226](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/cart.ts#L226)

___

### billing\_address\_id

• **billing\_address\_id**: `string`

#### Defined in

[models/cart.ts:220](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/cart.ts#L220)

___

### completed\_at

• **completed\_at**: `Date`

#### Defined in

[models/cart.ts:311](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/cart.ts#L311)

___

### context

• **context**: `Record`<`string`, `unknown`\>

#### Defined in

[models/cart.ts:320](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/cart.ts#L320)

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

SoftDeletableEntity.created\_at

#### Defined in

[interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### customer

• **customer**: [`Customer`](Customer.md)

#### Defined in

[models/cart.ts:285](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/cart.ts#L285)

___

### customer\_id

• **customer\_id**: `string`

#### Defined in

[models/cart.ts:281](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/cart.ts#L281)

___

### deleted\_at

• **deleted\_at**: ``null`` \| `Date`

#### Inherited from

SoftDeletableEntity.deleted\_at

#### Defined in

[interfaces/models/soft-deletable-entity.ts:7](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/soft-deletable-entity.ts#L7)

___

### discount\_total

• `Optional` **discount\_total**: `number`

#### Defined in

[models/cart.ts:335](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/cart.ts#L335)

___

### discounts

• **discounts**: [`Discount`](Discount.md)[]

#### Defined in

[models/cart.ts:263](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/cart.ts#L263)

___

### email

• **email**: `string`

#### Defined in

[models/cart.ts:216](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/cart.ts#L216)

___

### gift\_card\_tax\_total

• `Optional` **gift\_card\_tax\_total**: `number`

#### Defined in

[models/cart.ts:344](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/cart.ts#L344)

___

### gift\_card\_total

• `Optional` **gift\_card\_total**: `number`

#### Defined in

[models/cart.ts:343](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/cart.ts#L343)

___

### gift\_cards

• **gift\_cards**: [`GiftCard`](GiftCard.md)[]

#### Defined in

[models/cart.ts:277](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/cart.ts#L277)

___

### id

• **id**: `string`

#### Inherited from

SoftDeletableEntity.id

#### Defined in

[interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### idempotency\_key

• **idempotency\_key**: `string`

#### Defined in

[models/cart.ts:317](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/cart.ts#L317)

___

### item\_tax\_total

• `Optional` **item\_tax\_total**: ``null`` \| `number`

#### Defined in

[models/cart.ts:336](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/cart.ts#L336)

___

### items

• **items**: [`LineItem`](LineItem.md)[]

#### Defined in

[models/cart.ts:241](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/cart.ts#L241)

___

### metadata

• **metadata**: `Record`<`string`, `unknown`\>

#### Defined in

[models/cart.ts:323](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/cart.ts#L323)

___

### object

• `Readonly` **object**: ``"cart"``

#### Defined in

[models/cart.ts:213](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/cart.ts#L213)

___

### payment

• **payment**: [`Payment`](Payment.md)

#### Defined in

[models/cart.ts:300](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/cart.ts#L300)

___

### payment\_authorized\_at

• **payment\_authorized\_at**: `Date`

#### Defined in

[models/cart.ts:314](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/cart.ts#L314)

___

### payment\_id

• **payment\_id**: `string`

#### Defined in

[models/cart.ts:296](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/cart.ts#L296)

___

### payment\_session

• **payment\_session**: ``null`` \| [`PaymentSession`](PaymentSession.md)

#### Defined in

[models/cart.ts:287](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/cart.ts#L287)

___

### payment\_sessions

• **payment\_sessions**: [`PaymentSession`](PaymentSession.md)[]

#### Defined in

[models/cart.ts:292](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/cart.ts#L292)

___

### refundable\_amount

• `Optional` **refundable\_amount**: `number`

#### Defined in

[models/cart.ts:342](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/cart.ts#L342)

___

### refunded\_total

• `Optional` **refunded\_total**: `number`

#### Defined in

[models/cart.ts:339](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/cart.ts#L339)

___

### region

• **region**: [`Region`](Region.md)

#### Defined in

[models/cart.ts:249](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/cart.ts#L249)

___

### region\_id

• **region\_id**: `string`

#### Defined in

[models/cart.ts:245](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/cart.ts#L245)

___

### sales\_channel

• **sales\_channel**: [`SalesChannel`](SalesChannel.md)

#### Defined in

[models/cart.ts:332](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/cart.ts#L332)

___

### sales\_channel\_id

• **sales\_channel\_id**: ``null`` \| `string`

#### Defined in

[models/cart.ts:326](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/cart.ts#L326)

___

### shipping\_address

• **shipping\_address**: ``null`` \| [`Address`](Address.md)

#### Defined in

[models/cart.ts:236](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/cart.ts#L236)

___

### shipping\_address\_id

• **shipping\_address\_id**: `string`

#### Defined in

[models/cart.ts:230](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/cart.ts#L230)

___

### shipping\_methods

• **shipping\_methods**: [`ShippingMethod`](ShippingMethod.md)[]

#### Defined in

[models/cart.ts:305](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/cart.ts#L305)

___

### shipping\_tax\_total

• `Optional` **shipping\_tax\_total**: ``null`` \| `number`

#### Defined in

[models/cart.ts:337](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/cart.ts#L337)

___

### shipping\_total

• `Optional` **shipping\_total**: `number`

#### Defined in

[models/cart.ts:334](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/cart.ts#L334)

___

### subtotal

• `Optional` **subtotal**: `number`

#### Defined in

[models/cart.ts:341](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/cart.ts#L341)

___

### tax\_total

• `Optional` **tax\_total**: ``null`` \| `number`

#### Defined in

[models/cart.ts:338](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/cart.ts#L338)

___

### total

• `Optional` **total**: `number`

#### Defined in

[models/cart.ts:340](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/cart.ts#L340)

___

### type

• **type**: [`CartType`](../enums/CartType.md)

#### Defined in

[models/cart.ts:308](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/cart.ts#L308)

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

SoftDeletableEntity.updated\_at

#### Defined in

[interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L19)

## Methods

### afterLoad

▸ `Private` **afterLoad**(): `void`

#### Returns

`void`

#### Defined in

[models/cart.ts:346](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/cart.ts#L346)

___

### beforeInsert

▸ `Private` **beforeInsert**(): `void`

#### Returns

`void`

#### Defined in

[models/cart.ts:353](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/cart.ts#L353)
