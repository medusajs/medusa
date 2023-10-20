---
displayed_sidebar: jsClientSidebar
---

# Class: AdminPostProductCategoriesCategoryReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AdminPostProductCategoriesCategoryReq

**`Schema`**

AdminPostProductCategoriesCategoryReq
type: object
properties:
  name:
    type: string
    description:  The name to identify the Product Category by.
  description:
    type: string
    description: An optional text field to describe the Product Category by.
  handle:
    type: string
    description:  A handle to be used in slugs.
  is_internal:
    type: boolean
    description: A flag to make product category an internal category for admins
  is_active:
    type: boolean
    description: A flag to make product category visible/hidden in the store front
  parent_category_id:
    type: string
    description: The ID of the parent product category
  rank:
    type: number
    description: The rank of the category in the tree node (starting from 0)

## Hierarchy

- [`AdminProductCategoriesReqBase`](internal-8.AdminProductCategoriesReqBase.md)

  ↳ **`AdminPostProductCategoriesCategoryReq`**

## Properties

### description

• `Optional` **description**: `string`

#### Inherited from

[AdminProductCategoriesReqBase](internal-8.AdminProductCategoriesReqBase.md).[description](internal-8.AdminProductCategoriesReqBase.md#description)

#### Defined in

packages/medusa/dist/types/product-category.d.ts:18

___

### handle

• `Optional` **handle**: `string`

#### Overrides

[AdminProductCategoriesReqBase](internal-8.AdminProductCategoriesReqBase.md).[handle](internal-8.AdminProductCategoriesReqBase.md#handle)

#### Defined in

packages/medusa/dist/api/routes/admin/product-categories/update-product-category.d.ts:101

___

### is\_active

• `Optional` **is\_active**: `boolean`

#### Inherited from

[AdminProductCategoriesReqBase](internal-8.AdminProductCategoriesReqBase.md).[is_active](internal-8.AdminProductCategoriesReqBase.md#is_active)

#### Defined in

packages/medusa/dist/types/product-category.d.ts:21

___

### is\_internal

• `Optional` **is\_internal**: `boolean`

#### Inherited from

[AdminProductCategoriesReqBase](internal-8.AdminProductCategoriesReqBase.md).[is_internal](internal-8.AdminProductCategoriesReqBase.md#is_internal)

#### Defined in

packages/medusa/dist/types/product-category.d.ts:20

___

### name

• `Optional` **name**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/product-categories/update-product-category.d.ts:100

___

### parent\_category\_id

• `Optional` **parent\_category\_id**: ``null`` \| `string`

#### Inherited from

[AdminProductCategoriesReqBase](internal-8.AdminProductCategoriesReqBase.md).[parent_category_id](internal-8.AdminProductCategoriesReqBase.md#parent_category_id)

#### Defined in

packages/medusa/dist/types/product-category.d.ts:22

___

### rank

• `Optional` **rank**: `number`

#### Defined in

packages/medusa/dist/api/routes/admin/product-categories/update-product-category.d.ts:102
