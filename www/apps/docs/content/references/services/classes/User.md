# User

A User is an administrator who can manage store settings and data.

## Hierarchy

- [`SoftDeletableEntity`](SoftDeletableEntity.md)

  ↳ **`User`**

## Constructors

### constructor

**new User**()

A User is an administrator who can manage store settings and data.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[constructor](SoftDeletableEntity.md#constructor)

## Properties

### api\_token

 **api\_token**: `string`

An API token associated with the user.

#### Defined in

[packages/medusa/src/models/user.ts:54](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/user.ts#L54)

___

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

### email

 **email**: `string`

The email of the User

#### Defined in

[packages/medusa/src/models/user.ts:39](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/user.ts#L39)

___

### first\_name

 **first\_name**: `string`

The first name of the User

#### Defined in

[packages/medusa/src/models/user.ts:42](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/user.ts#L42)

___

### id

 **id**: `string`

The user's ID

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[id](SoftDeletableEntity.md#id)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### last\_name

 **last\_name**: `string`

The last name of the User

#### Defined in

[packages/medusa/src/models/user.ts:45](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/user.ts#L45)

___

### metadata

 **metadata**: Record<`string`, `unknown`\>

An optional key-value map with additional details

#### Defined in

[packages/medusa/src/models/user.ts:57](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/user.ts#L57)

___

### password\_hash

 **password\_hash**: `string`

#### Defined in

[packages/medusa/src/models/user.ts:51](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/user.ts#L51)

___

### role

 **role**: [`UserRoles`](../enums/UserRoles.md) = `member`

The user's role. These roles don't provide any different privileges.

#### Defined in

[packages/medusa/src/models/user.ts:35](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/user.ts#L35)

___

### updated\_at

 **updated\_at**: `Date`

The date with timezone at which the resource was updated.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[updated_at](SoftDeletableEntity.md#updated_at)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/models/base-entity.ts#L19)

## Methods

### beforeInsert

`Private` **beforeInsert**(): `void`

#### Returns

`void`

-`void`: (optional) 

#### Defined in

[packages/medusa/src/models/user.ts:63](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/user.ts#L63)
