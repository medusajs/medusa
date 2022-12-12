---
displayed_sidebar: entitiesSidebar
---

# Class: ProductCollection

## Hierarchy

- `SoftDeletableEntity`

  ↳ **`ProductCollection`**

## Constructors

### constructor

• **new ProductCollection**()

#### Inherited from

SoftDeletableEntity.constructor

## Properties

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

### handle

• **handle**: `string`

#### Defined in

[models/product-collection.ts:16](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/product-collection.ts#L16)

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

[models/product-collection.ts:22](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/product-collection.ts#L22)

___

### products

• **products**: [`Product`](Product.md)[]

#### Defined in

[models/product-collection.ts:19](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/product-collection.ts#L19)

___

### title

• **title**: `string`

#### Defined in

[models/product-collection.ts:12](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/product-collection.ts#L12)

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

SoftDeletableEntity.updated\_at

#### Defined in

[interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L19)

## Methods

### createHandleIfNotProvided

▸ `Private` **createHandleIfNotProvided**(): `void`

#### Returns

`void`

#### Defined in

[models/product-collection.ts:24](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/product-collection.ts#L24)
