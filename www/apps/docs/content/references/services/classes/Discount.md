# Discount

A discount can be applied to a cart for promotional purposes.

## Hierarchy

- [`SoftDeletableEntity`](SoftDeletableEntity.md)

  ↳ **`Discount`**

## Constructors

### constructor

**new Discount**()

A discount can be applied to a cart for promotional purposes.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[constructor](SoftDeletableEntity.md#constructor)

## Properties

### code

 **code**: `string`

A unique code for the discount - this will be used by the customer to apply the discount

#### Defined in

[packages/medusa/src/models/discount.ts:22](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/discount.ts#L22)

___

### created\_at

 **created\_at**: `Date`

The date with timezone at which the resource was created.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[created_at](SoftDeletableEntity.md#created_at)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### deleted\_at

 **deleted\_at**: ``null`` \| `Date`

The date with timezone at which the resource was deleted.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[deleted_at](SoftDeletableEntity.md#deleted_at)

#### Defined in

[packages/medusa/src/interfaces/models/soft-deletable-entity.ts:7](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/models/soft-deletable-entity.ts#L7)

___

### ends\_at

 **ends\_at**: ``null`` \| `Date`

The time at which the discount can no longer be used.

#### Defined in

[packages/medusa/src/models/discount.ts:52](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/discount.ts#L52)

___

### id

 **id**: `string`

The discount's ID

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[id](SoftDeletableEntity.md#id)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### is\_disabled

 **is\_disabled**: `boolean`

Whether the Discount has been disabled. Disabled discounts cannot be applied to carts

#### Defined in

[packages/medusa/src/models/discount.ts:36](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/discount.ts#L36)

___

### is\_dynamic

 **is\_dynamic**: `boolean`

A flag to indicate if multiple instances of the discount can be generated. I.e. for newsletter discounts

#### Defined in

[packages/medusa/src/models/discount.ts:25](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/discount.ts#L25)

___

### metadata

 **metadata**: Record<`string`, `unknown`\>

An optional key-value map with additional details

#### Defined in

[packages/medusa/src/models/discount.ts:78](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/discount.ts#L78)

___

### parent\_discount

 **parent\_discount**: [`Discount`](Discount.md)

The details of the parent discount that this discount was created from.

#### Defined in

[packages/medusa/src/models/discount.ts:43](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/discount.ts#L43)

___

### parent\_discount\_id

 **parent\_discount\_id**: `string`

The Discount that the discount was created from. This will always be a dynamic discount

#### Defined in

[packages/medusa/src/models/discount.ts:39](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/discount.ts#L39)

___

### regions

 **regions**: [`Region`](Region.md)[]

The details of the regions in which the Discount can be used.

#### Defined in

[packages/medusa/src/models/discount.ts:69](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/discount.ts#L69)

___

### rule

 **rule**: [`DiscountRule`](DiscountRule.md)

The details of the discount rule that defines how the discount will be applied to a cart..

#### Defined in

[packages/medusa/src/models/discount.ts:33](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/discount.ts#L33)

___

### rule\_id

 **rule\_id**: `string`

The ID of the discount rule that defines how the discount will be applied to a cart.

#### Defined in

[packages/medusa/src/models/discount.ts:29](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/discount.ts#L29)

___

### starts\_at

 **starts\_at**: `Date`

The time at which the discount can be used.

#### Defined in

[packages/medusa/src/models/discount.ts:49](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/discount.ts#L49)

___

### updated\_at

 **updated\_at**: `Date`

The date with timezone at which the resource was updated.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[updated_at](SoftDeletableEntity.md#updated_at)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/models/base-entity.ts#L19)

___

### usage\_count

 **usage\_count**: `number`

The number of times a discount has been used.

#### Defined in

[packages/medusa/src/models/discount.ts:75](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/discount.ts#L75)

___

### usage\_limit

 **usage\_limit**: ``null`` \| `number`

The maximum number of times that a discount can be used.

#### Defined in

[packages/medusa/src/models/discount.ts:72](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/discount.ts#L72)

___

### valid\_duration

 **valid\_duration**: ``null`` \| `string`

Duration the discount runs between

#### Defined in

[packages/medusa/src/models/discount.ts:55](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/discount.ts#L55)

## Methods

### upperCaseCodeAndTrim

`Private` **upperCaseCodeAndTrim**(): `void`

#### Returns

`void`

-`void`: (optional) 

#### Defined in

[packages/medusa/src/models/discount.ts:84](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/discount.ts#L84)
