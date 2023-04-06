---
displayed_sidebar: jsClientSidebar
---

# Class: ShippingProfile

[internal](../modules/internal.md).ShippingProfile

Base abstract entity for all entities

## Hierarchy

- [`SoftDeletableEntity`](internal.SoftDeletableEntity.md)

  ↳ **`ShippingProfile`**

## Properties

### beforeInsert

• `Private` **beforeInsert**: `any`

#### Defined in

medusa/dist/models/shipping-profile.d.ts:15

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

### id

• **id**: `string`

#### Inherited from

[SoftDeletableEntity](internal.SoftDeletableEntity.md).[id](internal.SoftDeletableEntity.md#id)

#### Defined in

medusa/dist/interfaces/models/base-entity.d.ts:5

___

### metadata

• **metadata**: `Record`<`string`, `unknown`\>

#### Defined in

medusa/dist/models/shipping-profile.d.ts:14

___

### name

• **name**: `string`

#### Defined in

medusa/dist/models/shipping-profile.d.ts:10

___

### products

• **products**: [`Product`](internal.Product.md)[]

#### Defined in

medusa/dist/models/shipping-profile.d.ts:12

___

### shipping\_options

• **shipping\_options**: [`ShippingOption`](internal.ShippingOption.md)[]

#### Defined in

medusa/dist/models/shipping-profile.d.ts:13

___

### type

• **type**: [`ShippingProfileType`](../enums/internal.ShippingProfileType.md)

#### Defined in

medusa/dist/models/shipping-profile.d.ts:11

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

[SoftDeletableEntity](internal.SoftDeletableEntity.md).[updated_at](internal.SoftDeletableEntity.md#updated_at)

#### Defined in

medusa/dist/interfaces/models/base-entity.d.ts:7
