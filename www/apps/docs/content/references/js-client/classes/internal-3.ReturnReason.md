---
displayed_sidebar: jsClientSidebar
---

# Class: ReturnReason

[internal](../modules/internal-3.md).ReturnReason

Base abstract entity for all entities

## Hierarchy

- [`SoftDeletableEntity`](internal-1.SoftDeletableEntity.md)

  ↳ **`ReturnReason`**

## Properties

### beforeInsert

• `Private` **beforeInsert**: `any`

#### Defined in

packages/medusa/dist/models/return-reason.d.ts:10

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

• **description**: `string`

#### Defined in

packages/medusa/dist/models/return-reason.d.ts:5

___

### id

• **id**: `string`

#### Inherited from

[SoftDeletableEntity](internal-1.SoftDeletableEntity.md).[id](internal-1.SoftDeletableEntity.md#id)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:5

___

### label

• **label**: `string`

#### Defined in

packages/medusa/dist/models/return-reason.d.ts:4

___

### metadata

• **metadata**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/models/return-reason.d.ts:9

___

### parent\_return\_reason

• **parent\_return\_reason**: ``null`` \| [`ReturnReason`](internal-3.ReturnReason.md)

#### Defined in

packages/medusa/dist/models/return-reason.d.ts:7

___

### parent\_return\_reason\_id

• **parent\_return\_reason\_id**: ``null`` \| `string`

#### Defined in

packages/medusa/dist/models/return-reason.d.ts:6

___

### return\_reason\_children

• **return\_reason\_children**: [`ReturnReason`](internal-3.ReturnReason.md)[]

#### Defined in

packages/medusa/dist/models/return-reason.d.ts:8

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

[SoftDeletableEntity](internal-1.SoftDeletableEntity.md).[updated_at](internal-1.SoftDeletableEntity.md#updated_at)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:7

___

### value

• **value**: `string`

#### Defined in

packages/medusa/dist/models/return-reason.d.ts:3
