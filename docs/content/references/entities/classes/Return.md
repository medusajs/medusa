---
displayed_sidebar: entitiesSidebar
---

# Class: Return

## Hierarchy

- `BaseEntity`

  ↳ **`Return`**

## Constructors

### constructor

• **new Return**()

#### Inherited from

BaseEntity.constructor

## Properties

### claim\_order

• **claim\_order**: [`ClaimOrder`](ClaimOrder.md)

#### Defined in

[models/return.ts:57](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/return.ts#L57)

___

### claim\_order\_id

• **claim\_order\_id**: `string`

#### Defined in

[models/return.ts:53](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/return.ts#L53)

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

BaseEntity.created\_at

#### Defined in

[interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### id

• **id**: `string`

#### Inherited from

BaseEntity.id

#### Defined in

[interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### idempotency\_key

• **idempotency\_key**: `string`

#### Defined in

[models/return.ts:88](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/return.ts#L88)

___

### items

• **items**: [`ReturnItem`](ReturnItem.md)[]

#### Defined in

[models/return.ts:41](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/return.ts#L41)

___

### metadata

• **metadata**: `Record`<`string`, `unknown`\>

#### Defined in

[models/return.ts:85](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/return.ts#L85)

___

### no\_notification

• **no\_notification**: `boolean`

#### Defined in

[models/return.ts:82](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/return.ts#L82)

___

### order

• **order**: [`Order`](Order.md)

#### Defined in

[models/return.ts:65](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/return.ts#L65)

___

### order\_id

• **order\_id**: `string`

#### Defined in

[models/return.ts:61](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/return.ts#L61)

___

### received\_at

• **received\_at**: `Date`

#### Defined in

[models/return.ts:79](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/return.ts#L79)

___

### refund\_amount

• **refund\_amount**: `number`

#### Defined in

[models/return.ts:76](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/return.ts#L76)

___

### shipping\_data

• **shipping\_data**: `Record`<`string`, `unknown`\>

#### Defined in

[models/return.ts:73](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/return.ts#L73)

___

### shipping\_method

• **shipping\_method**: [`ShippingMethod`](ShippingMethod.md)

#### Defined in

[models/return.ts:70](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/return.ts#L70)

___

### status

• **status**: [`ReturnStatus`](../enums/ReturnStatus.md)

#### Defined in

[models/return.ts:35](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/return.ts#L35)

___

### swap

• **swap**: [`Swap`](Swap.md)

#### Defined in

[models/return.ts:49](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/return.ts#L49)

___

### swap\_id

• **swap\_id**: `string`

#### Defined in

[models/return.ts:45](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/return.ts#L45)

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

BaseEntity.updated\_at

#### Defined in

[interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L19)

## Methods

### beforeInsert

▸ `Private` **beforeInsert**(): `void`

#### Returns

`void`

#### Defined in

[models/return.ts:90](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/return.ts#L90)
