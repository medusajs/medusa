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

[interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### customer\_groups

• **customer\_groups**: [`CustomerGroup`](CustomerGroup.md)[]

#### Defined in

[models/discount-condition.ts:129](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/discount-condition.ts#L129)

___

### deleted\_at

• **deleted\_at**: ``null`` \| `Date`

#### Inherited from

SoftDeletableEntity.deleted\_at

#### Defined in

[interfaces/models/soft-deletable-entity.ts:7](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/models/soft-deletable-entity.ts#L7)

___

### discount\_rule

• **discount\_rule**: [`DiscountRule`](DiscountRule.md)

#### Defined in

[models/discount-condition.ts:59](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/discount-condition.ts#L59)

___

### discount\_rule\_id

• **discount\_rule\_id**: `string`

#### Defined in

[models/discount-condition.ts:55](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/discount-condition.ts#L55)

___

### id

• **id**: `string`

#### Inherited from

SoftDeletableEntity.id

#### Defined in

[interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### metadata

• **metadata**: `Record`<`string`, `unknown`\>

#### Defined in

[models/discount-condition.ts:132](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/discount-condition.ts#L132)

___

### operator

• **operator**: [`DiscountConditionOperator`](../enums/DiscountConditionOperator.md)

#### Defined in

[models/discount-condition.ts:51](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/discount-condition.ts#L51)

___

### product\_collections

• **product\_collections**: [`ProductCollection`](ProductCollection.md)[]

#### Defined in

[models/discount-condition.ts:115](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/discount-condition.ts#L115)

___

### product\_tags

• **product\_tags**: [`ProductTag`](ProductTag.md)[]

#### Defined in

[models/discount-condition.ts:101](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/discount-condition.ts#L101)

___

### product\_types

• **product\_types**: [`ProductType`](ProductType.md)[]

#### Defined in

[models/discount-condition.ts:87](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/discount-condition.ts#L87)

___

### products

• **products**: [`Product`](Product.md)[]

#### Defined in

[models/discount-condition.ts:73](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/discount-condition.ts#L73)

___

### type

• **type**: [`DiscountConditionType`](../enums/DiscountConditionType.md)

#### Defined in

[models/discount-condition.ts:45](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/discount-condition.ts#L45)

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

[models/discount-condition.ts:135](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/discount-condition.ts#L135)
