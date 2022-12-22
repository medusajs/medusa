---
displayed_sidebar: entitiesSidebar
---

# Class: Swap

## Hierarchy

- `SoftDeletableEntity`

  ↳ **`Swap`**

## Constructors

### constructor

• **new Swap**()

#### Inherited from

SoftDeletableEntity.constructor

## Properties

### additional\_items

• **additional\_items**: [`LineItem`](LineItem.md)[]

#### Defined in

[models/swap.ts:62](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/swap.ts#L62)

___

### allow\_backorder

• **allow\_backorder**: `boolean`

#### Defined in

[models/swap.ts:107](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/swap.ts#L107)

___

### canceled\_at

• **canceled\_at**: `Date`

#### Defined in

[models/swap.ts:101](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/swap.ts#L101)

___

### cart

• **cart**: [`Cart`](Cart.md)

#### Defined in

[models/swap.ts:95](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/swap.ts#L95)

___

### cart\_id

• **cart\_id**: `string`

#### Defined in

[models/swap.ts:91](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/swap.ts#L91)

___

### confirmed\_at

• **confirmed\_at**: `Date`

#### Defined in

[models/swap.ts:98](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/swap.ts#L98)

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

SoftDeletableEntity.created\_at

#### Defined in

[interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### deleted\_at

• **deleted\_at**: ``null`` \| `Date`

#### Inherited from

SoftDeletableEntity.deleted\_at

#### Defined in

[interfaces/models/soft-deletable-entity.ts:7](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/soft-deletable-entity.ts#L7)

___

### difference\_due

• **difference\_due**: `number`

#### Defined in

[models/swap.ts:76](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/swap.ts#L76)

___

### fulfillment\_status

• **fulfillment\_status**: [`SwapFulfillmentStatus`](../enums/SwapFulfillmentStatus.md)

#### Defined in

[models/swap.ts:48](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/swap.ts#L48)

___

### fulfillments

• **fulfillments**: [`Fulfillment`](Fulfillment.md)[]

#### Defined in

[models/swap.ts:70](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/swap.ts#L70)

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

[models/swap.ts:110](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/swap.ts#L110)

___

### metadata

• **metadata**: `Record`<`string`, `unknown`\>

#### Defined in

[models/swap.ts:113](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/swap.ts#L113)

___

### no\_notification

• **no\_notification**: `boolean`

#### Defined in

[models/swap.ts:104](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/swap.ts#L104)

___

### order

• **order**: [`Order`](Order.md)

#### Defined in

[models/swap.ts:59](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/swap.ts#L59)

___

### order\_id

• **order\_id**: `string`

#### Defined in

[models/swap.ts:55](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/swap.ts#L55)

___

### payment

• **payment**: [`Payment`](Payment.md)

#### Defined in

[models/swap.ts:73](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/swap.ts#L73)

___

### payment\_status

• **payment\_status**: [`SwapPaymentStatus`](../enums/SwapPaymentStatus.md)

#### Defined in

[models/swap.ts:51](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/swap.ts#L51)

___

### return\_order

• **return\_order**: [`Return`](Return.md)

#### Defined in

[models/swap.ts:65](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/swap.ts#L65)

___

### shipping\_address

• **shipping\_address**: [`Address`](Address.md)

#### Defined in

[models/swap.ts:83](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/swap.ts#L83)

___

### shipping\_address\_id

• **shipping\_address\_id**: `string`

#### Defined in

[models/swap.ts:79](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/swap.ts#L79)

___

### shipping\_methods

• **shipping\_methods**: [`ShippingMethod`](ShippingMethod.md)[]

#### Defined in

[models/swap.ts:88](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/swap.ts#L88)

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

SoftDeletableEntity.updated\_at

#### Defined in

[interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L19)

## Methods

### beforeInsert

▸ `Private` **beforeInsert**(): `void`

#### Returns

`void`

#### Defined in

[models/swap.ts:115](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/swap.ts#L115)
