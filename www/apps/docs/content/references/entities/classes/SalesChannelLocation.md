---
displayed_sidebar: entitiesSidebar
---

# Class: SalesChannelLocation

## Hierarchy

- `SoftDeletableEntity`

  ↳ **`SalesChannelLocation`**

## Constructors

### constructor

• **new SalesChannelLocation**()

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

### location\_id

• **location\_id**: `string`

#### Defined in

[models/sales-channel-location.ts:16](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/sales-channel-location.ts#L16)

___

### sales\_channel

• **sales\_channel**: [`SalesChannel`](SalesChannel.md)

#### Defined in

[models/sales-channel-location.ts:20](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/sales-channel-location.ts#L20)

___

### sales\_channel\_id

• **sales\_channel\_id**: `string`

#### Defined in

[models/sales-channel-location.ts:12](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/sales-channel-location.ts#L12)

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

[models/sales-channel-location.ts:23](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/sales-channel-location.ts#L23)
