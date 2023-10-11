---
displayed_sidebar: jsClientSidebar
---

# Class: Cart

[internal](../modules/internal-3.md).Cart

Base abstract entity for all entities

## Hierarchy

- [`SoftDeletableEntity`](internal-1.SoftDeletableEntity.md)

  ↳ **`Cart`**

## Properties

### afterLoad

• `Private` **afterLoad**: `any`

#### Defined in

packages/medusa/dist/models/cart.d.ts:289

___

### beforeInsert

• `Private` **beforeInsert**: `any`

#### Defined in

packages/medusa/dist/models/cart.d.ts:290

___

### billing\_address

• **billing\_address**: [`Address`](internal-3.Address.md)

#### Defined in

packages/medusa/dist/models/cart.d.ts:254

___

### billing\_address\_id

• **billing\_address\_id**: `string`

#### Defined in

packages/medusa/dist/models/cart.d.ts:253

___

### completed\_at

• **completed\_at**: `Date`

#### Defined in

packages/medusa/dist/models/cart.d.ts:270

___

### context

• **context**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/models/cart.d.ts:273

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

[SoftDeletableEntity](internal-1.SoftDeletableEntity.md).[created_at](internal-1.SoftDeletableEntity.md#created_at)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:6

___

### customer

• **customer**: [`Customer`](internal-3.Customer.md)

#### Defined in

packages/medusa/dist/models/cart.d.ts:263

___

### customer\_id

• **customer\_id**: `string`

#### Defined in

packages/medusa/dist/models/cart.d.ts:262

___

### deleted\_at

• **deleted\_at**: ``null`` \| `Date`

#### Inherited from

[SoftDeletableEntity](internal-1.SoftDeletableEntity.md).[deleted_at](internal-1.SoftDeletableEntity.md#deleted_at)

#### Defined in

packages/medusa/dist/interfaces/models/soft-deletable-entity.d.ts:3

___

### discount\_total

• `Optional` **discount\_total**: `number`

#### Defined in

packages/medusa/dist/models/cart.d.ts:278

___

### discounts

• **discounts**: [`Discount`](internal-3.Discount.md)[]

#### Defined in

packages/medusa/dist/models/cart.d.ts:260

___

### email

• **email**: `string`

#### Defined in

packages/medusa/dist/models/cart.d.ts:252

___

### gift\_card\_tax\_total

• `Optional` **gift\_card\_tax\_total**: `number`

#### Defined in

packages/medusa/dist/models/cart.d.ts:288

___

### gift\_card\_total

• `Optional` **gift\_card\_total**: `number`

#### Defined in

packages/medusa/dist/models/cart.d.ts:287

___

### gift\_cards

• **gift\_cards**: [`GiftCard`](internal-3.GiftCard.md)[]

#### Defined in

packages/medusa/dist/models/cart.d.ts:261

___

### id

• **id**: `string`

#### Inherited from

[SoftDeletableEntity](internal-1.SoftDeletableEntity.md).[id](internal-1.SoftDeletableEntity.md#id)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:5

___

### idempotency\_key

• **idempotency\_key**: `string`

#### Defined in

packages/medusa/dist/models/cart.d.ts:272

___

### item\_tax\_total

• `Optional` **item\_tax\_total**: ``null`` \| `number`

#### Defined in

packages/medusa/dist/models/cart.d.ts:280

___

### items

• **items**: [`LineItem`](internal-3.LineItem.md)[]

#### Defined in

packages/medusa/dist/models/cart.d.ts:257

___

### metadata

• **metadata**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/models/cart.d.ts:274

___

### object

• `Readonly` **object**: ``"cart"``

#### Defined in

packages/medusa/dist/models/cart.d.ts:251

___

### payment

• **payment**: [`Payment`](internal-3.Payment.md)

#### Defined in

packages/medusa/dist/models/cart.d.ts:267

___

### payment\_authorized\_at

• **payment\_authorized\_at**: `Date`

#### Defined in

packages/medusa/dist/models/cart.d.ts:271

___

### payment\_id

• **payment\_id**: `string`

#### Defined in

packages/medusa/dist/models/cart.d.ts:266

___

### payment\_session

• **payment\_session**: ``null`` \| [`PaymentSession`](internal-3.PaymentSession.md)

#### Defined in

packages/medusa/dist/models/cart.d.ts:264

___

### payment\_sessions

• **payment\_sessions**: [`PaymentSession`](internal-3.PaymentSession.md)[]

#### Defined in

packages/medusa/dist/models/cart.d.ts:265

___

### raw\_discount\_total

• `Optional` **raw\_discount\_total**: `number`

#### Defined in

packages/medusa/dist/models/cart.d.ts:279

___

### refundable\_amount

• `Optional` **refundable\_amount**: `number`

#### Defined in

packages/medusa/dist/models/cart.d.ts:286

___

### refunded\_total

• `Optional` **refunded\_total**: `number`

#### Defined in

packages/medusa/dist/models/cart.d.ts:283

___

### region

• **region**: [`Region`](internal-3.Region.md)

#### Defined in

packages/medusa/dist/models/cart.d.ts:259

___

### region\_id

• **region\_id**: `string`

#### Defined in

packages/medusa/dist/models/cart.d.ts:258

___

### sales\_channel

• **sales\_channel**: [`SalesChannel`](internal-3.SalesChannel.md)

#### Defined in

packages/medusa/dist/models/cart.d.ts:276

___

### sales\_channel\_id

• **sales\_channel\_id**: ``null`` \| `string`

#### Defined in

packages/medusa/dist/models/cart.d.ts:275

___

### shipping\_address

• **shipping\_address**: ``null`` \| [`Address`](internal-3.Address.md)

#### Defined in

packages/medusa/dist/models/cart.d.ts:256

___

### shipping\_address\_id

• **shipping\_address\_id**: `string`

#### Defined in

packages/medusa/dist/models/cart.d.ts:255

___

### shipping\_methods

• **shipping\_methods**: [`ShippingMethod`](internal-3.ShippingMethod.md)[]

#### Defined in

packages/medusa/dist/models/cart.d.ts:268

___

### shipping\_tax\_total

• `Optional` **shipping\_tax\_total**: ``null`` \| `number`

#### Defined in

packages/medusa/dist/models/cart.d.ts:281

___

### shipping\_total

• `Optional` **shipping\_total**: `number`

#### Defined in

packages/medusa/dist/models/cart.d.ts:277

___

### subtotal

• `Optional` **subtotal**: `number`

#### Defined in

packages/medusa/dist/models/cart.d.ts:285

___

### tax\_total

• `Optional` **tax\_total**: ``null`` \| `number`

#### Defined in

packages/medusa/dist/models/cart.d.ts:282

___

### total

• `Optional` **total**: `number`

#### Defined in

packages/medusa/dist/models/cart.d.ts:284

___

### type

• **type**: [`CartType`](../enums/internal-3.CartType.md)

#### Defined in

packages/medusa/dist/models/cart.d.ts:269

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

[SoftDeletableEntity](internal-1.SoftDeletableEntity.md).[updated_at](internal-1.SoftDeletableEntity.md#updated_at)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:7
