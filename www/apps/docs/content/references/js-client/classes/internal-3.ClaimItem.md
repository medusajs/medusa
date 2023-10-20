---
displayed_sidebar: jsClientSidebar
---

# Class: ClaimItem

[internal](../modules/internal-3.md).ClaimItem

Base abstract entity for all entities

## Hierarchy

- [`SoftDeletableEntity`](internal-1.SoftDeletableEntity.md)

  ↳ **`ClaimItem`**

## Properties

### beforeInsert

• `Private` **beforeInsert**: `any`

#### Defined in

packages/medusa/dist/models/claim-item.d.ts:26

___

### claim\_order

• **claim\_order**: [`ClaimOrder`](internal-3.ClaimOrder.md)

#### Defined in

packages/medusa/dist/models/claim-item.d.ts:16

___

### claim\_order\_id

• **claim\_order\_id**: `string`

#### Defined in

packages/medusa/dist/models/claim-item.d.ts:15

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

### id

• **id**: `string`

#### Inherited from

[SoftDeletableEntity](internal-1.SoftDeletableEntity.md).[id](internal-1.SoftDeletableEntity.md#id)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:5

___

### images

• **images**: [`ClaimImage`](internal-3.ClaimImage.md)[]

#### Defined in

packages/medusa/dist/models/claim-item.d.ts:14

___

### item

• **item**: [`LineItem`](internal-3.LineItem.md)

#### Defined in

packages/medusa/dist/models/claim-item.d.ts:18

___

### item\_id

• **item\_id**: `string`

#### Defined in

packages/medusa/dist/models/claim-item.d.ts:17

___

### metadata

• **metadata**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/models/claim-item.d.ts:25

___

### note

• **note**: `string`

#### Defined in

packages/medusa/dist/models/claim-item.d.ts:22

___

### quantity

• **quantity**: `number`

#### Defined in

packages/medusa/dist/models/claim-item.d.ts:23

___

### reason

• **reason**: [`ClaimReason`](../enums/internal-3.ClaimReason.md)

#### Defined in

packages/medusa/dist/models/claim-item.d.ts:21

___

### tags

• **tags**: [`ClaimTag`](internal-3.ClaimTag.md)[]

#### Defined in

packages/medusa/dist/models/claim-item.d.ts:24

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

[SoftDeletableEntity](internal-1.SoftDeletableEntity.md).[updated_at](internal-1.SoftDeletableEntity.md#updated_at)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:7

___

### variant

• **variant**: [`ProductVariant`](internal-3.ProductVariant.md)

#### Defined in

packages/medusa/dist/models/claim-item.d.ts:20

___

### variant\_id

• **variant\_id**: `string`

#### Defined in

packages/medusa/dist/models/claim-item.d.ts:19
