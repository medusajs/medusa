---
displayed_sidebar: entitiesSidebar
---

# Class: OrderEdit

## Hierarchy

- `SoftDeletableEntity`

  ↳ **`OrderEdit`**

## Constructors

### constructor

• **new OrderEdit**()

#### Inherited from

SoftDeletableEntity.constructor

## Properties

### canceled\_at

• `Optional` **canceled\_at**: `Date`

#### Defined in

[models/order-edit.ts:57](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/models/order-edit.ts#L57)

___

### canceled\_by

• `Optional` **canceled\_by**: `string`

#### Defined in

[models/order-edit.ts:54](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/models/order-edit.ts#L54)

___

### changes

• **changes**: [`OrderItemChange`](OrderItemChange.md)[]

#### Defined in

[models/order-edit.ts:24](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/models/order-edit.ts#L24)

___

### confirmed\_at

• `Optional` **confirmed\_at**: `Date`

#### Defined in

[models/order-edit.ts:42](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/models/order-edit.ts#L42)

___

### confirmed\_by

• `Optional` **confirmed\_by**: `string`

#### Defined in

[models/order-edit.ts:39](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/models/order-edit.ts#L39)

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

SoftDeletableEntity.created\_at

#### Defined in

[interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### created\_by

• **created\_by**: `string`

#### Defined in

[models/order-edit.ts:30](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/models/order-edit.ts#L30)

___

### declined\_at

• `Optional` **declined\_at**: `Date`

#### Defined in

[models/order-edit.ts:51](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/models/order-edit.ts#L51)

___

### declined\_by

• `Optional` **declined\_by**: `string`

#### Defined in

[models/order-edit.ts:45](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/models/order-edit.ts#L45)

___

### declined\_reason

• `Optional` **declined\_reason**: `string`

#### Defined in

[models/order-edit.ts:48](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/models/order-edit.ts#L48)

___

### deleted\_at

• **deleted\_at**: ``null`` \| `Date`

#### Inherited from

SoftDeletableEntity.deleted\_at

#### Defined in

[interfaces/models/soft-deletable-entity.ts:7](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/interfaces/models/soft-deletable-entity.ts#L7)

___

### difference\_due

• **difference\_due**: `number`

#### Defined in

[models/order-edit.ts:64](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/models/order-edit.ts#L64)

___

### discount\_total

• `Optional` **discount\_total**: `number`

#### Defined in

[models/order-edit.ts:61](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/models/order-edit.ts#L61)

___

### id

• **id**: `string`

#### Inherited from

SoftDeletableEntity.id

#### Defined in

[interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### internal\_note

• `Optional` **internal\_note**: `string`

#### Defined in

[models/order-edit.ts:27](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/models/order-edit.ts#L27)

___

### items

• **items**: [`LineItem`](LineItem.md)[]

#### Defined in

[models/order-edit.ts:66](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/models/order-edit.ts#L66)

___

### order

• **order**: [`Order`](Order.md)

#### Defined in

[models/order-edit.ts:19](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/models/order-edit.ts#L19)

___

### order\_id

• **order\_id**: `string`

#### Defined in

[models/order-edit.ts:15](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/models/order-edit.ts#L15)

___

### removed\_items

• **removed\_items**: [`LineItem`](LineItem.md)[]

#### Defined in

[models/order-edit.ts:67](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/models/order-edit.ts#L67)

___

### requested\_at

• `Optional` **requested\_at**: `Date`

#### Defined in

[models/order-edit.ts:36](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/models/order-edit.ts#L36)

___

### requested\_by

• `Optional` **requested\_by**: `string`

#### Defined in

[models/order-edit.ts:33](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/models/order-edit.ts#L33)

___

### subtotal

• **subtotal**: `number`

#### Defined in

[models/order-edit.ts:60](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/models/order-edit.ts#L60)

___

### tax\_total

• **tax\_total**: `number`

#### Defined in

[models/order-edit.ts:62](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/models/order-edit.ts#L62)

___

### total

• **total**: `number`

#### Defined in

[models/order-edit.ts:63](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/models/order-edit.ts#L63)

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

SoftDeletableEntity.updated\_at

#### Defined in

[interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/interfaces/models/base-entity.ts#L19)

## Methods

### beforeInsert

▸ `Private` **beforeInsert**(): `void`

#### Returns

`void`

#### Defined in

[models/order-edit.ts:69](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/models/order-edit.ts#L69)
