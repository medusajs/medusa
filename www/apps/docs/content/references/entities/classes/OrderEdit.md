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

[models/order-edit.ts:73](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order-edit.ts#L73)

___

### canceled\_by

• `Optional` **canceled\_by**: `string`

#### Defined in

[models/order-edit.ts:70](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order-edit.ts#L70)

___

### changes

• **changes**: [`OrderItemChange`](OrderItemChange.md)[]

#### Defined in

[models/order-edit.ts:40](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order-edit.ts#L40)

___

### confirmed\_at

• `Optional` **confirmed\_at**: `Date`

#### Defined in

[models/order-edit.ts:58](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order-edit.ts#L58)

___

### confirmed\_by

• `Optional` **confirmed\_by**: `string`

#### Defined in

[models/order-edit.ts:55](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order-edit.ts#L55)

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

BaseEntity.created\_at

#### Defined in

[interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### created\_by

• **created\_by**: `string`

#### Defined in

[models/order-edit.ts:46](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order-edit.ts#L46)

___

### declined\_at

• `Optional` **declined\_at**: `Date`

#### Defined in

[models/order-edit.ts:67](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order-edit.ts#L67)

___

### declined\_by

• `Optional` **declined\_by**: `string`

#### Defined in

[models/order-edit.ts:61](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order-edit.ts#L61)

___

### declined\_reason

• `Optional` **declined\_reason**: `string`

#### Defined in

[models/order-edit.ts:64](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order-edit.ts#L64)

___

### difference\_due

• **difference\_due**: `number`

#### Defined in

[models/order-edit.ts:95](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order-edit.ts#L95)

___

### discount\_total

• **discount\_total**: `number`

#### Defined in

[models/order-edit.ts:88](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order-edit.ts#L88)

___

### gift\_card\_tax\_total

• **gift\_card\_tax\_total**: `number`

#### Defined in

[models/order-edit.ts:93](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order-edit.ts#L93)

___

### gift\_card\_total

• **gift\_card\_total**: `number`

#### Defined in

[models/order-edit.ts:92](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order-edit.ts#L92)

___

### id

• **id**: `string`

#### Inherited from

BaseEntity.id

#### Defined in

[interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### internal\_note

• `Optional` **internal\_note**: `string`

#### Defined in

[models/order-edit.ts:43](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order-edit.ts#L43)

___

### items

• **items**: [`LineItem`](LineItem.md)[]

#### Defined in

[models/order-edit.ts:76](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order-edit.ts#L76)

___

### order

• **order**: [`Order`](Order.md)

#### Defined in

[models/order-edit.ts:35](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order-edit.ts#L35)

___

### order\_id

• **order\_id**: `string`

#### Defined in

[models/order-edit.ts:31](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order-edit.ts#L31)

___

### payment\_collection

• **payment\_collection**: [`PaymentCollection`](PaymentCollection.md)

#### Defined in

[models/order-edit.ts:84](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order-edit.ts#L84)

___

### payment\_collection\_id

• **payment\_collection\_id**: `string`

#### Defined in

[models/order-edit.ts:80](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order-edit.ts#L80)

___

### requested\_at

• `Optional` **requested\_at**: `Date`

#### Defined in

[models/order-edit.ts:52](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order-edit.ts#L52)

___

### requested\_by

• `Optional` **requested\_by**: `string`

#### Defined in

[models/order-edit.ts:49](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order-edit.ts#L49)

___

### shipping\_total

• **shipping\_total**: `number`

#### Defined in

[models/order-edit.ts:87](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order-edit.ts#L87)

___

### status

• **status**: [`OrderEditStatus`](../enums/OrderEditStatus.md)

#### Defined in

[models/order-edit.ts:97](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order-edit.ts#L97)

___

### subtotal

• **subtotal**: `number`

#### Defined in

[models/order-edit.ts:91](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order-edit.ts#L91)

___

### tax\_total

• **tax\_total**: ``null`` \| `number`

#### Defined in

[models/order-edit.ts:89](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order-edit.ts#L89)

___

### total

• **total**: `number`

#### Defined in

[models/order-edit.ts:90](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order-edit.ts#L90)

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

[models/order-edit.ts:100](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order-edit.ts#L100)

___

### loadStatus

▸ **loadStatus**(): `void`

#### Returns

`void`

#### Defined in

[models/order-edit.ts:105](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/order-edit.ts#L105)
