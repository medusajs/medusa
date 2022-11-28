---
displayed_sidebar: entitiesSidebar
---

# Class: Notification

## Hierarchy

- `BaseEntity`

  ↳ **`Notification`**

## Constructors

### constructor

• **new Notification**()

#### Inherited from

BaseEntity.constructor

## Properties

### created\_at

• **created\_at**: `Date`

#### Inherited from

BaseEntity.created\_at

#### Defined in

[interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### customer

• **customer**: [`Customer`](Customer.md)

#### Defined in

[models/notification.ts:36](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/notification.ts#L36)

___

### customer\_id

• **customer\_id**: ``null`` \| `string`

#### Defined in

[models/notification.ts:32](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/notification.ts#L32)

___

### data

• **data**: `Record`<`string`, `unknown`\>

#### Defined in

[models/notification.ts:42](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/notification.ts#L42)

___

### event\_name

• **event\_name**: `string`

#### Defined in

[models/notification.ts:20](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/notification.ts#L20)

___

### id

• **id**: `string`

#### Inherited from

BaseEntity.id

#### Defined in

[interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### parent\_id

• **parent\_id**: `string`

#### Defined in

[models/notification.ts:45](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/notification.ts#L45)

___

### parent\_notification

• **parent\_notification**: [`Notification`](Notification.md)

#### Defined in

[models/notification.ts:49](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/notification.ts#L49)

___

### provider

• **provider**: `NotificationProvider`

#### Defined in

[models/notification.ts:59](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/notification.ts#L59)

___

### provider\_id

• **provider\_id**: `string`

#### Defined in

[models/notification.ts:55](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/notification.ts#L55)

___

### resends

• **resends**: [`Notification`](Notification.md)[]

#### Defined in

[models/notification.ts:52](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/notification.ts#L52)

___

### resource\_id

• **resource\_id**: `string`

#### Defined in

[models/notification.ts:28](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/notification.ts#L28)

___

### resource\_type

• **resource\_type**: `string`

#### Defined in

[models/notification.ts:24](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/notification.ts#L24)

___

### to

• **to**: `string`

#### Defined in

[models/notification.ts:39](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/notification.ts#L39)

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

[models/notification.ts:61](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/notification.ts#L61)
