---
displayed_sidebar: jsClientSidebar
---

# Class: AdminPostProductCategoriesReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AdminPostProductCategoriesReq

**`Schema`**

AdminPostProductCategoriesReq
type: object
required:
  - name
properties:
  name:
    type: string
    description: The name of the product category
  description:
    type: string
    description: The description of the product category.
  handle:
    type: string
    description: The handle of the product category. If none is provided, the kebab-case version of the name will be used. This field can be used as a slug in URLs.
  is_internal:
    type: boolean
    description: If set to `true`, the product category will only be available to admins.
  is_active:
    type: boolean
    description: If set to `false`, the product category will not be available in the storefront.
  parent_category_id:
    type: string
    description: The ID of the parent product category

## Hierarchy

- [`AdminProductCategoriesReqBase`](internal-8.AdminProductCategoriesReqBase.md)

  ↳ **`AdminPostProductCategoriesReq`**

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

#### Inherited from

[AdminProductCategoriesReqBase](internal-8.AdminProductCategoriesReqBase.md).[handle](internal-8.AdminProductCategoriesReqBase.md#handle)

#### Defined in

packages/medusa/dist/types/product-category.d.ts:19

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

• **name**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/product-categories/create-product-category.d.ts:98

___

### parent\_category\_id

• `Optional` **parent\_category\_id**: ``null`` \| `string`

#### Inherited from

[AdminProductCategoriesReqBase](internal-8.AdminProductCategoriesReqBase.md).[parent_category_id](internal-8.AdminProductCategoriesReqBase.md#parent_category_id)

#### Defined in

packages/medusa/dist/types/product-category.d.ts:22
