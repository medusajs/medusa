# SalesChannelLocation

This represents the association between a sales channel and a stock locations.

## Hierarchy

- [`SoftDeletableEntity`](SoftDeletableEntity.md)

  ↳ **`SalesChannelLocation`**

## Constructors

### constructor

**new SalesChannelLocation**()

This represents the association between a sales channel and a stock locations.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[constructor](SoftDeletableEntity.md#constructor)

## Properties

### created\_at

 **created\_at**: `Date`

The date with timezone at which the resource was created.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[created_at](SoftDeletableEntity.md#created_at)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### deleted\_at

 **deleted\_at**: ``null`` \| `Date`

The date with timezone at which the resource was deleted.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[deleted_at](SoftDeletableEntity.md#deleted_at)

#### Defined in

[packages/medusa/src/interfaces/models/soft-deletable-entity.ts:7](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/soft-deletable-entity.ts#L7)

___

### id

 **id**: `string`

The Sales Channel Stock Location's ID

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[id](SoftDeletableEntity.md#id)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### location\_id

 **location\_id**: `string`

The ID of the Location Stock.

#### Defined in

[packages/medusa/src/models/sales-channel-location.ts:16](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/sales-channel-location.ts#L16)

___

### sales\_channel

 **sales\_channel**: [`SalesChannel`](SalesChannel.md)

The details of the sales channel the location is associated with.

#### Defined in

[packages/medusa/src/models/sales-channel-location.ts:20](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/sales-channel-location.ts#L20)

___

### sales\_channel\_id

 **sales\_channel\_id**: `string`

The ID of the Sales Channel

#### Defined in

[packages/medusa/src/models/sales-channel-location.ts:12](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/sales-channel-location.ts#L12)

___

### updated\_at

 **updated\_at**: `Date`

The date with timezone at which the resource was updated.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[updated_at](SoftDeletableEntity.md#updated_at)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/base-entity.ts#L19)

## Methods

### beforeInsert

`Private` **beforeInsert**(): `void`

#### Returns

`void`

-`void`: (optional) 

#### Defined in

[packages/medusa/src/models/sales-channel-location.ts:26](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/sales-channel-location.ts#L26)
