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

[models/return.ts:57](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/return.ts#L57)

___

### claim\_order\_id

• **claim\_order\_id**: ``null`` \| `string`

#### Defined in

[models/return.ts:53](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/return.ts#L53)

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

BaseEntity.created\_at

#### Defined in

[interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### id

• **id**: `string`

#### Inherited from

BaseEntity.id

#### Defined in

[interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### idempotency\_key

• **idempotency\_key**: ``null`` \| `string`

#### Defined in

[models/return.ts:92](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/return.ts#L92)

___

### items

• **items**: [`ReturnItem`](ReturnItem.md)[]

#### Defined in

[models/return.ts:41](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/return.ts#L41)

___

### location\_id

• **location\_id**: ``null`` \| `string`

#### Defined in

[models/return.ts:74](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/return.ts#L74)

___

### metadata

• **metadata**: ``null`` \| `Record`<`string`, `unknown`\>

#### Defined in

[models/return.ts:89](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/return.ts#L89)

___

### no\_notification

• **no\_notification**: ``null`` \| `boolean`

#### Defined in

[models/return.ts:86](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/return.ts#L86)

___

### order

• **order**: [`Order`](Order.md)

#### Defined in

[models/return.ts:65](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/return.ts#L65)

___

### order\_id

• **order\_id**: ``null`` \| `string`

#### Defined in

[models/return.ts:61](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/return.ts#L61)

___

### received\_at

• **received\_at**: `Date`

#### Defined in

[models/return.ts:83](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/return.ts#L83)

___

### refund\_amount

• **refund\_amount**: `number`

#### Defined in

[models/return.ts:80](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/return.ts#L80)

___

### shipping\_data

• **shipping\_data**: `Record`<`string`, `unknown`\>

#### Defined in

[models/return.ts:77](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/return.ts#L77)

___

### shipping\_method

• **shipping\_method**: [`ShippingMethod`](ShippingMethod.md)

#### Defined in

[models/return.ts:70](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/return.ts#L70)

___

### status

• **status**: [`ReturnStatus`](../enums/ReturnStatus.md)

#### Defined in

[models/return.ts:35](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/return.ts#L35)

___

### swap

• **swap**: [`Swap`](Swap.md)

#### Defined in

[models/return.ts:49](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/return.ts#L49)

___

### swap\_id

• **swap\_id**: ``null`` \| `string`

#### Defined in

[models/return.ts:45](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/return.ts#L45)

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

BaseEntity.updated\_at

#### Defined in

[interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/models/base-entity.ts#L19)

## Methods

### beforeInsert

▸ `Private` **beforeInsert**(): `void`

#### Returns

`void`

#### Defined in

[models/return.ts:95](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/return.ts#L95)
