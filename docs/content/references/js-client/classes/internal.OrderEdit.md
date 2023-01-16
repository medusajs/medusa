---
displayed_sidebar: jsClientSidebar
---

# Class: OrderEdit

[internal](../modules/internal.md).OrderEdit

Base abstract entity for all entities

## Hierarchy

- [`BaseEntity`](internal.BaseEntity.md)

  ↳ **`OrderEdit`**

## Properties

### beforeInsert

• `Private` **beforeInsert**: `any`

#### Defined in

medusa/dist/models/order-edit.d.ts:37

___

### canceled\_at

• `Optional` **canceled\_at**: `Date`

#### Defined in

medusa/dist/models/order-edit.d.ts:24

___

### canceled\_by

• `Optional` **canceled\_by**: `string`

#### Defined in

medusa/dist/models/order-edit.d.ts:23

___

### changes

• **changes**: [`OrderItemChange`](internal.OrderItemChange.md)[]

#### Defined in

medusa/dist/models/order-edit.d.ts:13

___

### confirmed\_at

• `Optional` **confirmed\_at**: `Date`

#### Defined in

medusa/dist/models/order-edit.d.ts:19

___

### confirmed\_by

• `Optional` **confirmed\_by**: `string`

#### Defined in

medusa/dist/models/order-edit.d.ts:18

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

[BaseEntity](internal.BaseEntity.md).[created_at](internal.BaseEntity.md#created_at)

#### Defined in

medusa/dist/interfaces/models/base-entity.d.ts:6

___

### created\_by

• **created\_by**: `string`

#### Defined in

medusa/dist/models/order-edit.d.ts:15

___

### declined\_at

• `Optional` **declined\_at**: `Date`

#### Defined in

medusa/dist/models/order-edit.d.ts:22

___

### declined\_by

• `Optional` **declined\_by**: `string`

#### Defined in

medusa/dist/models/order-edit.d.ts:20

___

### declined\_reason

• `Optional` **declined\_reason**: `string`

#### Defined in

medusa/dist/models/order-edit.d.ts:21

___

### difference\_due

• **difference\_due**: `number`

#### Defined in

medusa/dist/models/order-edit.d.ts:35

___

### discount\_total

• **discount\_total**: `number`

#### Defined in

medusa/dist/models/order-edit.d.ts:29

___

### gift\_card\_tax\_total

• **gift\_card\_tax\_total**: `number`

#### Defined in

medusa/dist/models/order-edit.d.ts:34

___

### gift\_card\_total

• **gift\_card\_total**: `number`

#### Defined in

medusa/dist/models/order-edit.d.ts:33

___

### id

• **id**: `string`

#### Inherited from

[BaseEntity](internal.BaseEntity.md).[id](internal.BaseEntity.md#id)

#### Defined in

medusa/dist/interfaces/models/base-entity.d.ts:5

___

### internal\_note

• `Optional` **internal\_note**: `string`

#### Defined in

medusa/dist/models/order-edit.d.ts:14

___

### items

• **items**: [`LineItem`](internal.LineItem.md)[]

#### Defined in

medusa/dist/models/order-edit.d.ts:25

___

### order

• **order**: [`Order`](internal.Order.md)

#### Defined in

medusa/dist/models/order-edit.d.ts:12

___

### order\_id

• **order\_id**: `string`

#### Defined in

medusa/dist/models/order-edit.d.ts:11

___

### payment\_collection

• **payment\_collection**: [`PaymentCollection`](internal.PaymentCollection.md)

#### Defined in

medusa/dist/models/order-edit.d.ts:27

___

### payment\_collection\_id

• **payment\_collection\_id**: `string`

#### Defined in

medusa/dist/models/order-edit.d.ts:26

___

### requested\_at

• `Optional` **requested\_at**: `Date`

#### Defined in

medusa/dist/models/order-edit.d.ts:17

___

### requested\_by

• `Optional` **requested\_by**: `string`

#### Defined in

medusa/dist/models/order-edit.d.ts:16

___

### shipping\_total

• **shipping\_total**: `number`

#### Defined in

medusa/dist/models/order-edit.d.ts:28

___

### status

• **status**: [`OrderEditStatus`](../enums/internal.OrderEditStatus.md)

#### Defined in

medusa/dist/models/order-edit.d.ts:36

___

### subtotal

• **subtotal**: `number`

#### Defined in

medusa/dist/models/order-edit.d.ts:32

___

### tax\_total

• **tax\_total**: ``null`` \| `number`

#### Defined in

medusa/dist/models/order-edit.d.ts:30

___

### total

• **total**: `number`

#### Defined in

medusa/dist/models/order-edit.d.ts:31

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

[BaseEntity](internal.BaseEntity.md).[updated_at](internal.BaseEntity.md#updated_at)

#### Defined in

medusa/dist/interfaces/models/base-entity.d.ts:7

## Methods

### loadStatus

▸ **loadStatus**(): `void`

#### Returns

`void`

#### Defined in

medusa/dist/models/order-edit.d.ts:38
