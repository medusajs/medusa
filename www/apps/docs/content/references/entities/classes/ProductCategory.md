---
displayed_sidebar: entitiesSidebar
---

# Class: ProductCategory

## Hierarchy

- `BaseEntity`

  ↳ **`ProductCategory`**

## Constructors

### constructor

• **new ProductCategory**()

#### Inherited from

BaseEntity.constructor

## Properties

### category\_children

• **category\_children**: [`ProductCategory`](ProductCategory.md)[]

#### Defined in

[models/product-category.ts:56](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product-category.ts#L56)

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

BaseEntity.created\_at

#### Defined in

[interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### description

• **description**: `string`

#### Defined in

[models/product-category.ts:29](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product-category.ts#L29)

___

### handle

• **handle**: `string`

#### Defined in

[models/product-category.ts:33](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product-category.ts#L33)

___

### id

• **id**: `string`

#### Inherited from

BaseEntity.id

#### Defined in

[interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### is\_active

• **is\_active**: `Boolean`

#### Defined in

[models/product-category.ts:36](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product-category.ts#L36)

___

### is\_internal

• **is\_internal**: `Boolean`

#### Defined in

[models/product-category.ts:39](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product-category.ts#L39)

___

### name

• **name**: `string`

#### Defined in

[models/product-category.ts:26](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product-category.ts#L26)

___

### parent\_category

• **parent\_category**: ``null`` \| [`ProductCategory`](ProductCategory.md)

#### Defined in

[models/product-category.ts:49](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product-category.ts#L49)

___

### parent\_category\_id

• **parent\_category\_id**: ``null`` \| `string`

#### Defined in

[models/product-category.ts:53](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product-category.ts#L53)

___

### products

• **products**: [`Product`](Product.md)[]

#### Defined in

[models/product-category.ts:73](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product-category.ts#L73)

___

### rank

• **rank**: `number`

#### Defined in

[models/product-category.ts:59](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product-category.ts#L59)

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

BaseEntity.updated\_at

#### Defined in

[interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/models/base-entity.ts#L19)

___

### productCategoryProductJoinTable

▪ `Static` **productCategoryProductJoinTable**: `string` = `"product_category_product"`

#### Defined in

[models/product-category.ts:22](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product-category.ts#L22)

___

### treeRelations

▪ `Static` **treeRelations**: `string`[]

#### Defined in

[models/product-category.ts:23](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product-category.ts#L23)

## Methods

### beforeInsert

▸ `Private` **beforeInsert**(): `void`

#### Returns

`void`

#### Defined in

[models/product-category.ts:76](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/product-category.ts#L76)
