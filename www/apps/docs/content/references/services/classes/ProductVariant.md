# ProductVariant

A Product Variant represents a Product with a specific set of Product Option configurations. The maximum number of Product Variants that a Product can have is given by the number of available Product Option combinations. A product must at least have one product variant.

## Hierarchy

- [`SoftDeletableEntity`](SoftDeletableEntity.md)

  ↳ **`ProductVariant`**

## Constructors

### constructor

**new ProductVariant**()

A Product Variant represents a Product with a specific set of Product Option configurations. The maximum number of Product Variants that a Product can have is given by the number of available Product Option combinations. A product must at least have one product variant.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[constructor](SoftDeletableEntity.md#constructor)

## Properties

### allow\_backorder

 **allow\_backorder**: `boolean`

Whether the Product Variant should be purchasable when `inventory_quantity` is 0.

#### Defined in

[packages/medusa/src/models/product-variant.ts:72](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product-variant.ts#L72)

___

### barcode

 **barcode**: ``null`` \| `string`

A generic field for a GTIN number that can be used to identify the Product Variant.

#### Defined in

[packages/medusa/src/models/product-variant.ts:55](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product-variant.ts#L55)

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

### ean

 **ean**: ``null`` \| `string`

An EAN barcode number that can be used to identify the Product Variant.

#### Defined in

[packages/medusa/src/models/product-variant.ts:59](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product-variant.ts#L59)

___

### height

 **height**: ``null`` \| `number`

The height of the Product Variant. May be used in shipping rate calculations.

#### Defined in

[packages/medusa/src/models/product-variant.ts:96](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product-variant.ts#L96)

___

### hs\_code

 **hs\_code**: ``null`` \| `string`

The Harmonized System code of the Product Variant. May be used by Fulfillment Providers to pass customs information to shipping carriers.

#### Defined in

[packages/medusa/src/models/product-variant.ts:78](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product-variant.ts#L78)

___

### id

 **id**: `string`

The product variant's ID

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[id](SoftDeletableEntity.md#id)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### inventory\_items

 **inventory\_items**: [`ProductVariantInventoryItem`](ProductVariantInventoryItem.md)[]

The details inventory items of the product variant.

#### Defined in

[packages/medusa/src/models/product-variant.ts:113](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product-variant.ts#L113)

___

### inventory\_quantity

 **inventory\_quantity**: `number`

The current quantity of the item that is stocked.

#### Defined in

[packages/medusa/src/models/product-variant.ts:69](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product-variant.ts#L69)

___

### length

 **length**: ``null`` \| `number`

The length of the Product Variant. May be used in shipping rate calculations.

#### Defined in

[packages/medusa/src/models/product-variant.ts:93](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product-variant.ts#L93)

___

### manage\_inventory

 **manage\_inventory**: `boolean` = `true`

Whether Medusa should manage inventory for the Product Variant.

#### Defined in

[packages/medusa/src/models/product-variant.ts:75](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product-variant.ts#L75)

___

### material

 **material**: ``null`` \| `string`

The material and composition that the Product Variant is made of, May be used by Fulfillment Providers to pass customs information to shipping carriers.

#### Defined in

[packages/medusa/src/models/product-variant.ts:87](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product-variant.ts#L87)

___

### metadata

 **metadata**: ``null`` \| Record<`string`, `unknown`\>

An optional key-value map with additional details

#### Defined in

[packages/medusa/src/models/product-variant.ts:116](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product-variant.ts#L116)

___

### mid\_code

 **mid\_code**: ``null`` \| `string`

The Manufacturers Identification code that identifies the manufacturer of the Product Variant. May be used by Fulfillment Providers to pass customs information to shipping carriers.

#### Defined in

[packages/medusa/src/models/product-variant.ts:84](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product-variant.ts#L84)

___

### options

 **options**: [`ProductOptionValue`](ProductOptionValue.md)[]

The details of the product options that this product variant defines values for.

#### Defined in

[packages/medusa/src/models/product-variant.ts:104](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product-variant.ts#L104)

___

### origin\_country

 **origin\_country**: ``null`` \| `string`

The country in which the Product Variant was produced. May be used by Fulfillment Providers to pass customs information to shipping carriers.

#### Defined in

[packages/medusa/src/models/product-variant.ts:81](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product-variant.ts#L81)

___

### prices

 **prices**: [`MoneyAmount`](MoneyAmount.md)[]

The details of the prices of the Product Variant, each represented as a Money Amount. Each Money Amount represents a price in a given currency or a specific Region.

#### Defined in

[packages/medusa/src/models/product-variant.ts:47](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product-variant.ts#L47)

___

### product

 **product**: [`Product`](Product.md)

The details of the product that the product variant belongs to.

#### Defined in

[packages/medusa/src/models/product-variant.ts:31](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product-variant.ts#L31)

___

### product\_id

 **product\_id**: `string`

The ID of the product that the product variant belongs to.

#### Defined in

[packages/medusa/src/models/product-variant.ts:27](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product-variant.ts#L27)

___

### purchasable

 `Optional` **purchasable**: `boolean`

Only used with the inventory modules.
A boolean value indicating whether the Product Variant is purchasable.
A variant is purchasable if:
  - inventory is not managed
  - it has no inventory items
  - it is in stock
  - it is backorderable.

#### Defined in

[packages/medusa/src/models/product-variant.ts:118](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product-variant.ts#L118)

___

### sku

 **sku**: ``null`` \| `string`

The unique stock keeping unit used to identify the Product Variant. This will usually be a unique identifer for the item that is to be shipped, and can be referenced across multiple systems.

#### Defined in

[packages/medusa/src/models/product-variant.ts:51](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product-variant.ts#L51)

___

### title

 **title**: `string`

A title that can be displayed for easy identification of the Product Variant.

#### Defined in

[packages/medusa/src/models/product-variant.ts:23](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product-variant.ts#L23)

___

### upc

 **upc**: ``null`` \| `string`

A UPC barcode number that can be used to identify the Product Variant.

#### Defined in

[packages/medusa/src/models/product-variant.ts:63](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product-variant.ts#L63)

___

### updated\_at

 **updated\_at**: `Date`

The date with timezone at which the resource was updated.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[updated_at](SoftDeletableEntity.md#updated_at)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/models/base-entity.ts#L19)

___

### variant\_rank

 **variant\_rank**: ``null`` \| `number`

The ranking of this variant

#### Defined in

[packages/medusa/src/models/product-variant.ts:66](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product-variant.ts#L66)

___

### weight

 **weight**: ``null`` \| `number`

The weight of the Product Variant. May be used in shipping rate calculations.

#### Defined in

[packages/medusa/src/models/product-variant.ts:90](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product-variant.ts#L90)

___

### width

 **width**: ``null`` \| `number`

The width of the Product Variant. May be used in shipping rate calculations.

#### Defined in

[packages/medusa/src/models/product-variant.ts:99](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product-variant.ts#L99)

## Methods

### beforeInsert

`Private` **beforeInsert**(): `void`

#### Returns

`void`

-`void`: (optional) 

#### Defined in

[packages/medusa/src/models/product-variant.ts:124](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product-variant.ts#L124)
