# OrderItemChange

An order item change is a change made within an order edit to an order's items. These changes are not reflected on the original order until the order edit is confirmed.

## Hierarchy

- [`SoftDeletableEntity`](SoftDeletableEntity.md)

  ↳ **`OrderItemChange`**

## Constructors

### constructor

**new OrderItemChange**()

An order item change is a change made within an order edit to an order's items. These changes are not reflected on the original order until the order edit is confirmed.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[constructor](SoftDeletableEntity.md#constructor)

## Properties

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

### id

 **id**: `string`

The order item change's ID

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[id](SoftDeletableEntity.md#id)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### line\_item

 `Optional` **line\_item**: [`LineItem`](LineItem.md)

The details of the resulting line item after the item change. This line item is then used in the original order once the order edit is confirmed.

#### Defined in

[packages/medusa/src/models/order-item-change.ts:66](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/order-item-change.ts#L66)

___

### line\_item\_id

 `Optional` **line\_item\_id**: `string`

The ID of the cloned line item.

#### Defined in

[packages/medusa/src/models/order-item-change.ts:62](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/order-item-change.ts#L62)

___

### order\_edit

 **order\_edit**: [`OrderEdit`](OrderEdit.md)

The details of the order edit the item change is associated with.

#### Defined in

[packages/medusa/src/models/order-item-change.ts:52](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/order-item-change.ts#L52)

___

### order\_edit\_id

 **order\_edit\_id**: `string`

The ID of the order edit

#### Defined in

[packages/medusa/src/models/order-item-change.ts:48](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/order-item-change.ts#L48)

___

### original\_line\_item

 `Optional` **original\_line\_item**: [`LineItem`](LineItem.md)

The details of the original line item this item change references. This is used if the item change updates or deletes the original item.

#### Defined in

[packages/medusa/src/models/order-item-change.ts:59](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/order-item-change.ts#L59)

___

### original\_line\_item\_id

 `Optional` **original\_line\_item\_id**: `string`

The ID of the original line item in the order

#### Defined in

[packages/medusa/src/models/order-item-change.ts:55](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/order-item-change.ts#L55)

___

### type

 **type**: [`OrderEditItemChangeType`](../enums/OrderEditItemChangeType.md)

The order item change's status

#### Defined in

[packages/medusa/src/models/order-item-change.ts:45](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/order-item-change.ts#L45)

___

### updated\_at

 **updated\_at**: `Date`

The date with timezone at which the resource was updated.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[updated_at](SoftDeletableEntity.md#updated_at)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/base-entity.ts#L19)

## Methods

### beforeInsert

`Private` **beforeInsert**(): `void`

#### Returns

`void`

-`void`: (optional) 

#### Defined in

[packages/medusa/src/models/order-item-change.ts:72](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/order-item-change.ts#L72)
