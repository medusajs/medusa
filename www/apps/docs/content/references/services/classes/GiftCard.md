# GiftCard

Gift Cards are redeemable and represent a value that can be used towards the payment of an Order.

## Hierarchy

- [`SoftDeletableEntity`](SoftDeletableEntity.md)

  ↳ **`GiftCard`**

## Constructors

### constructor

**new GiftCard**()

Gift Cards are redeemable and represent a value that can be used towards the payment of an Order.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[constructor](SoftDeletableEntity.md#constructor)

## Properties

### balance

 **balance**: `number`

The remaining value on the Gift Card.

#### Defined in

[packages/medusa/src/models/gift-card.ts:26](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/gift-card.ts#L26)

___

### code

 **code**: `string`

The unique code that identifies the Gift Card. This is used by the Customer to redeem the value of the Gift Card.

#### Defined in

[packages/medusa/src/models/gift-card.ts:20](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/gift-card.ts#L20)

___

### created\_at

 **created\_at**: `Date`

The date with timezone at which the resource was created.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[created_at](SoftDeletableEntity.md#created_at)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### deleted\_at

 **deleted\_at**: ``null`` \| `Date`

The date with timezone at which the resource was deleted.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[deleted_at](SoftDeletableEntity.md#deleted_at)

#### Defined in

[packages/medusa/src/interfaces/models/soft-deletable-entity.ts:7](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/soft-deletable-entity.ts#L7)

___

### ends\_at

 **ends\_at**: `Date`

The time at which the Gift Card can no longer be used.

#### Defined in

[packages/medusa/src/models/gift-card.ts:51](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/gift-card.ts#L51)

___

### id

 **id**: `string`

The gift card's ID

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[id](SoftDeletableEntity.md#id)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### is\_disabled

 **is\_disabled**: `boolean`

Whether the Gift Card has been disabled. Disabled Gift Cards cannot be applied to carts.

#### Defined in

[packages/medusa/src/models/gift-card.ts:45](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/gift-card.ts#L45)

___

### metadata

 **metadata**: Record<`string`, `unknown`\>

An optional key-value map with additional details

#### Defined in

[packages/medusa/src/models/gift-card.ts:57](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/gift-card.ts#L57)

___

### order

 **order**: [`Order`](Order.md)

The details of the order that the gift card was purchased in.

#### Defined in

[packages/medusa/src/models/gift-card.ts:42](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/gift-card.ts#L42)

___

### order\_id

 **order\_id**: `string`

The ID of the order that the gift card was purchased in.

#### Defined in

[packages/medusa/src/models/gift-card.ts:38](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/gift-card.ts#L38)

___

### region

 **region**: [`Region`](Region.md)

The details of the region this gift card is available in.

#### Defined in

[packages/medusa/src/models/gift-card.ts:34](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/gift-card.ts#L34)

___

### region\_id

 **region\_id**: `string`

The ID of the region this gift card is available in.

#### Defined in

[packages/medusa/src/models/gift-card.ts:30](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/gift-card.ts#L30)

___

### tax\_rate

 **tax\_rate**: ``null`` \| `number`

The gift card's tax rate that will be applied on calculating totals

#### Defined in

[packages/medusa/src/models/gift-card.ts:54](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/gift-card.ts#L54)

___

### updated\_at

 **updated\_at**: `Date`

The date with timezone at which the resource was updated.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[updated_at](SoftDeletableEntity.md#updated_at)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/base-entity.ts#L19)

___

### value

 **value**: `number`

The value that the Gift Card represents.

#### Defined in

[packages/medusa/src/models/gift-card.ts:23](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/gift-card.ts#L23)

## Methods

### beforeInsert

`Private` **beforeInsert**(): `void`

#### Returns

`void`

-`void`: (optional) 

#### Defined in

[packages/medusa/src/models/gift-card.ts:63](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/gift-card.ts#L63)
