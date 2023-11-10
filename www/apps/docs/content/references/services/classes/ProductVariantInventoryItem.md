# ProductVariantInventoryItem

A Product Variant Inventory Item links variants with inventory items and denotes the required quantity of the variant.

## Hierarchy

- [`SoftDeletableEntity`](SoftDeletableEntity.md)

  ↳ **`ProductVariantInventoryItem`**

## Constructors

### constructor

**new ProductVariantInventoryItem**()

A Product Variant Inventory Item links variants with inventory items and denotes the required quantity of the variant.

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

The product variant inventory item's ID

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[id](SoftDeletableEntity.md#id)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### inventory\_item\_id

 **inventory\_item\_id**: `string`

The id of the inventory item

#### Defined in

[packages/medusa/src/models/product-variant-inventory-item.ts:17](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product-variant-inventory-item.ts#L17)

___

### required\_quantity

 **required\_quantity**: `number` = `1`

The quantity of an inventory item required for the variant.

#### Defined in

[packages/medusa/src/models/product-variant-inventory-item.ts:28](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product-variant-inventory-item.ts#L28)

___

### updated\_at

 **updated\_at**: `Date`

The date with timezone at which the resource was updated.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[updated_at](SoftDeletableEntity.md#updated_at)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/models/base-entity.ts#L19)

___

### variant

 **variant**: [`ProductVariant`](ProductVariant.md)

The details of the product variant.

#### Defined in

[packages/medusa/src/models/product-variant-inventory-item.ts:25](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product-variant-inventory-item.ts#L25)

___

### variant\_id

 **variant\_id**: `string`

The id of the variant.

#### Defined in

[packages/medusa/src/models/product-variant-inventory-item.ts:21](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product-variant-inventory-item.ts#L21)

## Methods

### beforeInsert

`Private` **beforeInsert**(): `void`

#### Returns

`void`

-`void`: (optional) 

#### Defined in

[packages/medusa/src/models/product-variant-inventory-item.ts:34](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product-variant-inventory-item.ts#L34)
