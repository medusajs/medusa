# Product

A product is a saleable item that holds general information such as name or description. It must include at least one Product Variant, where each product variant defines different options to purchase the product with (for example, different sizes or colors). The prices and inventory of the product are defined on the variant level.

## Hierarchy

- [`SoftDeletableEntity`](SoftDeletableEntity.md)

  ↳ **`Product`**

## Constructors

### constructor

**new Product**()

A product is a saleable item that holds general information such as name or description. It must include at least one Product Variant, where each product variant defines different options to purchase the product with (for example, different sizes or colors). The prices and inventory of the product are defined on the variant level.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[constructor](SoftDeletableEntity.md#constructor)

## Properties

### categories

 **categories**: [`ProductCategory`](ProductCategory.md)[]

The details of the product categories that this product belongs to.

#### Defined in

[packages/medusa/src/models/product.ts:112](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product.ts#L112)

___

### collection

 **collection**: [`ProductCollection`](ProductCollection.md)

The details of the product collection that the product belongs to.

#### Defined in

[packages/medusa/src/models/product.ts:163](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product.ts#L163)

___

### collection\_id

 **collection\_id**: ``null`` \| `string`

The ID of the product collection that the product belongs to.

#### Defined in

[packages/medusa/src/models/product.ts:159](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product.ts#L159)

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

### description

 **description**: ``null`` \| `string`

A short description of the Product.

#### Defined in

[packages/medusa/src/models/product.ts:63](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product.ts#L63)

___

### discountable

 **discountable**: `boolean` = `true`

Whether the Product can be discounted. Discounts will not apply to Line Items of this Product when this flag is set to `false`.

#### Defined in

[packages/medusa/src/models/product.ts:187](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product.ts#L187)

___

### external\_id

 **external\_id**: ``null`` \| `string`

The external ID of the product

#### Defined in

[packages/medusa/src/models/product.ts:190](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product.ts#L190)

___

### handle

 **handle**: ``null`` \| `string`

A unique identifier for the Product (e.g. for slug structure).

#### Defined in

[packages/medusa/src/models/product.ts:67](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product.ts#L67)

___

### height

 **height**: ``null`` \| `number`

The height of the Product Variant. May be used in shipping rate calculations.

#### Defined in

[packages/medusa/src/models/product.ts:141](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product.ts#L141)

___

### hs\_code

 **hs\_code**: ``null`` \| `string`

The Harmonized System code of the Product Variant. May be used by Fulfillment Providers to pass customs information to shipping carriers.

#### Defined in

[packages/medusa/src/models/product.ts:147](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product.ts#L147)

___

### id

 **id**: `string`

The product's ID

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[id](SoftDeletableEntity.md#id)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### images

 **images**: [`Image`](Image.md)[]

The details of the product's images.

#### Defined in

[packages/medusa/src/models/product.ts:87](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product.ts#L87)

___

### is\_giftcard

 **is\_giftcard**: `boolean`

Whether the Product represents a Gift Card. Products that represent Gift Cards will automatically generate a redeemable Gift Card code once they are purchased.

#### Defined in

[packages/medusa/src/models/product.ts:70](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product.ts#L70)

___

### length

 **length**: ``null`` \| `number`

The length of the Product Variant. May be used in shipping rate calculations.

#### Defined in

[packages/medusa/src/models/product.ts:138](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product.ts#L138)

___

### material

 **material**: ``null`` \| `string`

The material and composition that the Product Variant is made of, May be used by Fulfillment Providers to pass customs information to shipping carriers.

#### Defined in

[packages/medusa/src/models/product.ts:156](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product.ts#L156)

___

### metadata

 **metadata**: ``null`` \| Record<`string`, `unknown`\>

An optional key-value map with additional details

#### Defined in

[packages/medusa/src/models/product.ts:193](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product.ts#L193)

___

### mid\_code

 **mid\_code**: ``null`` \| `string`

The Manufacturers Identification code that identifies the manufacturer of the Product Variant. May be used by Fulfillment Providers to pass customs information to shipping carriers.

#### Defined in

[packages/medusa/src/models/product.ts:153](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product.ts#L153)

___

### options

 **options**: [`ProductOption`](ProductOption.md)[]

The details of the Product Options that are defined for the Product. The product's variants will have a unique combination of values of the product's options.

#### Defined in

[packages/medusa/src/models/product.ts:93](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product.ts#L93)

___

### origin\_country

 **origin\_country**: ``null`` \| `string`

The country in which the Product Variant was produced. May be used by Fulfillment Providers to pass customs information to shipping carriers.

#### Defined in

[packages/medusa/src/models/product.ts:150](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product.ts#L150)

___

### profile

 **profile**: [`ShippingProfile`](ShippingProfile.md)

The details of the shipping profile that the product belongs to. The shipping profile has a set of defined shipping options that can be used to fulfill the product.

#### Defined in

[packages/medusa/src/models/product.ts:116](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product.ts#L116)

___

### profile\_id

 **profile\_id**: `string`

The ID of the shipping profile that the product belongs to. The shipping profile has a set of defined shipping options that can be used to fulfill the product.

#### Defined in

[packages/medusa/src/models/product.ts:114](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product.ts#L114)

___

### profiles

 **profiles**: [`ShippingProfile`](ShippingProfile.md)[]

Available if the relation `profiles` is expanded.

#### Defined in

[packages/medusa/src/models/product.ts:132](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product.ts#L132)

___

### sales\_channels

 **sales\_channels**: [`SalesChannel`](SalesChannel.md)[]

The details of the sales channels this product is available in.

#### Defined in

[packages/medusa/src/models/product.ts:209](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product.ts#L209)

___

### status

 **status**: [`ProductStatus`](../enums/ProductStatus.md) = `draft`

The status of the product

#### Defined in

[packages/medusa/src/models/product.ts:73](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product.ts#L73)

___

### subtitle

 **subtitle**: ``null`` \| `string`

An optional subtitle that can be used to further specify the Product.

#### Defined in

[packages/medusa/src/models/product.ts:60](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product.ts#L60)

___

### tags

 **tags**: [`ProductTag`](ProductTag.md)[]

The details of the product tags used in this product.

#### Defined in

[packages/medusa/src/models/product.ts:184](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product.ts#L184)

___

### thumbnail

 **thumbnail**: ``null`` \| `string`

A URL to an image file that can be used to identify the Product.

#### Defined in

[packages/medusa/src/models/product.ts:90](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product.ts#L90)

___

### title

 **title**: `string`

A title that can be displayed for easy identification of the Product.

#### Defined in

[packages/medusa/src/models/product.ts:57](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product.ts#L57)

___

### type

 **type**: [`ProductType`](ProductType.md)

The details of the product type that the product belongs to.

#### Defined in

[packages/medusa/src/models/product.ts:170](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product.ts#L170)

___

### type\_id

 **type\_id**: ``null`` \| `string`

The ID of the product type that the product belongs to.

#### Defined in

[packages/medusa/src/models/product.ts:166](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product.ts#L166)

___

### updated\_at

 **updated\_at**: `Date`

The date with timezone at which the resource was updated.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[updated_at](SoftDeletableEntity.md#updated_at)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/models/base-entity.ts#L19)

___

### variants

 **variants**: [`ProductVariant`](ProductVariant.md)[]

The details of the Product Variants that belong to the Product. Each will have a unique combination of values of the product's options.

#### Defined in

[packages/medusa/src/models/product.ts:98](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product.ts#L98)

___

### weight

 **weight**: ``null`` \| `number`

The weight of the Product Variant. May be used in shipping rate calculations.

#### Defined in

[packages/medusa/src/models/product.ts:135](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product.ts#L135)

___

### width

 **width**: ``null`` \| `number`

The width of the Product Variant. May be used in shipping rate calculations.

#### Defined in

[packages/medusa/src/models/product.ts:144](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product.ts#L144)

## Methods

### afterLoad

`Private` **afterLoad**(): `void`

#### Returns

`void`

-`void`: (optional) 

#### Defined in

[packages/medusa/src/models/product.ts:241](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product.ts#L241)

___

### beforeInsert

`Private` **beforeInsert**(): `void`

#### Returns

`void`

-`void`: (optional) 

#### Defined in

[packages/medusa/src/models/product.ts:215](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product.ts#L215)

___

### beforeUpdate

`Private` **beforeUpdate**(): `void`

#### Returns

`void`

-`void`: (optional) 

#### Defined in

[packages/medusa/src/models/product.ts:231](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product.ts#L231)
