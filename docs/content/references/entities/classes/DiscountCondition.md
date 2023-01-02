---
displayed_sidebar: entitiesSidebar
---

# Class: DiscountCondition

## Hierarchy

- `SoftDeletableEntity`

  ↳ **`DiscountCondition`**

## Constructors

### constructor

• **new DiscountCondition**()

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

### customer\_groups

• **customer\_groups**: [`CustomerGroup`](CustomerGroup.md)[]

#### Defined in

[models/discount-condition.ts:127](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/discount-condition.ts#L127)

___

### deleted\_at

• **deleted\_at**: ``null`` \| `Date`

#### Inherited from

SoftDeletableEntity.deleted\_at

#### Defined in

[interfaces/models/soft-deletable-entity.ts:7](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/soft-deletable-entity.ts#L7)

___

### discount\_rule

• **discount\_rule**: [`DiscountRule`](DiscountRule.md)

#### Defined in

[models/discount-condition.ts:57](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/discount-condition.ts#L57)

___

### discount\_rule\_id

• **discount\_rule\_id**: `string`

#### Defined in

[models/discount-condition.ts:53](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/discount-condition.ts#L53)

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

[models/discount-condition.ts:130](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/discount-condition.ts#L130)

___

### operator

• **operator**: [`DiscountConditionOperator`](../enums/DiscountConditionOperator.md)

#### Defined in

[models/discount-condition.ts:49](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/discount-condition.ts#L49)

___

### product\_collections

• **product\_collections**: [`ProductCollection`](ProductCollection.md)[]

#### Defined in

[models/discount-condition.ts:113](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/discount-condition.ts#L113)

___

### product\_tags

• **product\_tags**: [`ProductTag`](ProductTag.md)[]

#### Defined in

[models/discount-condition.ts:99](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/discount-condition.ts#L99)

___

### product\_types

• **product\_types**: [`ProductType`](ProductType.md)[]

#### Defined in

[models/discount-condition.ts:85](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/discount-condition.ts#L85)

___

### products

• **products**: [`Product`](Product.md)[]

#### Defined in

[models/discount-condition.ts:71](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/discount-condition.ts#L71)

___

### type

• **type**: [`DiscountConditionType`](../enums/DiscountConditionType.md)

#### Defined in

[models/discount-condition.ts:43](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/discount-condition.ts#L43)

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

[models/discount-condition.ts:132](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/discount-condition.ts#L132)
