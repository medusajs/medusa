# Class: Notification

[internal](../modules/internal-12.md).Notification

Base abstract entity for all entities

## Hierarchy

- [`BaseEntity`](internal.BaseEntity.md)

  ↳ **`Notification`**

## Properties

### beforeInsert

• `Private` **beforeInsert**: `any`

#### Defined in

medusa/dist/models/notification.d.ts:17

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

[BaseEntity](internal.BaseEntity.md).[created_at](internal.BaseEntity.md#created_at)

#### Defined in

medusa/dist/interfaces/models/base-entity.d.ts:6

___

### customer

• **customer**: [`Customer`](internal.Customer.md)

#### Defined in

medusa/dist/models/notification.d.ts:9

___

### customer\_id

• **customer\_id**: ``null`` \| `string`

#### Defined in

medusa/dist/models/notification.d.ts:8

___

### data

• **data**: `Record`<`string`, `unknown`\>

#### Defined in

medusa/dist/models/notification.d.ts:11

___

### event\_name

• **event\_name**: `string`

#### Defined in

medusa/dist/models/notification.d.ts:5

___

### id

• **id**: `string`

#### Inherited from

[BaseEntity](internal.BaseEntity.md).[id](internal.BaseEntity.md#id)

#### Defined in

medusa/dist/interfaces/models/base-entity.d.ts:5

___

### parent\_id

• **parent\_id**: `string`

#### Defined in

medusa/dist/models/notification.d.ts:12

___

### parent\_notification

• **parent\_notification**: [`Notification`](internal-12.Notification.md)

#### Defined in

medusa/dist/models/notification.d.ts:13

___

### provider

• **provider**: [`NotificationProvider`](internal-12.NotificationProvider.md)

#### Defined in

medusa/dist/models/notification.d.ts:16

___

### provider\_id

• **provider\_id**: `string`

#### Defined in

medusa/dist/models/notification.d.ts:15

___

### resends

• **resends**: [`Notification`](internal-12.Notification.md)[]

#### Defined in

medusa/dist/models/notification.d.ts:14

___

### resource\_id

• **resource\_id**: `string`

#### Defined in

medusa/dist/models/notification.d.ts:7

___

### resource\_type

• **resource\_type**: `string`

#### Defined in

medusa/dist/models/notification.d.ts:6

___

### to

• **to**: `string`

#### Defined in

medusa/dist/models/notification.d.ts:10

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

[BaseEntity](internal.BaseEntity.md).[updated_at](internal.BaseEntity.md#updated_at)

#### Defined in

medusa/dist/interfaces/models/base-entity.d.ts:7
