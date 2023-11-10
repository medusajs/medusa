# DiscountCondition

Holds rule conditions for when a discount is applicable

## Hierarchy

- [`SoftDeletableEntity`](SoftDeletableEntity.md)

  ↳ **`DiscountCondition`**

## Constructors

### constructor

**new DiscountCondition**()

Holds rule conditions for when a discount is applicable

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[constructor](SoftDeletableEntity.md#constructor)

## Properties

### created\_at

 **created\_at**: `Date`

The date with timezone at which the resource was created.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[created_at](SoftDeletableEntity.md#created_at)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### customer\_groups

 **customer\_groups**: [`CustomerGroup`](CustomerGroup.md)[]

Customer groups associated with this condition if `type` is `customer_groups`.

#### Defined in

[packages/medusa/src/models/discount-condition.ts:160](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/discount-condition.ts#L160)

___

### deleted\_at

 **deleted\_at**: ``null`` \| `Date`

The date with timezone at which the resource was deleted.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[deleted_at](SoftDeletableEntity.md#deleted_at)

#### Defined in

[packages/medusa/src/interfaces/models/soft-deletable-entity.ts:7](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/models/soft-deletable-entity.ts#L7)

___

### discount\_rule

 **discount\_rule**: [`DiscountRule`](DiscountRule.md)

The details of the discount rule associated with the condition.

#### Defined in

[packages/medusa/src/models/discount-condition.ts:90](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/discount-condition.ts#L90)

___

### discount\_rule\_id

 **discount\_rule\_id**: `string`

The ID of the discount rule associated with the condition

#### Defined in

[packages/medusa/src/models/discount-condition.ts:86](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/discount-condition.ts#L86)

___

### id

 **id**: `string`

The discount condition's ID

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[id](SoftDeletableEntity.md#id)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### metadata

 **metadata**: Record<`string`, `unknown`\>

An optional key-value map with additional details

#### Defined in

[packages/medusa/src/models/discount-condition.ts:163](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/discount-condition.ts#L163)

___

### operator

 **operator**: [`DiscountConditionOperator`](../enums/DiscountConditionOperator.md)

The operator of the condition. `in` indicates that discountable resources are within the specified resources. `not_in` indicates that discountable resources are everything but the specified resources.

#### Defined in

[packages/medusa/src/models/discount-condition.ts:82](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/discount-condition.ts#L82)

___

### product\_collections

 **product\_collections**: [`ProductCollection`](ProductCollection.md)[]

Product collections associated with this condition if `type` is `product_collections`.

#### Defined in

[packages/medusa/src/models/discount-condition.ts:146](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/discount-condition.ts#L146)

___

### product\_tags

 **product\_tags**: [`ProductTag`](ProductTag.md)[]

Product tags associated with this condition if `type` is `product_tags`.

#### Defined in

[packages/medusa/src/models/discount-condition.ts:132](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/discount-condition.ts#L132)

___

### product\_types

 **product\_types**: [`ProductType`](ProductType.md)[]

Product types associated with this condition if `type` is `product_types`.

#### Defined in

[packages/medusa/src/models/discount-condition.ts:118](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/discount-condition.ts#L118)

___

### products

 **products**: [`Product`](Product.md)[]

products associated with this condition if `type` is `products`.

#### Defined in

[packages/medusa/src/models/discount-condition.ts:104](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/discount-condition.ts#L104)

___

### type

 **type**: [`DiscountConditionType`](../enums/DiscountConditionType.md)

The type of the condition. The type affects the available resources associated with the condition. For example, if the type is `products`, that means the `products` relation will hold the products associated with this condition and other relations will be empty.

#### Defined in

[packages/medusa/src/models/discount-condition.ts:76](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/discount-condition.ts#L76)

___

### updated\_at

 **updated\_at**: `Date`

The date with timezone at which the resource was updated.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[updated_at](SoftDeletableEntity.md#updated_at)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/models/base-entity.ts#L19)

## Methods

### beforeInsert

`Private` **beforeInsert**(): `void`

#### Returns

`void`

-`void`: (optional) 

#### Defined in

[packages/medusa/src/models/discount-condition.ts:169](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/discount-condition.ts#L169)
