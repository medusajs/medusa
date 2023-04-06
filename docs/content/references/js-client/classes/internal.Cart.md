---
displayed_sidebar: jsClientSidebar
---

# Class: Cart

[internal](../modules/internal.md).Cart

Base abstract entity for all entities

## Hierarchy

- [`SoftDeletableEntity`](internal.SoftDeletableEntity.md)

  ↳ **`Cart`**

## Properties

### afterLoad

• `Private` **afterLoad**: `any`

#### Defined in

medusa/dist/models/cart.d.ts:227

___

### beforeInsert

• `Private` **beforeInsert**: `any`

#### Defined in

medusa/dist/models/cart.d.ts:228

___

### billing\_address

• **billing\_address**: [`Address`](internal.Address.md)

#### Defined in

medusa/dist/models/cart.d.ts:193

___

### billing\_address\_id

• **billing\_address\_id**: `string`

#### Defined in

medusa/dist/models/cart.d.ts:192

___

### completed\_at

• **completed\_at**: `Date`

#### Defined in

medusa/dist/models/cart.d.ts:209

___

### context

• **context**: `Record`<`string`, `unknown`\>

#### Defined in

medusa/dist/models/cart.d.ts:212

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

[SoftDeletableEntity](internal.SoftDeletableEntity.md).[created_at](internal.SoftDeletableEntity.md#created_at)

#### Defined in

medusa/dist/interfaces/models/base-entity.d.ts:6

___

### customer

• **customer**: [`Customer`](internal.Customer.md)

#### Defined in

medusa/dist/models/cart.d.ts:202

___

### customer\_id

• **customer\_id**: `string`

#### Defined in

medusa/dist/models/cart.d.ts:201

___

### deleted\_at

• **deleted\_at**: ``null`` \| `Date`

#### Inherited from

[SoftDeletableEntity](internal.SoftDeletableEntity.md).[deleted_at](internal.SoftDeletableEntity.md#deleted_at)

#### Defined in

medusa/dist/interfaces/models/soft-deletable-entity.d.ts:3

___

### discount\_total

• `Optional` **discount\_total**: `number`

#### Defined in

medusa/dist/models/cart.d.ts:217

___

### discounts

• **discounts**: [`Discount`](internal.Discount.md)[]

#### Defined in

medusa/dist/models/cart.d.ts:199

___

### email

• **email**: `string`

#### Defined in

medusa/dist/models/cart.d.ts:191

___

### gift\_card\_tax\_total

• `Optional` **gift\_card\_tax\_total**: `number`

#### Defined in

medusa/dist/models/cart.d.ts:226

___

### gift\_card\_total

• `Optional` **gift\_card\_total**: `number`

#### Defined in

medusa/dist/models/cart.d.ts:225

___

### gift\_cards

• **gift\_cards**: [`GiftCard`](internal.GiftCard.md)[]

#### Defined in

medusa/dist/models/cart.d.ts:200

___

### id

• **id**: `string`

#### Inherited from

[SoftDeletableEntity](internal.SoftDeletableEntity.md).[id](internal.SoftDeletableEntity.md#id)

#### Defined in

medusa/dist/interfaces/models/base-entity.d.ts:5

___

### idempotency\_key

• **idempotency\_key**: `string`

#### Defined in

medusa/dist/models/cart.d.ts:211

___

### item\_tax\_total

• `Optional` **item\_tax\_total**: ``null`` \| `number`

#### Defined in

medusa/dist/models/cart.d.ts:218

___

### items

• **items**: [`LineItem`](internal.LineItem.md)[]

#### Defined in

medusa/dist/models/cart.d.ts:196

___

### metadata

• **metadata**: `Record`<`string`, `unknown`\>

#### Defined in

medusa/dist/models/cart.d.ts:213

___

### object

• `Readonly` **object**: ``"cart"``

#### Defined in

medusa/dist/models/cart.d.ts:190

___

### payment

• **payment**: [`Payment`](internal.Payment.md)

#### Defined in

medusa/dist/models/cart.d.ts:206

___

### payment\_authorized\_at

• **payment\_authorized\_at**: `Date`

#### Defined in

medusa/dist/models/cart.d.ts:210

___

### payment\_id

• **payment\_id**: `string`

#### Defined in

medusa/dist/models/cart.d.ts:205

___

### payment\_session

• **payment\_session**: ``null`` \| [`PaymentSession`](internal.PaymentSession.md)

#### Defined in

medusa/dist/models/cart.d.ts:203

___

### payment\_sessions

• **payment\_sessions**: [`PaymentSession`](internal.PaymentSession.md)[]

#### Defined in

medusa/dist/models/cart.d.ts:204

___

### refundable\_amount

• `Optional` **refundable\_amount**: `number`

#### Defined in

medusa/dist/models/cart.d.ts:224

___

### refunded\_total

• `Optional` **refunded\_total**: `number`

#### Defined in

medusa/dist/models/cart.d.ts:221

___

### region

• **region**: [`Region`](internal.Region.md)

#### Defined in

medusa/dist/models/cart.d.ts:198

___

### region\_id

• **region\_id**: `string`

#### Defined in

medusa/dist/models/cart.d.ts:197

___

### sales\_channel

• **sales\_channel**: [`SalesChannel`](internal.SalesChannel.md)

#### Defined in

medusa/dist/models/cart.d.ts:215

___

### sales\_channel\_id

• **sales\_channel\_id**: ``null`` \| `string`

#### Defined in

medusa/dist/models/cart.d.ts:214

___

### shipping\_address

• **shipping\_address**: ``null`` \| [`Address`](internal.Address.md)

#### Defined in

medusa/dist/models/cart.d.ts:195

___

### shipping\_address\_id

• **shipping\_address\_id**: `string`

#### Defined in

medusa/dist/models/cart.d.ts:194

___

### shipping\_methods

• **shipping\_methods**: [`ShippingMethod`](internal.ShippingMethod.md)[]

#### Defined in

medusa/dist/models/cart.d.ts:207

___

### shipping\_tax\_total

• `Optional` **shipping\_tax\_total**: ``null`` \| `number`

#### Defined in

medusa/dist/models/cart.d.ts:219

___

### shipping\_total

• `Optional` **shipping\_total**: `number`

#### Defined in

medusa/dist/models/cart.d.ts:216

___

### subtotal

• `Optional` **subtotal**: `number`

#### Defined in

medusa/dist/models/cart.d.ts:223

___

### tax\_total

• `Optional` **tax\_total**: ``null`` \| `number`

#### Defined in

medusa/dist/models/cart.d.ts:220

___

### total

• `Optional` **total**: `number`

#### Defined in

medusa/dist/models/cart.d.ts:222

___

### type

• **type**: [`CartType`](../enums/internal.CartType.md)

#### Defined in

medusa/dist/models/cart.d.ts:208

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

[SoftDeletableEntity](internal.SoftDeletableEntity.md).[updated_at](internal.SoftDeletableEntity.md#updated_at)

#### Defined in

medusa/dist/interfaces/models/base-entity.d.ts:7
