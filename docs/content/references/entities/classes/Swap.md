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

[models/swap.ts:61](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/models/swap.ts#L61)

___

### allow\_backorder

• **allow\_backorder**: `boolean`

#### Defined in

[models/swap.ts:106](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/models/swap.ts#L106)

___

### canceled\_at

• **canceled\_at**: `Date`

#### Defined in

[models/swap.ts:100](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/models/swap.ts#L100)

___

### cart

• **cart**: [`Cart`](Cart.md)

#### Defined in

[models/swap.ts:94](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/models/swap.ts#L94)

___

### cart\_id

• **cart\_id**: `string`

#### Defined in

[models/swap.ts:90](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/models/swap.ts#L90)

___

### confirmed\_at

• **confirmed\_at**: `Date`

#### Defined in

[models/swap.ts:97](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/models/swap.ts#L97)

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

SoftDeletableEntity.created\_at

#### Defined in

[interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### deleted\_at

• **deleted\_at**: ``null`` \| `Date`

#### Inherited from

SoftDeletableEntity.deleted\_at

#### Defined in

[interfaces/models/soft-deletable-entity.ts:7](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/interfaces/models/soft-deletable-entity.ts#L7)

___

### difference\_due

• **difference\_due**: `number`

#### Defined in

[models/swap.ts:75](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/models/swap.ts#L75)

___

### fulfillment\_status

• **fulfillment\_status**: [`SwapFulfillmentStatus`](../enums/SwapFulfillmentStatus.md)

#### Defined in

[models/swap.ts:47](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/models/swap.ts#L47)

___

### fulfillments

• **fulfillments**: [`Fulfillment`](Fulfillment.md)[]

#### Defined in

[models/swap.ts:69](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/models/swap.ts#L69)

___

### id

• **id**: `string`

#### Inherited from

SoftDeletableEntity.id

#### Defined in

[interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### idempotency\_key

• **idempotency\_key**: `string`

#### Defined in

[models/swap.ts:109](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/models/swap.ts#L109)

___

### metadata

• **metadata**: `Record`<`string`, `unknown`\>

#### Defined in

[models/swap.ts:112](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/models/swap.ts#L112)

___

### no\_notification

• **no\_notification**: `boolean`

#### Defined in

[models/swap.ts:103](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/models/swap.ts#L103)

___

### order

• **order**: [`Order`](Order.md)

#### Defined in

[models/swap.ts:58](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/models/swap.ts#L58)

___

### order\_id

• **order\_id**: `string`

#### Defined in

[models/swap.ts:54](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/models/swap.ts#L54)

___

### payment

• **payment**: [`Payment`](Payment.md)

#### Defined in

[models/swap.ts:72](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/models/swap.ts#L72)

___

### payment\_status

• **payment\_status**: [`SwapPaymentStatus`](../enums/SwapPaymentStatus.md)

#### Defined in

[models/swap.ts:50](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/models/swap.ts#L50)

___

### return\_order

• **return\_order**: [`Return`](Return.md)

#### Defined in

[models/swap.ts:64](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/models/swap.ts#L64)

___

### shipping\_address

• **shipping\_address**: [`Address`](Address.md)

#### Defined in

[models/swap.ts:82](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/models/swap.ts#L82)

___

### shipping\_address\_id

• **shipping\_address\_id**: `string`

#### Defined in

[models/swap.ts:78](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/models/swap.ts#L78)

___

### shipping\_methods

• **shipping\_methods**: [`ShippingMethod`](ShippingMethod.md)[]

#### Defined in

[models/swap.ts:87](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/models/swap.ts#L87)

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

SoftDeletableEntity.updated\_at

#### Defined in

[interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/interfaces/models/base-entity.ts#L19)

## Methods

### beforeInsert

▸ `Private` **beforeInsert**(): `void`

#### Returns

`void`

#### Defined in

[models/swap.ts:114](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/models/swap.ts#L114)
