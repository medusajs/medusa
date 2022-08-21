---
displayed_sidebar: jsClientSidebar
---

# Class: DiscountCondition

[internal](../modules/internal.md).DiscountCondition

Base abstract entity for all entities

## Hierarchy

- [`SoftDeletableEntity`](internal.SoftDeletableEntity.md)

  ↳ **`DiscountCondition`**

## Properties

### beforeInsert

• `Private` **beforeInsert**: `any`

#### Defined in

medusa/dist/models/discount-condition.d.ts:30

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

[SoftDeletableEntity](internal.SoftDeletableEntity.md).[created_at](internal.SoftDeletableEntity.md#created_at)

#### Defined in

medusa/dist/interfaces/models/base-entity.d.ts:6

___

### customer\_groups

• **customer\_groups**: [`CustomerGroup`](internal.CustomerGroup.md)[]

#### Defined in

medusa/dist/models/discount-condition.d.ts:28

___

### deleted\_at

• **deleted\_at**: ``null`` \| `Date`

#### Inherited from

[SoftDeletableEntity](internal.SoftDeletableEntity.md).[deleted_at](internal.SoftDeletableEntity.md#deleted_at)

#### Defined in

medusa/dist/interfaces/models/soft-deletable-entity.d.ts:3

___

### discount\_rule

• **discount\_rule**: [`DiscountRule`](internal.DiscountRule.md)

#### Defined in

medusa/dist/models/discount-condition.d.ts:23

___

### discount\_rule\_id

• **discount\_rule\_id**: `string`

#### Defined in

medusa/dist/models/discount-condition.d.ts:22

___

### id

• **id**: `string`

#### Inherited from

[SoftDeletableEntity](internal.SoftDeletableEntity.md).[id](internal.SoftDeletableEntity.md#id)

#### Defined in

medusa/dist/interfaces/models/base-entity.d.ts:5

___

### metadata

• **metadata**: `Record`<`string`, `unknown`\>

#### Defined in

medusa/dist/models/discount-condition.d.ts:29

___

### operator

• **operator**: [`DiscountConditionOperator`](../enums/internal.DiscountConditionOperator.md)

#### Defined in

medusa/dist/models/discount-condition.d.ts:21

___

### product\_collections

• **product\_collections**: [`ProductCollection`](internal.ProductCollection.md)[]

#### Defined in

medusa/dist/models/discount-condition.d.ts:27

___

### product\_tags

• **product\_tags**: [`ProductTag`](internal.ProductTag.md)[]

#### Defined in

medusa/dist/models/discount-condition.d.ts:26

___

### product\_types

• **product\_types**: [`ProductType`](internal.ProductType.md)[]

#### Defined in

medusa/dist/models/discount-condition.d.ts:25

___

### products

• **products**: [`Product`](internal.Product.md)[]

#### Defined in

medusa/dist/models/discount-condition.d.ts:24

___

### type

• **type**: [`DiscountConditionType`](../enums/internal.DiscountConditionType.md)

#### Defined in

medusa/dist/models/discount-condition.d.ts:20

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

[SoftDeletableEntity](internal.SoftDeletableEntity.md).[updated_at](internal.SoftDeletableEntity.md#updated_at)

#### Defined in

medusa/dist/interfaces/models/base-entity.d.ts:7
