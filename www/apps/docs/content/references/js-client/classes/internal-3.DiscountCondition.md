---
displayed_sidebar: jsClientSidebar
---

# Class: DiscountCondition

[internal](../modules/internal-3.md).DiscountCondition

Base abstract entity for all entities

## Hierarchy

- [`SoftDeletableEntity`](internal-1.SoftDeletableEntity.md)

  ↳ **`DiscountCondition`**

## Properties

### beforeInsert

• `Private` **beforeInsert**: `any`

#### Defined in

packages/medusa/dist/models/discount-condition.d.ts:30

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

[SoftDeletableEntity](internal-1.SoftDeletableEntity.md).[created_at](internal-1.SoftDeletableEntity.md#created_at)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:6

___

### customer\_groups

• **customer\_groups**: [`CustomerGroup`](internal-3.CustomerGroup.md)[]

#### Defined in

packages/medusa/dist/models/discount-condition.d.ts:28

___

### deleted\_at

• **deleted\_at**: ``null`` \| `Date`

#### Inherited from

[SoftDeletableEntity](internal-1.SoftDeletableEntity.md).[deleted_at](internal-1.SoftDeletableEntity.md#deleted_at)

#### Defined in

packages/medusa/dist/interfaces/models/soft-deletable-entity.d.ts:3

___

### discount\_rule

• **discount\_rule**: [`DiscountRule`](internal-3.DiscountRule.md)

#### Defined in

packages/medusa/dist/models/discount-condition.d.ts:23

___

### discount\_rule\_id

• **discount\_rule\_id**: `string`

#### Defined in

packages/medusa/dist/models/discount-condition.d.ts:22

___

### id

• **id**: `string`

#### Inherited from

[SoftDeletableEntity](internal-1.SoftDeletableEntity.md).[id](internal-1.SoftDeletableEntity.md#id)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:5

___

### metadata

• **metadata**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/models/discount-condition.d.ts:29

___

### operator

• **operator**: [`DiscountConditionOperator`](../enums/internal-3.DiscountConditionOperator.md)

#### Defined in

packages/medusa/dist/models/discount-condition.d.ts:21

___

### product\_collections

• **product\_collections**: [`ProductCollection`](internal-3.ProductCollection.md)[]

#### Defined in

packages/medusa/dist/models/discount-condition.d.ts:27

___

### product\_tags

• **product\_tags**: [`ProductTag`](internal-3.ProductTag.md)[]

#### Defined in

packages/medusa/dist/models/discount-condition.d.ts:26

___

### product\_types

• **product\_types**: [`ProductType`](internal-3.ProductType.md)[]

#### Defined in

packages/medusa/dist/models/discount-condition.d.ts:25

___

### products

• **products**: [`Product`](internal-3.Product.md)[]

#### Defined in

packages/medusa/dist/models/discount-condition.d.ts:24

___

### type

• **type**: [`DiscountConditionType`](../enums/internal-3.DiscountConditionType.md)

#### Defined in

packages/medusa/dist/models/discount-condition.d.ts:20

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

[SoftDeletableEntity](internal-1.SoftDeletableEntity.md).[updated_at](internal-1.SoftDeletableEntity.md#updated_at)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:7
