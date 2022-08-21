---
displayed_sidebar: jsClientSidebar
---

# Class: Customer

[internal](../modules/internal.md).Customer

Base abstract entity for all entities

## Hierarchy

- [`SoftDeletableEntity`](internal.SoftDeletableEntity.md)

  ↳ **`Customer`**

## Properties

### beforeInsert

• `Private` **beforeInsert**: `any`

#### Defined in

medusa/dist/models/customer.d.ts:18

___

### billing\_address

• **billing\_address**: [`Address`](internal.Address.md)

#### Defined in

medusa/dist/models/customer.d.ts:10

___

### billing\_address\_id

• **billing\_address\_id**: ``null`` \| `string`

#### Defined in

medusa/dist/models/customer.d.ts:9

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

[SoftDeletableEntity](internal.SoftDeletableEntity.md).[created_at](internal.SoftDeletableEntity.md#created_at)

#### Defined in

medusa/dist/interfaces/models/base-entity.d.ts:6

___

### deleted\_at

• **deleted\_at**: ``null`` \| `Date`

#### Inherited from

[SoftDeletableEntity](internal.SoftDeletableEntity.md).[deleted_at](internal.SoftDeletableEntity.md#deleted_at)

#### Defined in

medusa/dist/interfaces/models/soft-deletable-entity.d.ts:3

___

### email

• **email**: `string`

#### Defined in

medusa/dist/models/customer.d.ts:6

___

### first\_name

• **first\_name**: `string`

#### Defined in

medusa/dist/models/customer.d.ts:7

___

### groups

• **groups**: [`CustomerGroup`](internal.CustomerGroup.md)[]

#### Defined in

medusa/dist/models/customer.d.ts:16

___

### has\_account

• **has\_account**: `boolean`

#### Defined in

medusa/dist/models/customer.d.ts:14

___

### id

• **id**: `string`

#### Inherited from

[SoftDeletableEntity](internal.SoftDeletableEntity.md).[id](internal.SoftDeletableEntity.md#id)

#### Defined in

medusa/dist/interfaces/models/base-entity.d.ts:5

___

### last\_name

• **last\_name**: `string`

#### Defined in

medusa/dist/models/customer.d.ts:8

___

### metadata

• **metadata**: `Record`<`string`, `unknown`\>

#### Defined in

medusa/dist/models/customer.d.ts:17

___

### orders

• **orders**: [`Order`](internal.Order.md)[]

#### Defined in

medusa/dist/models/customer.d.ts:15

___

### password\_hash

• **password\_hash**: `string`

#### Defined in

medusa/dist/models/customer.d.ts:12

___

### phone

• **phone**: `string`

#### Defined in

medusa/dist/models/customer.d.ts:13

___

### shipping\_addresses

• **shipping\_addresses**: [`Address`](internal.Address.md)[]

#### Defined in

medusa/dist/models/customer.d.ts:11

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

[SoftDeletableEntity](internal.SoftDeletableEntity.md).[updated_at](internal.SoftDeletableEntity.md#updated_at)

#### Defined in

medusa/dist/interfaces/models/base-entity.d.ts:7
