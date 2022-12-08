---
displayed_sidebar: entitiesSidebar
---

# Class: ProductOptionValue

## Hierarchy

- `SoftDeletableEntity`

  ↳ **`ProductOptionValue`**

## Constructors

### constructor

• **new ProductOptionValue**()

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

[models/product-option-value.ts:40](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/product-option-value.ts#L40)

___

### option

• **option**: [`ProductOption`](ProductOption.md)

#### Defined in

[models/product-option-value.ts:27](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/product-option-value.ts#L27)

___

### option\_id

• **option\_id**: `string`

#### Defined in

[models/product-option-value.ts:23](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/product-option-value.ts#L23)

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

SoftDeletableEntity.updated\_at

#### Defined in

[interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L19)

___

### value

• **value**: `string`

#### Defined in

[models/product-option-value.ts:19](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/product-option-value.ts#L19)

___

### variant

• **variant**: [`ProductVariant`](ProductVariant.md)

#### Defined in

[models/product-option-value.ts:37](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/product-option-value.ts#L37)

___

### variant\_id

• **variant\_id**: `string`

#### Defined in

[models/product-option-value.ts:31](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/product-option-value.ts#L31)

## Methods

### beforeInsert

▸ `Private` **beforeInsert**(): `void`

#### Returns

`void`

#### Defined in

[models/product-option-value.ts:42](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/product-option-value.ts#L42)
