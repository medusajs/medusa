---
displayed_sidebar: entitiesSidebar
---

# Class: CustomerGroup

## Hierarchy

- `SoftDeletableEntity`

  ↳ **`CustomerGroup`**

## Constructors

### constructor

• **new CustomerGroup**()

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

### customers

• **customers**: [`Customer`](Customer.md)[]

#### Defined in

[models/customer-group.ts:18](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/customer-group.ts#L18)

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

[models/customer-group.ts:26](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/customer-group.ts#L26)

___

### name

• **name**: `string`

#### Defined in

[models/customer-group.ts:13](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/customer-group.ts#L13)

___

### price\_lists

• **price\_lists**: [`PriceList`](PriceList.md)[]

#### Defined in

[models/customer-group.ts:23](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/customer-group.ts#L23)

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

[models/customer-group.ts:28](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/customer-group.ts#L28)
