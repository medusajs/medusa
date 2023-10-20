---
displayed_sidebar: jsClientSidebar
---

# Class: Customer

[internal](../modules/internal-3.md).Customer

Base abstract entity for all entities

## Hierarchy

- [`SoftDeletableEntity`](internal-1.SoftDeletableEntity.md)

  ↳ **`Customer`**

## Properties

### beforeInsert

• `Private` **beforeInsert**: `any`

#### Defined in

packages/medusa/dist/models/customer.d.ts:18

___

### billing\_address

• **billing\_address**: [`Address`](internal-3.Address.md)

#### Defined in

packages/medusa/dist/models/customer.d.ts:10

___

### billing\_address\_id

• **billing\_address\_id**: ``null`` \| `string`

#### Defined in

packages/medusa/dist/models/customer.d.ts:9

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

[SoftDeletableEntity](internal-1.SoftDeletableEntity.md).[created_at](internal-1.SoftDeletableEntity.md#created_at)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:6

___

### deleted\_at

• **deleted\_at**: ``null`` \| `Date`

#### Inherited from

[SoftDeletableEntity](internal-1.SoftDeletableEntity.md).[deleted_at](internal-1.SoftDeletableEntity.md#deleted_at)

#### Defined in

packages/medusa/dist/interfaces/models/soft-deletable-entity.d.ts:3

___

### email

• **email**: `string`

#### Defined in

packages/medusa/dist/models/customer.d.ts:6

___

### first\_name

• **first\_name**: `string`

#### Defined in

packages/medusa/dist/models/customer.d.ts:7

___

### groups

• **groups**: [`CustomerGroup`](internal-3.CustomerGroup.md)[]

#### Defined in

packages/medusa/dist/models/customer.d.ts:16

___

### has\_account

• **has\_account**: `boolean`

#### Defined in

packages/medusa/dist/models/customer.d.ts:14

___

### id

• **id**: `string`

#### Inherited from

[SoftDeletableEntity](internal-1.SoftDeletableEntity.md).[id](internal-1.SoftDeletableEntity.md#id)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:5

___

### last\_name

• **last\_name**: `string`

#### Defined in

packages/medusa/dist/models/customer.d.ts:8

___

### metadata

• **metadata**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/models/customer.d.ts:17

___

### orders

• **orders**: [`Order`](internal-3.Order.md)[]

#### Defined in

packages/medusa/dist/models/customer.d.ts:15

___

### password\_hash

• **password\_hash**: `string`

#### Defined in

packages/medusa/dist/models/customer.d.ts:12

___

### phone

• **phone**: `string`

#### Defined in

packages/medusa/dist/models/customer.d.ts:13

___

### shipping\_addresses

• **shipping\_addresses**: [`Address`](internal-3.Address.md)[]

#### Defined in

packages/medusa/dist/models/customer.d.ts:11

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

[SoftDeletableEntity](internal-1.SoftDeletableEntity.md).[updated_at](internal-1.SoftDeletableEntity.md#updated_at)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:7
