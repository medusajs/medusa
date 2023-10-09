---
displayed_sidebar: entitiesSidebar
---

# Class: SalesChannel

## Hierarchy

- `SoftDeletableEntity`

  ↳ **`SalesChannel`**

## Constructors

### constructor

• **new SalesChannel**()

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

### description

• **description**: ``null`` \| `string`

#### Defined in

[models/sales-channel.ts:14](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/sales-channel.ts#L14)

___

### id

• **id**: `string`

#### Inherited from

SoftDeletableEntity.id

#### Defined in

[interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### is\_disabled

• **is\_disabled**: `boolean`

#### Defined in

[models/sales-channel.ts:17](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/sales-channel.ts#L17)

___

### locations

• **locations**: [`SalesChannelLocation`](SalesChannelLocation.md)[]

#### Defined in

[models/sales-channel.ts:29](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/sales-channel.ts#L29)

___

### metadata

• **metadata**: ``null`` \| `Record`<`string`, `unknown`\>

#### Defined in

[models/sales-channel.ts:20](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/sales-channel.ts#L20)

___

### name

• **name**: `string`

#### Defined in

[models/sales-channel.ts:11](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/sales-channel.ts#L11)

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

[models/sales-channel.ts:32](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/sales-channel.ts#L32)
