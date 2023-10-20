---
displayed_sidebar: jsClientSidebar
---

# Class: Notification

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).Notification

Base abstract entity for all entities

## Hierarchy

- [`BaseEntity`](internal-1.BaseEntity.md)

  ↳ **`Notification`**

## Properties

### beforeInsert

• `Private` **beforeInsert**: `any`

#### Defined in

packages/medusa/dist/models/notification.d.ts:17

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

[BaseEntity](internal-1.BaseEntity.md).[created_at](internal-1.BaseEntity.md#created_at)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:6

___

### customer

• **customer**: [`Customer`](internal-3.Customer.md)

#### Defined in

packages/medusa/dist/models/notification.d.ts:9

___

### customer\_id

• **customer\_id**: ``null`` \| `string`

#### Defined in

packages/medusa/dist/models/notification.d.ts:8

___

### data

• **data**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/models/notification.d.ts:11

___

### event\_name

• **event\_name**: `string`

#### Defined in

packages/medusa/dist/models/notification.d.ts:5

___

### id

• **id**: `string`

#### Inherited from

[BaseEntity](internal-1.BaseEntity.md).[id](internal-1.BaseEntity.md#id)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:5

___

### parent\_id

• **parent\_id**: `string`

#### Defined in

packages/medusa/dist/models/notification.d.ts:12

___

### parent\_notification

• **parent\_notification**: [`Notification`](internal-8.internal.Notification.md)

#### Defined in

packages/medusa/dist/models/notification.d.ts:13

___

### provider

• **provider**: [`NotificationProvider`](internal-8.NotificationProvider.md)

#### Defined in

packages/medusa/dist/models/notification.d.ts:16

___

### provider\_id

• **provider\_id**: `string`

#### Defined in

packages/medusa/dist/models/notification.d.ts:15

___

### resends

• **resends**: [`Notification`](internal-8.internal.Notification.md)[]

#### Defined in

packages/medusa/dist/models/notification.d.ts:14

___

### resource\_id

• **resource\_id**: `string`

#### Defined in

packages/medusa/dist/models/notification.d.ts:7

___

### resource\_type

• **resource\_type**: `string`

#### Defined in

packages/medusa/dist/models/notification.d.ts:6

___

### to

• **to**: `string`

#### Defined in

packages/medusa/dist/models/notification.d.ts:10

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

[BaseEntity](internal-1.BaseEntity.md).[updated_at](internal-1.BaseEntity.md#updated_at)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:7
