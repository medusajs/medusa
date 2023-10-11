---
displayed_sidebar: jsClientSidebar
---

# Class: AdminDeleteProductCategoriesCategoryProductsBatchReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AdminDeleteProductCategoriesCategoryProductsBatchReq

**`Schema`**

AdminDeleteProductCategoriesCategoryProductsBatchReq
type: object
required:
  - product_ids
properties:
  product_ids:
    description: The IDs of the products to delete from the Product Category.
    type: array
    items:
      type: object
      required:
        - id
      properties:
        id:
          description: The ID of a product
          type: string

## Properties

### product\_ids

• **product\_ids**: [`ProductBatchProductCategory`](internal-8.ProductBatchProductCategory.md)[]

#### Defined in

packages/medusa/dist/api/routes/admin/product-categories/delete-products-batch.d.ts:100
