---
displayed_sidebar: entitiesSidebar
---

# Class: TrackingLink

## Hierarchy

- `SoftDeletableEntity`

  ↳ **`TrackingLink`**

## Constructors

### constructor

• **new TrackingLink**()

#### Inherited from

SoftDeletableEntity.constructor

## Properties

### created\_at

• **created\_at**: `Date`

#### Inherited from

SoftDeletableEntity.created\_at

#### Defined in

[interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### deleted\_at

• **deleted\_at**: ``null`` \| `Date`

#### Inherited from

SoftDeletableEntity.deleted\_at

#### Defined in

[interfaces/models/soft-deletable-entity.ts:7](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/soft-deletable-entity.ts#L7)

___

### fulfillment

• **fulfillment**: [`Fulfillment`](Fulfillment.md)

#### Defined in

[models/tracking-link.ts:21](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/tracking-link.ts#L21)

___

### fulfillment\_id

• **fulfillment\_id**: `string`

#### Defined in

[models/tracking-link.ts:17](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/tracking-link.ts#L17)

___

### id

• **id**: `string`

#### Inherited from

SoftDeletableEntity.id

#### Defined in

[interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### idempotency\_key

• **idempotency\_key**: `string`

#### Defined in

[models/tracking-link.ts:24](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/tracking-link.ts#L24)

___

### metadata

• **metadata**: `Record`<`string`, `unknown`\>

#### Defined in

[models/tracking-link.ts:27](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/tracking-link.ts#L27)

___

### tracking\_number

• **tracking\_number**: `string`

#### Defined in

[models/tracking-link.ts:14](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/tracking-link.ts#L14)

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

SoftDeletableEntity.updated\_at

#### Defined in

[interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L19)

___

### url

• **url**: `string`

#### Defined in

[models/tracking-link.ts:11](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/tracking-link.ts#L11)

## Methods

### beforeInsert

▸ `Private` **beforeInsert**(): `void`

#### Returns

`void`

#### Defined in

[models/tracking-link.ts:29](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/tracking-link.ts#L29)
