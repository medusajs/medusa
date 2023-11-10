# ProductOptionValue

An option value is one of the possible values of a Product Option. Product Variants specify a unique combination of product option values.

## Hierarchy

- [`SoftDeletableEntity`](SoftDeletableEntity.md)

  ↳ **`ProductOptionValue`**

## Constructors

### constructor

**new ProductOptionValue**()

An option value is one of the possible values of a Product Option. Product Variants specify a unique combination of product option values.

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

The product option value's ID

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[id](SoftDeletableEntity.md#id)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### metadata

 **metadata**: Record<`string`, `unknown`\>

An optional key-value map with additional details

#### Defined in

[packages/medusa/src/models/product-option-value.ts:40](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product-option-value.ts#L40)

___

### option

 **option**: [`ProductOption`](ProductOption.md)

The details of the product option that the Product Option Value belongs to.

#### Defined in

[packages/medusa/src/models/product-option-value.ts:27](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product-option-value.ts#L27)

___

### option\_id

 **option\_id**: `string`

The ID of the Product Option that the Product Option Value belongs to.

#### Defined in

[packages/medusa/src/models/product-option-value.ts:23](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product-option-value.ts#L23)

___

### updated\_at

 **updated\_at**: `Date`

The date with timezone at which the resource was updated.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[updated_at](SoftDeletableEntity.md#updated_at)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/models/base-entity.ts#L19)

___

### value

 **value**: `string`

The value that the Product Variant has defined for the specific Product Option (e.g. if the Product Option is "Size" this value could be `Small`, `Medium` or `Large`).

#### Defined in

[packages/medusa/src/models/product-option-value.ts:19](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product-option-value.ts#L19)

___

### variant

 **variant**: [`ProductVariant`](ProductVariant.md)

The details of the product variant that uses this product option value.

#### Defined in

[packages/medusa/src/models/product-option-value.ts:37](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product-option-value.ts#L37)

___

### variant\_id

 **variant\_id**: `string`

The ID of the product variant that uses this product option value.

#### Defined in

[packages/medusa/src/models/product-option-value.ts:31](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product-option-value.ts#L31)

## Methods

### beforeInsert

`Private` **beforeInsert**(): `void`

#### Returns

`void`

-`void`: (optional) 

#### Defined in

[packages/medusa/src/models/product-option-value.ts:46](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product-option-value.ts#L46)
