# Cart

A cart represents a virtual shopping bag. It can be used to complete an order, a swap, or a claim.

## Hierarchy

- [`SoftDeletableEntity`](SoftDeletableEntity.md)

  ↳ **`Cart`**

## Constructors

### constructor

**new Cart**()

A cart represents a virtual shopping bag. It can be used to complete an order, a swap, or a claim.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[constructor](SoftDeletableEntity.md#constructor)

## Properties

### billing\_address

 **billing\_address**: [`Address`](Address.md)

The details of the billing address associated with the cart.

#### Defined in

[packages/medusa/src/models/cart.ts:291](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/cart.ts#L291)

___

### billing\_address\_id

 **billing\_address\_id**: `string`

The billing address's ID

#### Defined in

[packages/medusa/src/models/cart.ts:285](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/cart.ts#L285)

___

### completed\_at

 **completed\_at**: `Date`

The date with timezone at which the cart was completed.

#### Defined in

[packages/medusa/src/models/cart.ts:376](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/cart.ts#L376)

___

### context

 **context**: Record<`string`, `unknown`\>

The context of the cart which can include info like IP or user agent.

#### Defined in

[packages/medusa/src/models/cart.ts:385](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/cart.ts#L385)

___

### created\_at

 **created\_at**: `Date`

The date with timezone at which the resource was created.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[created_at](SoftDeletableEntity.md#created_at)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### customer

 **customer**: [`Customer`](Customer.md)

The details of the customer the cart belongs to.

#### Defined in

[packages/medusa/src/models/cart.ts:350](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/cart.ts#L350)

___

### customer\_id

 **customer\_id**: `string`

The customer's ID

#### Defined in

[packages/medusa/src/models/cart.ts:346](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/cart.ts#L346)

___

### deleted\_at

 **deleted\_at**: ``null`` \| `Date`

The date with timezone at which the resource was deleted.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[deleted_at](SoftDeletableEntity.md#deleted_at)

#### Defined in

[packages/medusa/src/interfaces/models/soft-deletable-entity.ts:7](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/soft-deletable-entity.ts#L7)

___

### discount\_total

 `Optional` **discount\_total**: `number`

The total of discount rounded

#### Defined in

[packages/medusa/src/models/cart.ts:400](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/cart.ts#L400)

___

### discounts

 **discounts**: [`Discount`](Discount.md)[]

An array of details of all discounts applied to the cart.

#### Defined in

[packages/medusa/src/models/cart.ts:328](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/cart.ts#L328)

___

### email

 **email**: `string`

The email associated with the cart

#### Defined in

[packages/medusa/src/models/cart.ts:281](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/cart.ts#L281)

___

### gift\_card\_tax\_total

 `Optional` **gift\_card\_tax\_total**: `number`

The total of gift cards with taxes

#### Defined in

[packages/medusa/src/models/cart.ts:410](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/cart.ts#L410)

___

### gift\_card\_total

 `Optional` **gift\_card\_total**: `number`

The total of gift cards

#### Defined in

[packages/medusa/src/models/cart.ts:409](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/cart.ts#L409)

___

### gift\_cards

 **gift\_cards**: [`GiftCard`](GiftCard.md)[]

An array of details of all gift cards applied to the cart.

#### Defined in

[packages/medusa/src/models/cart.ts:342](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/cart.ts#L342)

___

### id

 **id**: `string`

The cart's ID

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[id](SoftDeletableEntity.md#id)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### idempotency\_key

 **idempotency\_key**: `string`

Randomly generated key used to continue the completion of a cart in case of failure.

#### Defined in

[packages/medusa/src/models/cart.ts:382](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/cart.ts#L382)

___

### item\_tax\_total

 `Optional` **item\_tax\_total**: ``null`` \| `number`

The total of items with taxes

#### Defined in

[packages/medusa/src/models/cart.ts:402](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/cart.ts#L402)

___

### items

 **items**: [`LineItem`](LineItem.md)[]

The line items added to the cart.

#### Defined in

[packages/medusa/src/models/cart.ts:306](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/cart.ts#L306)

___

### metadata

 **metadata**: Record<`string`, `unknown`\>

An optional key-value map with additional details

#### Defined in

[packages/medusa/src/models/cart.ts:388](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/cart.ts#L388)

___

### object

 `Readonly` **object**: ``"cart"``

#### Defined in

[packages/medusa/src/models/cart.ts:278](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/cart.ts#L278)

___

### payment

 **payment**: [`Payment`](Payment.md)

The details of the payment associated with the cart.

#### Defined in

[packages/medusa/src/models/cart.ts:365](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/cart.ts#L365)

___

### payment\_authorized\_at

 **payment\_authorized\_at**: `Date`

The date with timezone at which the payment was authorized.

#### Defined in

[packages/medusa/src/models/cart.ts:379](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/cart.ts#L379)

___

### payment\_id

 **payment\_id**: `string`

The payment's ID if available

#### Defined in

[packages/medusa/src/models/cart.ts:361](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/cart.ts#L361)

___

### payment\_session

 **payment\_session**: ``null`` \| [`PaymentSession`](PaymentSession.md)

The details of the selected payment session in the cart.

#### Defined in

[packages/medusa/src/models/cart.ts:352](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/cart.ts#L352)

___

### payment\_sessions

 **payment\_sessions**: [`PaymentSession`](PaymentSession.md)[]

The details of all payment sessions created on the cart.

#### Defined in

[packages/medusa/src/models/cart.ts:357](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/cart.ts#L357)

___

### raw\_discount\_total

 `Optional` **raw\_discount\_total**: `number`

The total of discount

#### Defined in

[packages/medusa/src/models/cart.ts:401](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/cart.ts#L401)

___

### refundable\_amount

 `Optional` **refundable\_amount**: `number`

The amount that can be refunded

#### Defined in

[packages/medusa/src/models/cart.ts:408](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/cart.ts#L408)

___

### refunded\_total

 `Optional` **refunded\_total**: `number`

The total amount refunded if the order associated with this cart is returned.

#### Defined in

[packages/medusa/src/models/cart.ts:405](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/cart.ts#L405)

___

### region

 **region**: [`Region`](Region.md)

The details of the region associated with the cart.

#### Defined in

[packages/medusa/src/models/cart.ts:314](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/cart.ts#L314)

___

### region\_id

 **region\_id**: `string`

The region's ID

#### Defined in

[packages/medusa/src/models/cart.ts:310](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/cart.ts#L310)

___

### sales\_channel

 **sales\_channel**: [`SalesChannel`](SalesChannel.md)

The details of the sales channel associated with the cart.

#### Defined in

[packages/medusa/src/models/cart.ts:397](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/cart.ts#L397)

___

### sales\_channel\_id

 **sales\_channel\_id**: ``null`` \| `string`

The sales channel ID the cart is associated with.

#### Defined in

[packages/medusa/src/models/cart.ts:391](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/cart.ts#L391)

___

### shipping\_address

 **shipping\_address**: ``null`` \| [`Address`](Address.md)

The details of the shipping address associated with the cart.

#### Defined in

[packages/medusa/src/models/cart.ts:301](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/cart.ts#L301)

___

### shipping\_address\_id

 **shipping\_address\_id**: `string`

The shipping address's ID

#### Defined in

[packages/medusa/src/models/cart.ts:295](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/cart.ts#L295)

___

### shipping\_methods

 **shipping\_methods**: [`ShippingMethod`](ShippingMethod.md)[]

The details of the shipping methods added to the cart.

#### Defined in

[packages/medusa/src/models/cart.ts:370](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/cart.ts#L370)

___

### shipping\_tax\_total

 `Optional` **shipping\_tax\_total**: ``null`` \| `number`

The total of shipping with taxes

#### Defined in

[packages/medusa/src/models/cart.ts:403](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/cart.ts#L403)

___

### shipping\_total

 `Optional` **shipping\_total**: `number`

The total of shipping

#### Defined in

[packages/medusa/src/models/cart.ts:399](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/cart.ts#L399)

___

### subtotal

 `Optional` **subtotal**: `number`

The subtotal of the cart

#### Defined in

[packages/medusa/src/models/cart.ts:407](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/cart.ts#L407)

___

### tax\_total

 `Optional` **tax\_total**: ``null`` \| `number`

The total of tax

#### Defined in

[packages/medusa/src/models/cart.ts:404](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/cart.ts#L404)

___

### total

 `Optional` **total**: `number`

The total amount of the cart

#### Defined in

[packages/medusa/src/models/cart.ts:406](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/cart.ts#L406)

___

### type

 **type**: [`CartType`](../enums/CartType.md) = `default`

The cart's type.

#### Defined in

[packages/medusa/src/models/cart.ts:373](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/cart.ts#L373)

___

### updated\_at

 **updated\_at**: `Date`

The date with timezone at which the resource was updated.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[updated_at](SoftDeletableEntity.md#updated_at)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/base-entity.ts#L19)

## Methods

### afterLoad

`Private` **afterLoad**(): `void`

#### Returns

`void`

-`void`: (optional) 

#### Defined in

[packages/medusa/src/models/cart.ts:416](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/cart.ts#L416)

___

### beforeInsert

`Private` **beforeInsert**(): `void`

#### Returns

`void`

-`void`: (optional) 

#### Defined in

[packages/medusa/src/models/cart.ts:426](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/cart.ts#L426)
