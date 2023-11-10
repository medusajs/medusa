# OrderEdit

Order edit allows modifying items in an order, such as adding, updating, or deleting items from the original order. Once the order edit is confirmed, the changes are reflected on the original order.

## Hierarchy

- [`BaseEntity`](BaseEntity.md)

  ↳ **`OrderEdit`**

## Constructors

### constructor

**new OrderEdit**()

Order edit allows modifying items in an order, such as adding, updating, or deleting items from the original order. Once the order edit is confirmed, the changes are reflected on the original order.

#### Inherited from

[BaseEntity](BaseEntity.md).[constructor](BaseEntity.md#constructor)

## Properties

### canceled\_at

 `Optional` **canceled\_at**: `Date`

The date with timezone at which the edit was cancelled.

#### Defined in

[packages/medusa/src/models/order-edit.ts:93](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/order-edit.ts#L93)

___

### canceled\_by

 `Optional` **canceled\_by**: `string`

The unique identifier of the user or customer who cancelled the order edit.

#### Defined in

[packages/medusa/src/models/order-edit.ts:90](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/order-edit.ts#L90)

___

### changes

 **changes**: [`OrderItemChange`](OrderItemChange.md)[]

The details of all the changes on the original order's line items.

#### Defined in

[packages/medusa/src/models/order-edit.ts:60](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/order-edit.ts#L60)

___

### confirmed\_at

 `Optional` **confirmed\_at**: `Date`

The date with timezone at which the edit was confirmed.

#### Defined in

[packages/medusa/src/models/order-edit.ts:78](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/order-edit.ts#L78)

___

### confirmed\_by

 `Optional` **confirmed\_by**: `string`

The unique identifier of the user or customer who confirmed the order edit.

#### Defined in

[packages/medusa/src/models/order-edit.ts:75](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/order-edit.ts#L75)

___

### created\_at

 **created\_at**: `Date`

The date with timezone at which the resource was created.

#### Inherited from

[BaseEntity](BaseEntity.md).[created_at](BaseEntity.md#created_at)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### created\_by

 **created\_by**: `string`

The unique identifier of the user or customer who created the order edit.

#### Defined in

[packages/medusa/src/models/order-edit.ts:66](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/order-edit.ts#L66)

___

### declined\_at

 `Optional` **declined\_at**: `Date`

The date with timezone at which the edit was declined.

#### Defined in

[packages/medusa/src/models/order-edit.ts:87](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/order-edit.ts#L87)

___

### declined\_by

 `Optional` **declined\_by**: `string`

The unique identifier of the user or customer who declined the order edit.

#### Defined in

[packages/medusa/src/models/order-edit.ts:81](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/order-edit.ts#L81)

___

### declined\_reason

 `Optional` **declined\_reason**: `string`

An optional note why  the order edit is declined.

#### Defined in

[packages/medusa/src/models/order-edit.ts:84](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/order-edit.ts#L84)

___

### difference\_due

 **difference\_due**: `number`

The difference between the total amount of the order and total amount of edited order.

#### Defined in

[packages/medusa/src/models/order-edit.ts:115](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/order-edit.ts#L115)

___

### discount\_total

 **discount\_total**: `number`

The total of discount

#### Defined in

[packages/medusa/src/models/order-edit.ts:108](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/order-edit.ts#L108)

___

### gift\_card\_tax\_total

 **gift\_card\_tax\_total**: `number`

The total of the gift card tax amount

#### Defined in

[packages/medusa/src/models/order-edit.ts:113](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/order-edit.ts#L113)

___

### gift\_card\_total

 **gift\_card\_total**: `number`

The total of the gift card amount

#### Defined in

[packages/medusa/src/models/order-edit.ts:112](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/order-edit.ts#L112)

___

### id

 **id**: `string`

The order edit's ID

#### Inherited from

[BaseEntity](BaseEntity.md).[id](BaseEntity.md#id)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### internal\_note

 `Optional` **internal\_note**: `string`

An optional note with additional details about the order edit.

#### Defined in

[packages/medusa/src/models/order-edit.ts:63](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/order-edit.ts#L63)

___

### items

 **items**: [`LineItem`](LineItem.md)[]

The details of the cloned items from the original order with the new changes. Once the order edit is confirmed, these line items are associated with the original order.

#### Defined in

[packages/medusa/src/models/order-edit.ts:96](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/order-edit.ts#L96)

___

### order

 **order**: [`Order`](Order.md)

The details of the order that this order edit was created for.

#### Defined in

[packages/medusa/src/models/order-edit.ts:55](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/order-edit.ts#L55)

___

### order\_id

 **order\_id**: `string`

The ID of the order that is edited

#### Defined in

[packages/medusa/src/models/order-edit.ts:51](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/order-edit.ts#L51)

___

### payment\_collection

 **payment\_collection**: [`PaymentCollection`](PaymentCollection.md)

The details of the payment collection used to authorize additional payment if necessary.

#### Defined in

[packages/medusa/src/models/order-edit.ts:104](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/order-edit.ts#L104)

___

### payment\_collection\_id

 **payment\_collection\_id**: `string`

The ID of the payment collection

#### Defined in

[packages/medusa/src/models/order-edit.ts:100](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/order-edit.ts#L100)

___

### requested\_at

 `Optional` **requested\_at**: `Date`

The date with timezone at which the edit was requested.

#### Defined in

[packages/medusa/src/models/order-edit.ts:72](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/order-edit.ts#L72)

___

### requested\_by

 `Optional` **requested\_by**: `string`

The unique identifier of the user or customer who requested the order edit.

#### Defined in

[packages/medusa/src/models/order-edit.ts:69](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/order-edit.ts#L69)

___

### shipping\_total

 **shipping\_total**: `number`

The total of the shipping amount

#### Defined in

[packages/medusa/src/models/order-edit.ts:107](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/order-edit.ts#L107)

___

### status

 **status**: [`OrderEditStatus`](../enums/OrderEditStatus.md)

The status of the order edit.

#### Defined in

[packages/medusa/src/models/order-edit.ts:117](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/order-edit.ts#L117)

___

### subtotal

 **subtotal**: `number`

The total of subtotal

#### Defined in

[packages/medusa/src/models/order-edit.ts:111](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/order-edit.ts#L111)

___

### tax\_total

 **tax\_total**: ``null`` \| `number`

The total of tax

#### Defined in

[packages/medusa/src/models/order-edit.ts:109](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/order-edit.ts#L109)

___

### total

 **total**: `number`

The total amount of the edited order.

#### Defined in

[packages/medusa/src/models/order-edit.ts:110](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/order-edit.ts#L110)

___

### updated\_at

 **updated\_at**: `Date`

The date with timezone at which the resource was updated.

#### Inherited from

[BaseEntity](BaseEntity.md).[updated_at](BaseEntity.md#updated_at)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/base-entity.ts#L19)

## Methods

### beforeInsert

`Private` **beforeInsert**(): `void`

#### Returns

`void`

-`void`: (optional) 

#### Defined in

[packages/medusa/src/models/order-edit.ts:123](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/order-edit.ts#L123)

___

### loadStatus

**loadStatus**(): `void`

#### Returns

`void`

-`void`: (optional) 

#### Defined in

[packages/medusa/src/models/order-edit.ts:131](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/order-edit.ts#L131)
