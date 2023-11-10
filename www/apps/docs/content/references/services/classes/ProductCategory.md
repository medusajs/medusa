# ProductCategory

A product category can be used to categorize products into a hierarchy of categories.

## Hierarchy

- [`BaseEntity`](BaseEntity.md)

  ↳ **`ProductCategory`**

## Constructors

### constructor

**new ProductCategory**()

A product category can be used to categorize products into a hierarchy of categories.

#### Inherited from

[BaseEntity](BaseEntity.md).[constructor](BaseEntity.md#constructor)

## Properties

### category\_children

 **category\_children**: [`ProductCategory`](ProductCategory.md)[]

The details of the category's children.

#### Defined in

[packages/medusa/src/models/product-category.ts:62](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product-category.ts#L62)

___

### created\_at

 **created\_at**: `Date`

The date with timezone at which the resource was created.

#### Inherited from

[BaseEntity](BaseEntity.md).[created_at](BaseEntity.md#created_at)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### description

 **description**: `string`

The product category's description.

#### Defined in

[packages/medusa/src/models/product-category.ts:35](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product-category.ts#L35)

___

### handle

 **handle**: `string`

A unique string that identifies the Product Category - can for example be used in slug structures.

#### Defined in

[packages/medusa/src/models/product-category.ts:39](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product-category.ts#L39)

___

### id

 **id**: `string`

The product category's ID

#### Inherited from

[BaseEntity](BaseEntity.md).[id](BaseEntity.md#id)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### is\_active

 **is\_active**: [`Boolean`](../index.md#boolean)

A flag to make product category visible/hidden in the store front

#### Defined in

[packages/medusa/src/models/product-category.ts:42](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product-category.ts#L42)

___

### is\_internal

 **is\_internal**: [`Boolean`](../index.md#boolean)

A flag to make product category an internal category for admins

#### Defined in

[packages/medusa/src/models/product-category.ts:45](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product-category.ts#L45)

___

### name

 **name**: `string`

The product category's name

#### Defined in

[packages/medusa/src/models/product-category.ts:32](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product-category.ts#L32)

___

### parent\_category

 **parent\_category**: ``null`` \| [`ProductCategory`](ProductCategory.md)

The details of the parent of this category.

#### Defined in

[packages/medusa/src/models/product-category.ts:55](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product-category.ts#L55)

___

### parent\_category\_id

 **parent\_category\_id**: ``null`` \| `string`

The ID of the parent category.

#### Defined in

[packages/medusa/src/models/product-category.ts:59](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product-category.ts#L59)

___

### products

 **products**: [`Product`](Product.md)[]

The details of the products that belong to this category.

#### Defined in

[packages/medusa/src/models/product-category.ts:79](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product-category.ts#L79)

___

### rank

 **rank**: `number`

An integer that depicts the rank of category in a tree node

#### Defined in

[packages/medusa/src/models/product-category.ts:65](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product-category.ts#L65)

___

### updated\_at

 **updated\_at**: `Date`

The date with timezone at which the resource was updated.

#### Inherited from

[BaseEntity](BaseEntity.md).[updated_at](BaseEntity.md#updated_at)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/models/base-entity.ts#L19)

___

### productCategoryProductJoinTable

 `Static` **productCategoryProductJoinTable**: `string` = `"product_category_product"`

#### Defined in

[packages/medusa/src/models/product-category.ts:25](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product-category.ts#L25)

___

### treeRelations

 `Static` **treeRelations**: `string`[]

#### Defined in

[packages/medusa/src/models/product-category.ts:29](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product-category.ts#L29)

## Methods

### beforeInsert

`Private` **beforeInsert**(): `void`

#### Returns

`void`

-`void`: (optional) 

#### Defined in

[packages/medusa/src/models/product-category.ts:85](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/product-category.ts#L85)
