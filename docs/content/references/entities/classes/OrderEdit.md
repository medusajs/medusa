---
displayed_sidebar: entitiesSidebar
---

# Class: OrderEdit

## Hierarchy

- `BaseEntity`

  ↳ **`OrderEdit`**

## Constructors

### constructor

• **new OrderEdit**()

#### Inherited from

BaseEntity.constructor

## Properties

### canceled\_at

• `Optional` **canceled\_at**: `Date`

#### Defined in

[models/order-edit.ts:74](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/order-edit.ts#L74)

___

### canceled\_by

• `Optional` **canceled\_by**: `string`

#### Defined in

[models/order-edit.ts:71](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/order-edit.ts#L71)

___

### changes

• **changes**: [`OrderItemChange`](OrderItemChange.md)[]

#### Defined in

[models/order-edit.ts:41](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/order-edit.ts#L41)

___

### confirmed\_at

• `Optional` **confirmed\_at**: `Date`

#### Defined in

[models/order-edit.ts:59](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/order-edit.ts#L59)

___

### confirmed\_by

• `Optional` **confirmed\_by**: `string`

#### Defined in

[models/order-edit.ts:56](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/order-edit.ts#L56)

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

BaseEntity.created\_at

#### Defined in

[interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### created\_by

• **created\_by**: `string`

#### Defined in

[models/order-edit.ts:47](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/order-edit.ts#L47)

___

### declined\_at

• `Optional` **declined\_at**: `Date`

#### Defined in

[models/order-edit.ts:68](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/order-edit.ts#L68)

___

### declined\_by

• `Optional` **declined\_by**: `string`

#### Defined in

[models/order-edit.ts:62](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/order-edit.ts#L62)

___

### declined\_reason

• `Optional` **declined\_reason**: `string`

#### Defined in

[models/order-edit.ts:65](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/order-edit.ts#L65)

___

### difference\_due

• **difference\_due**: `number`

#### Defined in

[models/order-edit.ts:96](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/order-edit.ts#L96)

___

### discount\_total

• **discount\_total**: `number`

#### Defined in

[models/order-edit.ts:89](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/order-edit.ts#L89)

___

### gift\_card\_tax\_total

• **gift\_card\_tax\_total**: `number`

#### Defined in

[models/order-edit.ts:94](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/order-edit.ts#L94)

___

### gift\_card\_total

• **gift\_card\_total**: `number`

#### Defined in

[models/order-edit.ts:93](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/order-edit.ts#L93)

___

### id

• **id**: `string`

#### Inherited from

BaseEntity.id

#### Defined in

[interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### internal\_note

• `Optional` **internal\_note**: `string`

#### Defined in

[models/order-edit.ts:44](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/order-edit.ts#L44)

___

### items

• **items**: [`LineItem`](LineItem.md)[]

#### Defined in

[models/order-edit.ts:77](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/order-edit.ts#L77)

___

### order

• **order**: [`Order`](Order.md)

#### Defined in

[models/order-edit.ts:36](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/order-edit.ts#L36)

___

### order\_id

• **order\_id**: `string`

#### Defined in

[models/order-edit.ts:32](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/order-edit.ts#L32)

___

### payment\_collection

• **payment\_collection**: [`PaymentCollection`](PaymentCollection.md)

#### Defined in

[models/order-edit.ts:85](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/order-edit.ts#L85)

___

### payment\_collection\_id

• **payment\_collection\_id**: `string`

#### Defined in

[models/order-edit.ts:81](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/order-edit.ts#L81)

___

### requested\_at

• `Optional` **requested\_at**: `Date`

#### Defined in

[models/order-edit.ts:53](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/order-edit.ts#L53)

___

### requested\_by

• `Optional` **requested\_by**: `string`

#### Defined in

[models/order-edit.ts:50](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/order-edit.ts#L50)

___

### shipping\_total

• **shipping\_total**: `number`

#### Defined in

[models/order-edit.ts:88](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/order-edit.ts#L88)

___

### status

• **status**: [`OrderEditStatus`](../enums/OrderEditStatus.md)

#### Defined in

[models/order-edit.ts:98](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/order-edit.ts#L98)

___

### subtotal

• **subtotal**: `number`

#### Defined in

[models/order-edit.ts:92](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/order-edit.ts#L92)

___

### tax\_total

• **tax\_total**: ``null`` \| `number`

#### Defined in

[models/order-edit.ts:90](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/order-edit.ts#L90)

___

### total

• **total**: `number`

#### Defined in

[models/order-edit.ts:91](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/order-edit.ts#L91)

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

[models/order-edit.ts:100](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/order-edit.ts#L100)

___

### loadStatus

▸ **loadStatus**(): `void`

#### Returns

`void`

#### Defined in

[models/order-edit.ts:105](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/order-edit.ts#L105)
