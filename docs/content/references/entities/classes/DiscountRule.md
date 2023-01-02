---
displayed_sidebar: entitiesSidebar
---

# Class: DiscountRule

## Hierarchy

- `SoftDeletableEntity`

  ↳ **`DiscountRule`**

## Constructors

### constructor

• **new DiscountRule**()

#### Inherited from

SoftDeletableEntity.constructor

## Properties

### allocation

• **allocation**: [`AllocationType`](../enums/AllocationType.md)

#### Defined in

[models/discount-rule.ts:38](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/discount-rule.ts#L38)

___

### conditions

• **conditions**: [`DiscountCondition`](DiscountCondition.md)[]

#### Defined in

[models/discount-rule.ts:41](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/discount-rule.ts#L41)

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

### description

• **description**: `string`

#### Defined in

[models/discount-rule.ts:22](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/discount-rule.ts#L22)

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

[models/discount-rule.ts:44](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/discount-rule.ts#L44)

___

### type

• **type**: [`DiscountRuleType`](../enums/DiscountRuleType.md)

#### Defined in

[models/discount-rule.ts:28](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/discount-rule.ts#L28)

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

SoftDeletableEntity.updated\_at

#### Defined in

[interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L19)

___

### value

• **value**: `number`

#### Defined in

[models/discount-rule.ts:31](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/discount-rule.ts#L31)

## Methods

### beforeInsert

▸ `Private` **beforeInsert**(): `void`

#### Returns

`void`

#### Defined in

[models/discount-rule.ts:46](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/discount-rule.ts#L46)
