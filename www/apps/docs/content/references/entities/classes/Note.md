---
displayed_sidebar: entitiesSidebar
---

# Class: Note

## Hierarchy

- `SoftDeletableEntity`

  ↳ **`Note`**

## Constructors

### constructor

• **new Note**()

#### Inherited from

SoftDeletableEntity.constructor

## Properties

### author

• **author**: [`User`](User.md)

#### Defined in

[models/note.ts:33](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/note.ts#L33)

___

### author\_id

• **author\_id**: `string`

#### Defined in

[models/note.ts:29](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/note.ts#L29)

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

[models/note.ts:36](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/note.ts#L36)

___

### resource\_id

• **resource\_id**: `string`

#### Defined in

[models/note.ts:26](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/note.ts#L26)

___

### resource\_type

• **resource\_type**: `string`

#### Defined in

[models/note.ts:22](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/note.ts#L22)

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

SoftDeletableEntity.updated\_at

#### Defined in

[interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L19)

___

### value

• **value**: `string`

#### Defined in

[models/note.ts:18](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/note.ts#L18)

## Methods

### beforeInsert

▸ `Private` **beforeInsert**(): `void`

#### Returns

`void`

#### Defined in

[models/note.ts:38](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/note.ts#L38)
