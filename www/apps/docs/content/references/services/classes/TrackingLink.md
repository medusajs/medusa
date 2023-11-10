# TrackingLink

A tracking link holds information about tracking numbers for a Fulfillment. Tracking Links can optionally contain a URL that can be visited to see the status of the shipment. Typically, the tracking link is provided from the third-party service integrated through the used fulfillment provider.

## Hierarchy

- [`SoftDeletableEntity`](SoftDeletableEntity.md)

  ↳ **`TrackingLink`**

## Constructors

### constructor

**new TrackingLink**()

A tracking link holds information about tracking numbers for a Fulfillment. Tracking Links can optionally contain a URL that can be visited to see the status of the shipment. Typically, the tracking link is provided from the third-party service integrated through the used fulfillment provider.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[constructor](SoftDeletableEntity.md#constructor)

## Properties

### created\_at

 **created\_at**: `Date`

The date with timezone at which the resource was created.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[created_at](SoftDeletableEntity.md#created_at)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### deleted\_at

 **deleted\_at**: ``null`` \| `Date`

The date with timezone at which the resource was deleted.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[deleted_at](SoftDeletableEntity.md#deleted_at)

#### Defined in

[packages/medusa/src/interfaces/models/soft-deletable-entity.ts:7](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/models/soft-deletable-entity.ts#L7)

___

### fulfillment

 **fulfillment**: [`Fulfillment`](Fulfillment.md)

The details of the fulfillment that the tracking link belongs to.

#### Defined in

[packages/medusa/src/models/tracking-link.ts:21](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/tracking-link.ts#L21)

___

### fulfillment\_id

 **fulfillment\_id**: `string`

The ID of the fulfillment that the tracking link belongs to.

#### Defined in

[packages/medusa/src/models/tracking-link.ts:17](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/tracking-link.ts#L17)

___

### id

 **id**: `string`

The tracking link's ID

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[id](SoftDeletableEntity.md#id)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### idempotency\_key

 **idempotency\_key**: `string`

Randomly generated key used to continue the completion of a process in case of failure.

#### Defined in

[packages/medusa/src/models/tracking-link.ts:24](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/tracking-link.ts#L24)

___

### metadata

 **metadata**: Record<`string`, `unknown`\>

An optional key-value map with additional details

#### Defined in

[packages/medusa/src/models/tracking-link.ts:27](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/tracking-link.ts#L27)

___

### tracking\_number

 **tracking\_number**: `string`

The tracking number given by the shipping carrier.

#### Defined in

[packages/medusa/src/models/tracking-link.ts:14](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/tracking-link.ts#L14)

___

### updated\_at

 **updated\_at**: `Date`

The date with timezone at which the resource was updated.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[updated_at](SoftDeletableEntity.md#updated_at)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/models/base-entity.ts#L19)

___

### url

 **url**: `string`

The URL at which the status of the shipment can be tracked.

#### Defined in

[packages/medusa/src/models/tracking-link.ts:11](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/tracking-link.ts#L11)

## Methods

### beforeInsert

`Private` **beforeInsert**(): `void`

#### Returns

`void`

-`void`: (optional) 

#### Defined in

[packages/medusa/src/models/tracking-link.ts:33](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/tracking-link.ts#L33)
