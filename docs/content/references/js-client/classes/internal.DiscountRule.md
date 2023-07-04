---
displayed_sidebar: jsClientSidebar
---

# Class: DiscountRule

[internal](../modules/internal.md).DiscountRule

Base abstract entity for all entities

## Hierarchy

- [`SoftDeletableEntity`](internal.SoftDeletableEntity.md)

  ↳ **`DiscountRule`**

## Properties

### allocation

• **allocation**: [`AllocationType`](../enums/internal.AllocationType.md)

#### Defined in

medusa/dist/models/discount-rule.d.ts:16

___

### beforeInsert

• `Private` **beforeInsert**: `any`

#### Defined in

medusa/dist/models/discount-rule.d.ts:19

___

### conditions

• **conditions**: [`DiscountCondition`](internal.DiscountCondition.md)[]

#### Defined in

medusa/dist/models/discount-rule.d.ts:17

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

[SoftDeletableEntity](internal.SoftDeletableEntity.md).[created_at](internal.SoftDeletableEntity.md#created_at)

#### Defined in

medusa/dist/interfaces/models/base-entity.d.ts:6

___

### deleted\_at

• **deleted\_at**: ``null`` \| `Date`

#### Inherited from

[SoftDeletableEntity](internal.SoftDeletableEntity.md).[deleted_at](internal.SoftDeletableEntity.md#deleted_at)

#### Defined in

medusa/dist/interfaces/models/soft-deletable-entity.d.ts:3

___

### description

• **description**: `string`

#### Defined in

medusa/dist/models/discount-rule.d.ts:13

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

medusa/dist/models/discount-rule.d.ts:18

___

### type

• **type**: [`DiscountRuleType`](../enums/internal.DiscountRuleType.md)

#### Defined in

medusa/dist/models/discount-rule.d.ts:14

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

[SoftDeletableEntity](internal.SoftDeletableEntity.md).[updated_at](internal.SoftDeletableEntity.md#updated_at)

#### Defined in

medusa/dist/interfaces/models/base-entity.d.ts:7

___

### value

• **value**: `number`

#### Defined in

medusa/dist/models/discount-rule.d.ts:15
