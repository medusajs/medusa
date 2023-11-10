# ProductCollection

A Product Collection allows grouping together products for promotional purposes. For example, an admin can create a Summer collection, add products to it, and showcase it on the storefront.

## Hierarchy

- [`SoftDeletableEntity`](SoftDeletableEntity.md)

  ↳ **`ProductCollection`**

## Constructors

### constructor

**new ProductCollection**()

A Product Collection allows grouping together products for promotional purposes. For example, an admin can create a Summer collection, add products to it, and showcase it on the storefront.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[constructor](SoftDeletableEntity.md#constructor)

## Properties

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

### handle

 **handle**: `string`

A unique string that identifies the Product Collection - can for example be used in slug structures.

#### Defined in

[packages/medusa/src/models/product-collection.ts:16](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/product-collection.ts#L16)

___

### id

 **id**: `string`

The product collection's ID

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[id](SoftDeletableEntity.md#id)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### metadata

 **metadata**: Record<`string`, `unknown`\>

An optional key-value map with additional details

#### Defined in

[packages/medusa/src/models/product-collection.ts:22](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/product-collection.ts#L22)

___

### products

 **products**: [`Product`](Product.md)[]

The details of the products that belong to this product collection.

#### Defined in

[packages/medusa/src/models/product-collection.ts:19](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/product-collection.ts#L19)

___

### title

 **title**: `string`

The title that the Product Collection is identified by.

#### Defined in

[packages/medusa/src/models/product-collection.ts:12](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/product-collection.ts#L12)

___

### updated\_at

 **updated\_at**: `Date`

The date with timezone at which the resource was updated.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[updated_at](SoftDeletableEntity.md#updated_at)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/base-entity.ts#L19)

## Methods

### createHandleIfNotProvided

`Private` **createHandleIfNotProvided**(): `void`

#### Returns

`void`

-`void`: (optional) 

#### Defined in

[packages/medusa/src/models/product-collection.ts:28](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/product-collection.ts#L28)
