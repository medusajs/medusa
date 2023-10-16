---
displayed_sidebar: jsClientSidebar
---

# Class: ShippingProfile

[internal](../modules/internal-3.md).ShippingProfile

Base abstract entity for all entities

## Hierarchy

- [`SoftDeletableEntity`](internal-1.SoftDeletableEntity.md)

  ↳ **`ShippingProfile`**

## Properties

### beforeInsert

• `Private` **beforeInsert**: `any`

#### Defined in

packages/medusa/dist/models/shipping-profile.d.ts:15

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

### metadata

• **metadata**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/models/shipping-profile.d.ts:14

___

### name

• **name**: `string`

#### Defined in

packages/medusa/dist/models/shipping-profile.d.ts:10

___

### products

• **products**: [`Product`](internal-3.Product.md)[]

#### Defined in

packages/medusa/dist/models/shipping-profile.d.ts:12

___

### shipping\_options

• **shipping\_options**: [`ShippingOption`](internal-3.ShippingOption.md)[]

#### Defined in

packages/medusa/dist/models/shipping-profile.d.ts:13

___

### type

• **type**: [`ShippingProfileType`](../enums/internal-3.ShippingProfileType.md)

#### Defined in

packages/medusa/dist/models/shipping-profile.d.ts:11

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

[SoftDeletableEntity](internal-1.SoftDeletableEntity.md).[updated_at](internal-1.SoftDeletableEntity.md#updated_at)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:7
