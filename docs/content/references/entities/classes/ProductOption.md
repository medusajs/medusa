---
displayed_sidebar: entitiesSidebar
---

# Class: ProductOption

## Hierarchy

- `SoftDeletableEntity`

  ↳ **`ProductOption`**

## Constructors

### constructor

• **new ProductOption**()

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

[models/product-option.ts:34](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/product-option.ts#L34)

___

### product

• **product**: [`Product`](Product.md)

#### Defined in

[models/product-option.ts:31](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/product-option.ts#L31)

___

### product\_id

• **product\_id**: `string`

#### Defined in

[models/product-option.ts:27](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/product-option.ts#L27)

___

### title

• **title**: `string`

#### Defined in

[models/product-option.ts:19](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/product-option.ts#L19)

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

SoftDeletableEntity.updated\_at

#### Defined in

[interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L19)

___

### values

• **values**: [`ProductOptionValue`](ProductOptionValue.md)[]

#### Defined in

[models/product-option.ts:24](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/product-option.ts#L24)

## Methods

### beforeInsert

▸ `Private` **beforeInsert**(): `void`

#### Returns

`void`

#### Defined in

[models/product-option.ts:36](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/product-option.ts#L36)
