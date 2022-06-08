---
displayed_sidebar: jsClientSidebar
---

# Class: Cart

[internal](../modules/internal.md).Cart

## Hierarchy

- [`SoftDeletableEntity`](internal.SoftDeletableEntity.md)

  ↳ **`Cart`**

## Properties

### afterLoad

• `Private` **afterLoad**: `any`

#### Defined in

packages/medusa/dist/models/cart.d.ts:134

___

### beforeInsert

• `Private` **beforeInsert**: `any`

#### Defined in

packages/medusa/dist/models/cart.d.ts:135

___

### billing\_address

• **billing\_address**: [`Address`](internal.Address.md)

#### Defined in

packages/medusa/dist/models/cart.d.ts:105

___

### billing\_address\_id

• **billing\_address\_id**: `string`

#### Defined in

packages/medusa/dist/models/cart.d.ts:104

___

### completed\_at

• **completed\_at**: [`Date`](../modules/internal.md#date)

#### Defined in

packages/medusa/dist/models/cart.d.ts:121

___

### context

• **context**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/models/cart.d.ts:124

___

### created\_at

• **created\_at**: [`Date`](../modules/internal.md#date)

#### Inherited from

[SoftDeletableEntity](internal.SoftDeletableEntity.md).[created_at](internal.SoftDeletableEntity.md#created_at)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:6

___

### customer

• **customer**: [`Customer`](internal.Customer.md)

#### Defined in

packages/medusa/dist/models/cart.d.ts:114

___

### customer\_id

• **customer\_id**: `string`

#### Defined in

packages/medusa/dist/models/cart.d.ts:113

___

### deleted\_at

• **deleted\_at**: ``null`` \| [`Date`](../modules/internal.md#date)

#### Inherited from

[SoftDeletableEntity](internal.SoftDeletableEntity.md).[deleted_at](internal.SoftDeletableEntity.md#deleted_at)

#### Defined in

packages/medusa/dist/interfaces/models/soft-deletable-entity.d.ts:3

___

### discount\_total

• `Optional` **discount\_total**: `number`

#### Defined in

packages/medusa/dist/models/cart.d.ts:127

___

### discounts

• **discounts**: [`Discount`](internal.Discount.md)[]

#### Defined in

packages/medusa/dist/models/cart.d.ts:111

___

### email

• **email**: `string`

#### Defined in

packages/medusa/dist/models/cart.d.ts:103

___

### gift\_card\_total

• `Optional` **gift\_card\_total**: `number`

#### Defined in

packages/medusa/dist/models/cart.d.ts:133

___

### gift\_cards

• **gift\_cards**: [`GiftCard`](internal.GiftCard.md)[]

#### Defined in

packages/medusa/dist/models/cart.d.ts:112

___

### id

• **id**: `string`

#### Inherited from

[SoftDeletableEntity](internal.SoftDeletableEntity.md).[id](internal.SoftDeletableEntity.md#id)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:5

___

### idempotency\_key

• **idempotency\_key**: `string`

#### Defined in

packages/medusa/dist/models/cart.d.ts:123

___

### items

• **items**: [`LineItem`](internal.LineItem.md)[]

#### Defined in

packages/medusa/dist/models/cart.d.ts:108

___

### metadata

• **metadata**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/models/cart.d.ts:125

___

### object

• `Readonly` **object**: ``"cart"``

#### Defined in

packages/medusa/dist/models/cart.d.ts:102

___

### payment

• **payment**: [`Payment`](internal.Payment.md)

#### Defined in

packages/medusa/dist/models/cart.d.ts:118

___

### payment\_authorized\_at

• **payment\_authorized\_at**: [`Date`](../modules/internal.md#date)

#### Defined in

packages/medusa/dist/models/cart.d.ts:122

___

### payment\_id

• **payment\_id**: `string`

#### Defined in

packages/medusa/dist/models/cart.d.ts:117

___

### payment\_session

• **payment\_session**: ``null`` \| [`PaymentSession`](internal.PaymentSession.md)

#### Defined in

packages/medusa/dist/models/cart.d.ts:115

___

### payment\_sessions

• **payment\_sessions**: [`PaymentSession`](internal.PaymentSession.md)[]

#### Defined in

packages/medusa/dist/models/cart.d.ts:116

___

### refundable\_amount

• `Optional` **refundable\_amount**: `number`

#### Defined in

packages/medusa/dist/models/cart.d.ts:132

___

### refunded\_total

• `Optional` **refunded\_total**: `number`

#### Defined in

packages/medusa/dist/models/cart.d.ts:129

___

### region

• **region**: [`Region`](internal.Region.md)

#### Defined in

packages/medusa/dist/models/cart.d.ts:110

___

### region\_id

• **region\_id**: `string`

#### Defined in

packages/medusa/dist/models/cart.d.ts:109

___

### shipping\_address

• **shipping\_address**: ``null`` \| [`Address`](internal.Address.md)

#### Defined in

packages/medusa/dist/models/cart.d.ts:107

___

### shipping\_address\_id

• **shipping\_address\_id**: `string`

#### Defined in

packages/medusa/dist/models/cart.d.ts:106

___

### shipping\_methods

• **shipping\_methods**: [`ShippingMethod`](internal.ShippingMethod.md)[]

#### Defined in

packages/medusa/dist/models/cart.d.ts:119

___

### shipping\_total

• `Optional` **shipping\_total**: `number`

#### Defined in

packages/medusa/dist/models/cart.d.ts:126

___

### subtotal

• `Optional` **subtotal**: `number`

#### Defined in

packages/medusa/dist/models/cart.d.ts:131

___

### tax\_total

• `Optional` **tax\_total**: ``null`` \| `number`

#### Defined in

packages/medusa/dist/models/cart.d.ts:128

___

### total

• `Optional` **total**: `number`

#### Defined in

packages/medusa/dist/models/cart.d.ts:130

___

### type

• **type**: [`CartType`](../enums/internal.CartType.md)

#### Defined in

packages/medusa/dist/models/cart.d.ts:120

___

### updated\_at

• **updated\_at**: [`Date`](../modules/internal.md#date)

#### Inherited from

[SoftDeletableEntity](internal.SoftDeletableEntity.md).[updated_at](internal.SoftDeletableEntity.md#updated_at)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:7
