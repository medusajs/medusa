---
displayed_sidebar: entitiesSidebar
---

# Class: Payment

## Hierarchy

- `BaseEntity`

  ↳ **`Payment`**

## Constructors

### constructor

• **new Payment**()

#### Inherited from

BaseEntity.constructor

## Properties

### amount

• **amount**: `number`

#### Defined in

[models/payment.ts:51](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/models/payment.ts#L51)

___

### amount\_refunded

• **amount\_refunded**: `number`

#### Defined in

[models/payment.ts:61](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/models/payment.ts#L61)

___

### canceled\_at

• **canceled\_at**: `string` \| `Date`

#### Defined in

[models/payment.ts:74](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/models/payment.ts#L74)

___

### captured\_at

• **captured\_at**: `string` \| `Date`

#### Defined in

[models/payment.ts:71](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/models/payment.ts#L71)

___

### cart

• **cart**: [`Cart`](Cart.md)

#### Defined in

[models/payment.ts:37](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/models/payment.ts#L37)

___

### cart\_id

• **cart\_id**: `string`

#### Defined in

[models/payment.ts:33](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/models/payment.ts#L33)

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

BaseEntity.created\_at

#### Defined in

[interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### currency

• **currency**: [`Currency`](Currency.md)

#### Defined in

[models/payment.ts:58](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/models/payment.ts#L58)

___

### currency\_code

• **currency\_code**: `string`

#### Defined in

[models/payment.ts:54](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/models/payment.ts#L54)

___

### data

• **data**: `Record`<`string`, `unknown`\>

#### Defined in

[models/payment.ts:68](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/models/payment.ts#L68)

___

### id

• **id**: `string`

#### Inherited from

BaseEntity.id

#### Defined in

[interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### idempotency\_key

• **idempotency\_key**: `string`

#### Defined in

[models/payment.ts:80](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/models/payment.ts#L80)

___

### metadata

• **metadata**: `Record`<`string`, `unknown`\>

#### Defined in

[models/payment.ts:77](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/models/payment.ts#L77)

___

### order

• **order**: [`Order`](Order.md)

#### Defined in

[models/payment.ts:48](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/models/payment.ts#L48)

___

### order\_id

• **order\_id**: `string`

#### Defined in

[models/payment.ts:41](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/models/payment.ts#L41)

___

### provider\_id

• **provider\_id**: `string`

#### Defined in

[models/payment.ts:65](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/models/payment.ts#L65)

___

### swap

• **swap**: [`Swap`](Swap.md)

#### Defined in

[models/payment.ts:29](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/models/payment.ts#L29)

___

### swap\_id

• **swap\_id**: `string`

#### Defined in

[models/payment.ts:25](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/models/payment.ts#L25)

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

BaseEntity.updated\_at

#### Defined in

[interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/interfaces/models/base-entity.ts#L19)

## Methods

### beforeInsert

▸ `Private` **beforeInsert**(): `void`

#### Returns

`void`

#### Defined in

[models/payment.ts:82](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/models/payment.ts#L82)
