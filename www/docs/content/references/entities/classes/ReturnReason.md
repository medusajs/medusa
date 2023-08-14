---
displayed_sidebar: entitiesSidebar
---

# Class: ReturnReason

## Hierarchy

- `SoftDeletableEntity`

  ↳ **`ReturnReason`**

## Constructors

### constructor

• **new ReturnReason**()

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

### description

• **description**: `string`

#### Defined in

[models/return-reason.ts:25](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/return-reason.ts#L25)

___

### id

• **id**: `string`

#### Inherited from

SoftDeletableEntity.id

#### Defined in

[interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### label

• **label**: `string`

#### Defined in

[models/return-reason.ts:22](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/return-reason.ts#L22)

___

### metadata

• **metadata**: `Record`<`string`, `unknown`\>

#### Defined in

[models/return-reason.ts:42](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/return-reason.ts#L42)

___

### parent\_return\_reason

• **parent\_return\_reason**: ``null`` \| [`ReturnReason`](ReturnReason.md)

#### Defined in

[models/return-reason.ts:32](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/return-reason.ts#L32)

___

### parent\_return\_reason\_id

• **parent\_return\_reason\_id**: ``null`` \| `string`

#### Defined in

[models/return-reason.ts:28](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/return-reason.ts#L28)

___

### return\_reason\_children

• **return\_reason\_children**: [`ReturnReason`](ReturnReason.md)[]

#### Defined in

[models/return-reason.ts:39](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/return-reason.ts#L39)

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

[models/return-reason.ts:19](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/return-reason.ts#L19)

## Methods

### beforeInsert

▸ `Private` **beforeInsert**(): `void`

#### Returns

`void`

#### Defined in

[models/return-reason.ts:44](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/return-reason.ts#L44)
