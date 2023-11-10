# Notification

A notification is an alert sent, typically to customers, using the installed Notification Provider as a reaction to internal events such as `order.placed`. Notifications can be resent.

## Hierarchy

- [`BaseEntity`](BaseEntity.md)

  ↳ **`Notification`**

## Constructors

### constructor

**new Notification**()

A notification is an alert sent, typically to customers, using the installed Notification Provider as a reaction to internal events such as `order.placed`. Notifications can be resent.

#### Inherited from

[BaseEntity](BaseEntity.md).[constructor](BaseEntity.md#constructor)

## Properties

### created\_at

 **created\_at**: `Date`

The date with timezone at which the resource was created.

#### Inherited from

[BaseEntity](BaseEntity.md).[created_at](BaseEntity.md#created_at)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### customer

 **customer**: [`Customer`](Customer.md)

The details of the customer that this notification was sent to.

#### Defined in

[packages/medusa/src/models/notification.ts:36](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/notification.ts#L36)

___

### customer\_id

 **customer\_id**: ``null`` \| `string`

The ID of the customer that this notification was sent to.

#### Defined in

[packages/medusa/src/models/notification.ts:32](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/notification.ts#L32)

___

### data

 **data**: Record<`string`, `unknown`\>

The data that the Notification was sent with. This contains all the data necessary for the Notification Provider to initiate a resend.

#### Defined in

[packages/medusa/src/models/notification.ts:42](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/notification.ts#L42)

___

### event\_name

 **event\_name**: `string`

The name of the event that the notification was sent for.

#### Defined in

[packages/medusa/src/models/notification.ts:20](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/notification.ts#L20)

___

### id

 **id**: `string`

The notification's ID

#### Inherited from

[BaseEntity](BaseEntity.md).[id](BaseEntity.md#id)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### parent\_id

 **parent\_id**: `string`

The notification's parent ID

#### Defined in

[packages/medusa/src/models/notification.ts:45](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/notification.ts#L45)

___

### parent\_notification

 **parent\_notification**: [`Notification`](Notification.md)

The details of the parent notification.

#### Defined in

[packages/medusa/src/models/notification.ts:49](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/notification.ts#L49)

___

### provider

 **provider**: [`NotificationProvider`](NotificationProvider.md)

The notification provider used to send the notification.

#### Defined in

[packages/medusa/src/models/notification.ts:59](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/notification.ts#L59)

___

### provider\_id

 **provider\_id**: `string`

The ID of the notification provider used to send the notification.

#### Defined in

[packages/medusa/src/models/notification.ts:55](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/notification.ts#L55)

___

### resends

 **resends**: [`Notification`](Notification.md)[]

The details of all resends of the notification.

#### Defined in

[packages/medusa/src/models/notification.ts:52](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/notification.ts#L52)

___

### resource\_id

 **resource\_id**: `string`

The ID of the resource that the Notification refers to.

#### Defined in

[packages/medusa/src/models/notification.ts:28](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/notification.ts#L28)

___

### resource\_type

 **resource\_type**: `string`

The type of resource that the Notification refers to.

#### Defined in

[packages/medusa/src/models/notification.ts:24](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/notification.ts#L24)

___

### to

 **to**: `string`

The address that the Notification was sent to. This will usually be an email address, but can represent other addresses such as a chat bot user ID.

#### Defined in

[packages/medusa/src/models/notification.ts:39](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/notification.ts#L39)

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

[packages/medusa/src/models/notification.ts:65](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/notification.ts#L65)
