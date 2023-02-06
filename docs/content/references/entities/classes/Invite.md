---
displayed_sidebar: entitiesSidebar
---

# Class: Invite

## Hierarchy

- `SoftDeletableEntity`

  ↳ **`Invite`**

## Constructors

### constructor

• **new Invite**()

#### Inherited from

SoftDeletableEntity.constructor

## Properties

### accepted

• **accepted**: `boolean`

#### Defined in

[models/invite.ts:23](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/invite.ts#L23)

___

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

### expires\_at

• **expires\_at**: `Date`

#### Defined in

[models/invite.ts:29](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/invite.ts#L29)

___

### id

• **id**: `string`

#### Inherited from

SoftDeletableEntity.id

#### Defined in

[interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### metadata

• **metadata**: `Record`<`string`, `unknown`\>

#### Defined in

[models/invite.ts:32](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/invite.ts#L32)

___

### role

• **role**: [`UserRoles`](../enums/UserRoles.md)

#### Defined in

[models/invite.ts:20](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/invite.ts#L20)

___

### token

• **token**: `string`

#### Defined in

[models/invite.ts:26](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/invite.ts#L26)

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

SoftDeletableEntity.updated\_at

#### Defined in

[interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L19)

___

### user\_email

• **user\_email**: `string`

#### Defined in

[models/invite.ts:12](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/invite.ts#L12)

## Methods

### beforeInsert

▸ `Private` **beforeInsert**(): `void`

#### Returns

`void`

#### Defined in

[models/invite.ts:34](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/invite.ts#L34)
