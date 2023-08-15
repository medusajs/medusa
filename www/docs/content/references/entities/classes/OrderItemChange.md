---
displayed_sidebar: entitiesSidebar
---

# Class: OrderItemChange

## Hierarchy

- `SoftDeletableEntity`

  ↳ **`OrderItemChange`**

## Constructors

### constructor

• **new OrderItemChange**()

#### Inherited from

SoftDeletableEntity.constructor

## Properties

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

### id

• **id**: `string`

#### Inherited from

SoftDeletableEntity.id

#### Defined in

[interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### line\_item

• `Optional` **line\_item**: [`LineItem`](LineItem.md)

#### Defined in

[models/order-item-change.ts:53](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/order-item-change.ts#L53)

___

### line\_item\_id

• `Optional` **line\_item\_id**: `string`

#### Defined in

[models/order-item-change.ts:49](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/order-item-change.ts#L49)

___

### order\_edit

• **order\_edit**: [`OrderEdit`](OrderEdit.md)

#### Defined in

[models/order-item-change.ts:39](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/order-item-change.ts#L39)

___

### order\_edit\_id

• **order\_edit\_id**: `string`

#### Defined in

[models/order-item-change.ts:35](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/order-item-change.ts#L35)

___

### original\_line\_item

• `Optional` **original\_line\_item**: [`LineItem`](LineItem.md)

#### Defined in

[models/order-item-change.ts:46](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/order-item-change.ts#L46)

___

### original\_line\_item\_id

• `Optional` **original\_line\_item\_id**: `string`

#### Defined in

[models/order-item-change.ts:42](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/order-item-change.ts#L42)

___

### type

• **type**: [`OrderEditItemChangeType`](../enums/OrderEditItemChangeType.md)

#### Defined in

[models/order-item-change.ts:32](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/order-item-change.ts#L32)

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

[models/order-item-change.ts:55](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/order-item-change.ts#L55)
