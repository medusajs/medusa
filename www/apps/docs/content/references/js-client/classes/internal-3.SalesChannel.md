---
displayed_sidebar: jsClientSidebar
---

# Class: SalesChannel

[internal](../modules/internal-3.md).SalesChannel

Base abstract entity for all entities

## Hierarchy

- [`SoftDeletableEntity`](internal-1.SoftDeletableEntity.md)

  ↳ **`SalesChannel`**

## Properties

### beforeInsert

• `Private` **beforeInsert**: `any`

#### Defined in

packages/medusa/dist/models/sales-channel.d.ts:9

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

### description

• **description**: ``null`` \| `string`

#### Defined in

packages/medusa/dist/models/sales-channel.d.ts:5

___

### id

• **id**: `string`

#### Inherited from

[SoftDeletableEntity](internal-1.SoftDeletableEntity.md).[id](internal-1.SoftDeletableEntity.md#id)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:5

___

### is\_disabled

• **is\_disabled**: `boolean`

#### Defined in

packages/medusa/dist/models/sales-channel.d.ts:6

___

### locations

• **locations**: [`SalesChannelLocation`](internal-3.SalesChannelLocation.md)[]

#### Defined in

packages/medusa/dist/models/sales-channel.d.ts:8

___

### metadata

• **metadata**: ``null`` \| [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/models/sales-channel.d.ts:7

___

### name

• **name**: `string`

#### Defined in

packages/medusa/dist/models/sales-channel.d.ts:4

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

[SoftDeletableEntity](internal-1.SoftDeletableEntity.md).[updated_at](internal-1.SoftDeletableEntity.md#updated_at)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:7
