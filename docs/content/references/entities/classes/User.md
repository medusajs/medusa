---
displayed_sidebar: entitiesSidebar
---

# Class: User

## Hierarchy

- `SoftDeletableEntity`

  ↳ **`User`**

## Constructors

### constructor

• **new User**()

#### Inherited from

SoftDeletableEntity.constructor

## Properties

### api\_token

• **api\_token**: `string`

#### Defined in

[models/user.ts:37](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/user.ts#L37)

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

### email

• **email**: `string`

#### Defined in

[models/user.ts:25](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/user.ts#L25)

___

### first\_name

• **first\_name**: `string`

#### Defined in

[models/user.ts:28](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/user.ts#L28)

___

### id

• **id**: `string`

#### Inherited from

SoftDeletableEntity.id

#### Defined in

[interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### last\_name

• **last\_name**: `string`

#### Defined in

[models/user.ts:31](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/user.ts#L31)

___

### metadata

• **metadata**: `Record`<`string`, `unknown`\>

#### Defined in

[models/user.ts:40](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/user.ts#L40)

___

### password\_hash

• **password\_hash**: `string`

#### Defined in

[models/user.ts:34](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/user.ts#L34)

___

### role

• **role**: [`UserRoles`](../enums/UserRoles.md)

#### Defined in

[models/user.ts:21](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/user.ts#L21)

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

SoftDeletableEntity.updated\_at

#### Defined in

[interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L19)

## Methods

### beforeInsert

▸ `Private` **beforeInsert**(): `void`

#### Returns

`void`

#### Defined in

[models/user.ts:42](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/user.ts#L42)
