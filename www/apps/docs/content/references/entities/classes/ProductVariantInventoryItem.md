---
displayed_sidebar: entitiesSidebar
---

# Class: ProductVariantInventoryItem

## Hierarchy

- `SoftDeletableEntity`

  ↳ **`ProductVariantInventoryItem`**

## Constructors

### constructor

• **new ProductVariantInventoryItem**()

#### Inherited from

SoftDeletableEntity.constructor

## Properties

### created\_at

• **created\_at**: `Date`

#### Inherited from

SoftDeletableEntity.created\_at

#### Defined in

[interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### deleted\_at

• **deleted\_at**: ``null`` \| `Date`

#### Inherited from

SoftDeletableEntity.deleted\_at

#### Defined in

[interfaces/models/soft-deletable-entity.ts:7](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/models/soft-deletable-entity.ts#L7)

___

### id

• **id**: `string`

#### Inherited from

SoftDeletableEntity.id

#### Defined in

[interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### inventory\_item\_id

• **inventory\_item\_id**: `string`

#### Defined in

[models/product-variant-inventory-item.ts:17](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product-variant-inventory-item.ts#L17)

___

### required\_quantity

• **required\_quantity**: `number`

#### Defined in

[models/product-variant-inventory-item.ts:28](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product-variant-inventory-item.ts#L28)

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

SoftDeletableEntity.updated\_at

#### Defined in

[interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/models/base-entity.ts#L19)

___

### variant

• **variant**: [`ProductVariant`](ProductVariant.md)

#### Defined in

[models/product-variant-inventory-item.ts:25](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product-variant-inventory-item.ts#L25)

___

### variant\_id

• **variant\_id**: `string`

#### Defined in

[models/product-variant-inventory-item.ts:21](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product-variant-inventory-item.ts#L21)

## Methods

### beforeInsert

▸ `Private` **beforeInsert**(): `void`

#### Returns

`void`

#### Defined in

[models/product-variant-inventory-item.ts:31](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product-variant-inventory-item.ts#L31)
