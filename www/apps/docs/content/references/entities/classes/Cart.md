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

[models/cart.ts:288](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/cart.ts#L288)

___

### billing\_address\_id

• **billing\_address\_id**: `string`

#### Defined in

[models/cart.ts:282](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/cart.ts#L282)

___

### completed\_at

• **completed\_at**: `Date`

#### Defined in

[models/cart.ts:373](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/cart.ts#L373)

___

### context

• **context**: `Record`<`string`, `unknown`\>

#### Defined in

[models/cart.ts:382](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/cart.ts#L382)

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

SoftDeletableEntity.created\_at

#### Defined in

[interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### customer

• **customer**: [`Customer`](Customer.md)

#### Defined in

[models/cart.ts:347](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/cart.ts#L347)

___

### customer\_id

• **customer\_id**: `string`

#### Defined in

[models/cart.ts:343](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/cart.ts#L343)

___

### deleted\_at

• **deleted\_at**: ``null`` \| `Date`

#### Inherited from

SoftDeletableEntity.deleted\_at

#### Defined in

[interfaces/models/soft-deletable-entity.ts:7](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/models/soft-deletable-entity.ts#L7)

___

### discount\_total

• `Optional` **discount\_total**: `number`

#### Defined in

[models/cart.ts:397](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/cart.ts#L397)

___

### discounts

• **discounts**: [`Discount`](Discount.md)[]

#### Defined in

[models/cart.ts:325](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/cart.ts#L325)

___

### email

• **email**: `string`

#### Defined in

[models/cart.ts:278](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/cart.ts#L278)

___

### gift\_card\_tax\_total

• `Optional` **gift\_card\_tax\_total**: `number`

#### Defined in

[models/cart.ts:407](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/cart.ts#L407)

___

### gift\_card\_total

• `Optional` **gift\_card\_total**: `number`

#### Defined in

[models/cart.ts:406](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/cart.ts#L406)

___

### gift\_cards

• **gift\_cards**: [`GiftCard`](GiftCard.md)[]

#### Defined in

[models/cart.ts:339](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/cart.ts#L339)

___

### id

• **id**: `string`

#### Inherited from

SoftDeletableEntity.id

#### Defined in

[interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### idempotency\_key

• **idempotency\_key**: `string`

#### Defined in

[models/cart.ts:379](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/cart.ts#L379)

___

### item\_tax\_total

• `Optional` **item\_tax\_total**: ``null`` \| `number`

#### Defined in

[models/cart.ts:399](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/cart.ts#L399)

___

### items

• **items**: [`LineItem`](LineItem.md)[]

#### Defined in

[models/cart.ts:303](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/cart.ts#L303)

___

### metadata

• **metadata**: `Record`<`string`, `unknown`\>

#### Defined in

[models/cart.ts:385](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/cart.ts#L385)

___

### object

• `Readonly` **object**: ``"cart"``

#### Defined in

[models/cart.ts:275](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/cart.ts#L275)

___

### payment

• **payment**: [`Payment`](Payment.md)

#### Defined in

[models/cart.ts:362](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/cart.ts#L362)

___

### payment\_authorized\_at

• **payment\_authorized\_at**: `Date`

#### Defined in

[models/cart.ts:376](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/cart.ts#L376)

___

### payment\_id

• **payment\_id**: `string`

#### Defined in

[models/cart.ts:358](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/cart.ts#L358)

___

### payment\_session

• **payment\_session**: ``null`` \| [`PaymentSession`](PaymentSession.md)

#### Defined in

[models/cart.ts:349](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/cart.ts#L349)

___

### payment\_sessions

• **payment\_sessions**: [`PaymentSession`](PaymentSession.md)[]

#### Defined in

[models/cart.ts:354](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/cart.ts#L354)

___

### raw\_discount\_total

• `Optional` **raw\_discount\_total**: `number`

#### Defined in

[models/cart.ts:398](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/cart.ts#L398)

___

### refundable\_amount

• `Optional` **refundable\_amount**: `number`

#### Defined in

[models/cart.ts:405](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/cart.ts#L405)

___

### refunded\_total

• `Optional` **refunded\_total**: `number`

#### Defined in

[models/cart.ts:402](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/cart.ts#L402)

___

### region

• **region**: [`Region`](Region.md)

#### Defined in

[models/cart.ts:311](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/cart.ts#L311)

___

### region\_id

• **region\_id**: `string`

#### Defined in

[models/cart.ts:307](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/cart.ts#L307)

___

### sales\_channel

• **sales\_channel**: [`SalesChannel`](SalesChannel.md)

#### Defined in

[models/cart.ts:394](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/cart.ts#L394)

___

### sales\_channel\_id

• **sales\_channel\_id**: ``null`` \| `string`

#### Defined in

[models/cart.ts:388](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/cart.ts#L388)

___

### shipping\_address

• **shipping\_address**: ``null`` \| [`Address`](Address.md)

#### Defined in

[models/cart.ts:298](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/cart.ts#L298)

___

### shipping\_address\_id

• **shipping\_address\_id**: `string`

#### Defined in

[models/cart.ts:292](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/cart.ts#L292)

___

### shipping\_methods

• **shipping\_methods**: [`ShippingMethod`](ShippingMethod.md)[]

#### Defined in

[models/cart.ts:367](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/cart.ts#L367)

___

### shipping\_tax\_total

• `Optional` **shipping\_tax\_total**: ``null`` \| `number`

#### Defined in

[models/cart.ts:400](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/cart.ts#L400)

___

### shipping\_total

• `Optional` **shipping\_total**: `number`

#### Defined in

[models/cart.ts:396](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/cart.ts#L396)

___

### subtotal

• `Optional` **subtotal**: `number`

#### Defined in

[models/cart.ts:404](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/cart.ts#L404)

___

### tax\_total

• `Optional` **tax\_total**: ``null`` \| `number`

#### Defined in

[models/cart.ts:401](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/cart.ts#L401)

___

### total

• `Optional` **total**: `number`

#### Defined in

[models/cart.ts:403](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/cart.ts#L403)

___

### type

• **type**: [`CartType`](../enums/CartType.md)

#### Defined in

[models/cart.ts:370](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/cart.ts#L370)

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

SoftDeletableEntity.updated\_at

#### Defined in

[interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/models/base-entity.ts#L19)

## Methods

### afterLoad

▸ `Private` **afterLoad**(): `void`

#### Returns

`void`

#### Defined in

[models/cart.ts:410](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/cart.ts#L410)

___

### beforeInsert

▸ `Private` **beforeInsert**(): `void`

#### Returns

`void`

#### Defined in

[models/cart.ts:417](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/cart.ts#L417)
