---
displayed_sidebar: jsClientSidebar
---

# Class: ProductCategory

[internal](../modules/internal-3.md).ProductCategory

Base abstract entity for all entities

## Hierarchy

- [`BaseEntity`](internal-1.BaseEntity.md)

  ↳ **`ProductCategory`**

## Properties

### beforeInsert

• `Private` **beforeInsert**: `any`

#### Defined in

packages/medusa/dist/models/product-category.d.ts:16

___

### category\_children

• **category\_children**: [`ProductCategory`](internal-3.ProductCategory.md)[]

#### Defined in

packages/medusa/dist/models/product-category.d.ts:13

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

[BaseEntity](internal-1.BaseEntity.md).[created_at](internal-1.BaseEntity.md#created_at)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:6

___

### description

• **description**: `string`

#### Defined in

packages/medusa/dist/models/product-category.d.ts:7

___

### handle

• **handle**: `string`

#### Defined in

packages/medusa/dist/models/product-category.d.ts:8

___

### id

• **id**: `string`

#### Inherited from

[BaseEntity](internal-1.BaseEntity.md).[id](internal-1.BaseEntity.md#id)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:5

___

### is\_active

• **is\_active**: [`Boolean`](../modules/internal-3.md#boolean)

#### Defined in

packages/medusa/dist/models/product-category.d.ts:9

___

### is\_internal

• **is\_internal**: [`Boolean`](../modules/internal-3.md#boolean)

#### Defined in

packages/medusa/dist/models/product-category.d.ts:10

___

### name

• **name**: `string`

#### Defined in

packages/medusa/dist/models/product-category.d.ts:6

___

### parent\_category

• **parent\_category**: ``null`` \| [`ProductCategory`](internal-3.ProductCategory.md)

#### Defined in

packages/medusa/dist/models/product-category.d.ts:11

___

### parent\_category\_id

• **parent\_category\_id**: ``null`` \| `string`

#### Defined in

packages/medusa/dist/models/product-category.d.ts:12

___

### products

• **products**: [`Product`](internal-3.Product.md)[]

#### Defined in

packages/medusa/dist/models/product-category.d.ts:15

___

### rank

• **rank**: `number`

#### Defined in

packages/medusa/dist/models/product-category.d.ts:14

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

[BaseEntity](internal-1.BaseEntity.md).[updated_at](internal-1.BaseEntity.md#updated_at)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:7

___

### productCategoryProductJoinTable

▪ `Static` **productCategoryProductJoinTable**: `string`

#### Defined in

packages/medusa/dist/models/product-category.d.ts:4

___

### treeRelations

▪ `Static` **treeRelations**: `string`[]

#### Defined in

packages/medusa/dist/models/product-category.d.ts:5
