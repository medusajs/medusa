# Note

A Note is an element that can be used in association with different resources to allow admin users to describe additional information. For example, they can be used to add additional information about orders.

## Hierarchy

- [`SoftDeletableEntity`](SoftDeletableEntity.md)

  ↳ **`Note`**

## Constructors

### constructor

**new Note**()

A Note is an element that can be used in association with different resources to allow admin users to describe additional information. For example, they can be used to add additional information about orders.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[constructor](SoftDeletableEntity.md#constructor)

## Properties

### author

 **author**: [`User`](User.md)

The details of the user that created the note.

#### Defined in

[packages/medusa/src/models/note.ts:33](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/note.ts#L33)

___

### author\_id

 **author\_id**: `string`

The ID of the user that created the note.

#### Defined in

[packages/medusa/src/models/note.ts:29](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/note.ts#L29)

___

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

The note's ID

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[id](SoftDeletableEntity.md#id)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### metadata

 **metadata**: Record<`string`, `unknown`\>

An optional key-value map with additional details

#### Defined in

[packages/medusa/src/models/note.ts:36](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/note.ts#L36)

___

### resource\_id

 **resource\_id**: `string`

The ID of the resource that the Note refers to.

#### Defined in

[packages/medusa/src/models/note.ts:26](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/note.ts#L26)

___

### resource\_type

 **resource\_type**: `string`

The type of resource that the Note refers to.

#### Defined in

[packages/medusa/src/models/note.ts:22](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/note.ts#L22)

___

### updated\_at

 **updated\_at**: `Date`

The date with timezone at which the resource was updated.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[updated_at](SoftDeletableEntity.md#updated_at)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/base-entity.ts#L19)

___

### value

 **value**: `string`

The contents of the note.

#### Defined in

[packages/medusa/src/models/note.ts:18](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/note.ts#L18)

## Methods

### beforeInsert

`Private` **beforeInsert**(): `void`

#### Returns

`void`

-`void`: (optional) 

#### Defined in

[packages/medusa/src/models/note.ts:42](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/note.ts#L42)
