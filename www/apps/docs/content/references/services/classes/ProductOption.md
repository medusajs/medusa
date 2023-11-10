# ProductOption

A Product Option defines properties that may vary between different variants of a Product. Common Product Options are "Size" and "Color". Admins are free to create any product options.

## Hierarchy

- [`SoftDeletableEntity`](SoftDeletableEntity.md)

  ↳ **`ProductOption`**

## Constructors

### constructor

**new ProductOption**()

A Product Option defines properties that may vary between different variants of a Product. Common Product Options are "Size" and "Color". Admins are free to create any product options.

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

### deleted\_at

 **deleted\_at**: ``null`` \| `Date`

The date with timezone at which the resource was deleted.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[deleted_at](SoftDeletableEntity.md#deleted_at)

#### Defined in

[packages/medusa/src/interfaces/models/soft-deletable-entity.ts:7](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/models/soft-deletable-entity.ts#L7)

___

### id

 **id**: `string`

The product option's ID

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[id](SoftDeletableEntity.md#id)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### metadata

 **metadata**: Record<`string`, `unknown`\>

An optional key-value map with additional details

#### Defined in

[packages/medusa/src/models/product-option.ts:34](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product-option.ts#L34)

___

### product

 **product**: [`Product`](Product.md)

The details of the product that this product option belongs to.

#### Defined in

[packages/medusa/src/models/product-option.ts:31](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product-option.ts#L31)

___

### product\_id

 **product\_id**: `string`

The ID of the product that this product option belongs to.

#### Defined in

[packages/medusa/src/models/product-option.ts:27](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product-option.ts#L27)

___

### title

 **title**: `string`

The title that the Product Option is defined by (e.g. `Size`).

#### Defined in

[packages/medusa/src/models/product-option.ts:19](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product-option.ts#L19)

___

### updated\_at

 **updated\_at**: `Date`

The date with timezone at which the resource was updated.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[updated_at](SoftDeletableEntity.md#updated_at)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/models/base-entity.ts#L19)

___

### values

 **values**: [`ProductOptionValue`](ProductOptionValue.md)[]

The details of the values of the product option.

#### Defined in

[packages/medusa/src/models/product-option.ts:24](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product-option.ts#L24)

## Methods

### beforeInsert

`Private` **beforeInsert**(): `void`

#### Returns

`void`

-`void`: (optional) 

#### Defined in

[packages/medusa/src/models/product-option.ts:40](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product-option.ts#L40)
