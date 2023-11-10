# DiscountRule

A discount rule defines how a Discount is calculated when applied to a Cart.

## Hierarchy

- [`SoftDeletableEntity`](SoftDeletableEntity.md)

  ↳ **`DiscountRule`**

## Constructors

### constructor

**new DiscountRule**()

A discount rule defines how a Discount is calculated when applied to a Cart.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[constructor](SoftDeletableEntity.md#constructor)

## Properties

### allocation

 **allocation**: [`AllocationType`](../enums/AllocationType.md)

The scope that the discount should apply to.

#### Defined in

[packages/medusa/src/models/discount-rule.ts:63](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/discount-rule.ts#L63)

___

### conditions

 **conditions**: [`DiscountCondition`](DiscountCondition.md)[]

The details of the discount conditions associated with the rule. They can be used to limit when the discount can be used.

#### Defined in

[packages/medusa/src/models/discount-rule.ts:66](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/discount-rule.ts#L66)

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

### description

 **description**: `string`

A short description of the discount

#### Defined in

[packages/medusa/src/models/discount-rule.ts:47](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/discount-rule.ts#L47)

___

### id

 **id**: `string`

The discount rule's ID

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[id](SoftDeletableEntity.md#id)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### metadata

 **metadata**: Record<`string`, `unknown`\>

An optional key-value map with additional details

#### Defined in

[packages/medusa/src/models/discount-rule.ts:69](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/discount-rule.ts#L69)

___

### type

 **type**: [`DiscountRuleType`](../enums/DiscountRuleType.md)

The type of the Discount, can be `fixed` for discounts that reduce the price by a fixed amount, `percentage` for percentage reductions or `free_shipping` for shipping vouchers.

#### Defined in

[packages/medusa/src/models/discount-rule.ts:53](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/discount-rule.ts#L53)

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

 **value**: `number`

The value that the discount represents; this will depend on the type of the discount

#### Defined in

[packages/medusa/src/models/discount-rule.ts:56](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/discount-rule.ts#L56)

## Methods

### beforeInsert

`Private` **beforeInsert**(): `void`

#### Returns

`void`

-`void`: (optional) 

#### Defined in

[packages/medusa/src/models/discount-rule.ts:75](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/discount-rule.ts#L75)
