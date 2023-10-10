---
displayed_sidebar: entitiesSidebar
---

# Class: ShippingProfile

## Hierarchy

- `SoftDeletableEntity`

  ↳ **`ShippingProfile`**

## Constructors

### constructor

• **new ShippingProfile**()

#### Inherited from

SoftDeletableEntity.constructor

## Properties

### created\_at

• **created\_at**: `Date`

#### Inherited from

SoftDeletableEntity.created\_at

#### Defined in

[interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### deleted\_at

• **deleted\_at**: ``null`` \| `Date`

#### Inherited from

SoftDeletableEntity.deleted\_at

#### Defined in

[interfaces/models/soft-deletable-entity.ts:7](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/models/soft-deletable-entity.ts#L7)

___

### id

• **id**: `string`

#### Inherited from

SoftDeletableEntity.id

#### Defined in

[interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### metadata

• **metadata**: `Record`<`string`, `unknown`\>

#### Defined in

[models/shipping-profile.ts:47](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/shipping-profile.ts#L47)

___

### name

• **name**: `string`

#### Defined in

[models/shipping-profile.ts:24](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/shipping-profile.ts#L24)

___

### products

• **products**: [`Product`](Product.md)[]

#### Defined in

[models/shipping-profile.ts:41](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/shipping-profile.ts#L41)

___

### shipping\_options

• **shipping\_options**: [`ShippingOption`](ShippingOption.md)[]

#### Defined in

[models/shipping-profile.ts:44](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/shipping-profile.ts#L44)

___

### type

• **type**: [`ShippingProfileType`](../enums/ShippingProfileType.md)

#### Defined in

[models/shipping-profile.ts:27](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/shipping-profile.ts#L27)

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

SoftDeletableEntity.updated\_at

#### Defined in

[interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/models/base-entity.ts#L19)

## Methods

### beforeInsert

▸ `Private` **beforeInsert**(): `void`

#### Returns

`void`

#### Defined in

[models/shipping-profile.ts:50](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/shipping-profile.ts#L50)
